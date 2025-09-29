/*
  # Create Integration Tables

  1. New Tables
    - `user_integrations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to user_profiles)
      - `integration_type` (enum: razorpay, mailchimp, instagram, facebook)
      - `integration_data` (jsonb, encrypted sensitive data)
      - `is_enabled` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `admin_integrations`
      - `id` (uuid, primary key)
      - `integration_type` (enum: razorpay, mailchimp)
      - `integration_data` (jsonb, encrypted sensitive data)
      - `is_enabled` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Users can only access their own integrations
    - Admins can access admin integrations
*/

-- Create enum for integration types
CREATE TYPE integration_type AS ENUM (
  'razorpay',
  'mailchimp', 
  'instagram',
  'facebook'
);

-- Create user_integrations table
CREATE TABLE IF NOT EXISTS user_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  integration_type integration_type NOT NULL,
  integration_data jsonb NOT NULL DEFAULT '{}',
  is_enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure one integration per type per user
  UNIQUE(user_id, integration_type)
);

-- Create admin_integrations table
CREATE TABLE IF NOT EXISTS admin_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_type integration_type NOT NULL,
  integration_data jsonb NOT NULL DEFAULT '{}',
  is_enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure one integration per type for admin
  UNIQUE(integration_type)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_integrations_user_id ON user_integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_integrations_type ON user_integrations(integration_type);
CREATE INDEX IF NOT EXISTS idx_admin_integrations_type ON admin_integrations(integration_type);

-- Enable Row Level Security
ALTER TABLE user_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_integrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_integrations
CREATE POLICY "Users can manage own integrations"
  ON user_integrations
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can read all user integrations"
  ON user_integrations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for admin_integrations
CREATE POLICY "Only admins can manage admin integrations"
  ON admin_integrations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_integrations_updated_at
  BEFORE UPDATE ON user_integrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_integrations_updated_at
  BEFORE UPDATE ON admin_integrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin integrations (disabled by default)
INSERT INTO admin_integrations (integration_type, integration_data, is_enabled)
VALUES 
  ('razorpay', '{"key_id": "", "key_secret": "", "webhook_secret": ""}', false),
  ('mailchimp', '{"api_key": "", "server_prefix": "", "list_id": ""}', false)
ON CONFLICT (integration_type) DO NOTHING;