/*
  # Create marketing campaigns and social media posts tables

  1. New Tables
    - `marketing_campaigns`
      - `id` (uuid, primary key)
      - `property_id` (uuid, foreign key to properties)
      - `owner_id` (uuid, foreign key to user_profiles)
      - `frequency` (enum: every_2_days, weekly, monthly)
      - `is_active` (boolean)
      - `instagram_enabled` (boolean)
      - `facebook_enabled` (boolean)
      - `last_posted_at` (timestamp)
      - `next_post_at` (timestamp)
      - `post_content_template` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `social_media_posts`
      - `id` (uuid, primary key)
      - `campaign_id` (uuid, foreign key to marketing_campaigns)
      - `property_id` (uuid, foreign key to properties)
      - `platform` (enum: instagram, facebook)
      - `post_content` (text)
      - `images` (text array)
      - `posted_at` (timestamp)
      - `engagement_stats` (jsonb)
      - `status` (enum: scheduled, posted, failed)
      - `external_post_id` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for owners to manage their own campaigns and posts
    - Add policies for admins to view all campaigns

  3. Enums
    - `marketing_frequency` enum for campaign frequency options
    - `social_platform` enum for social media platforms
    - `post_status` enum for post status tracking
*/

-- Create enums
CREATE TYPE marketing_frequency AS ENUM ('every_2_days', 'weekly', 'monthly');
CREATE TYPE social_platform AS ENUM ('instagram', 'facebook');
CREATE TYPE post_status AS ENUM ('scheduled', 'posted', 'failed');

-- Create marketing_campaigns table
CREATE TABLE IF NOT EXISTS marketing_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  frequency marketing_frequency DEFAULT 'weekly',
  is_active boolean DEFAULT false,
  instagram_enabled boolean DEFAULT false,
  facebook_enabled boolean DEFAULT false,
  last_posted_at timestamptz,
  next_post_at timestamptz,
  post_content_template jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create social_media_posts table
CREATE TABLE IF NOT EXISTS social_media_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  platform social_platform NOT NULL,
  post_content text NOT NULL,
  images text[] DEFAULT '{}',
  posted_at timestamptz,
  engagement_stats jsonb DEFAULT '{}',
  status post_status DEFAULT 'scheduled',
  external_post_id text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_owner_id ON marketing_campaigns(owner_id);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_property_id ON marketing_campaigns(property_id);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_next_post ON marketing_campaigns(next_post_at) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_social_media_posts_campaign_id ON social_media_posts(campaign_id);
CREATE INDEX IF NOT EXISTS idx_social_media_posts_platform ON social_media_posts(platform);
CREATE INDEX IF NOT EXISTS idx_social_media_posts_status ON social_media_posts(status);

-- Enable RLS
ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for marketing_campaigns
CREATE POLICY "Owners can manage own marketing campaigns"
  ON marketing_campaigns
  FOR ALL
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Admins can read all marketing campaigns"
  ON marketing_campaigns
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- RLS Policies for social_media_posts
CREATE POLICY "Owners can read own social media posts"
  ON social_media_posts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM marketing_campaigns
      WHERE marketing_campaigns.id = social_media_posts.campaign_id
      AND marketing_campaigns.owner_id = auth.uid()
    )
  );

CREATE POLICY "System can insert social media posts"
  ON social_media_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM marketing_campaigns
      WHERE marketing_campaigns.id = social_media_posts.campaign_id
      AND marketing_campaigns.owner_id = auth.uid()
    )
  );

CREATE POLICY "Admins can read all social media posts"
  ON social_media_posts
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Create triggers for updated_at
CREATE TRIGGER update_marketing_campaigns_updated_at
  BEFORE UPDATE ON marketing_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();