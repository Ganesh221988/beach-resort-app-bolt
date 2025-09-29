/*
  # Admin Settings and Configuration Schema

  1. New Tables
    - `admin_settings` - Platform configuration
      - `id` (uuid, primary key)
      - `key` (text, unique)
      - `value` (jsonb)
      - `description` (text)
      - `updated_by` (uuid, references user_profiles)
      - `updated_at` (timestamp)

    - `subscription_plans` - Dynamic subscription plans
      - `id` (uuid, primary key)
      - `name` (text)
      - `type` (enum: owner, broker)
      - `pricing_model` (enum: percentage, flat)
      - `percentage` (decimal)
      - `flat_rate` (decimal)
      - `billing_cycle` (enum: monthly, yearly)
      - `features` (text array)
      - `is_active` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Only admins can manage settings and plans
    - Everyone can read active subscription plans
*/

-- Create enum types
CREATE TYPE plan_type AS ENUM ('owner', 'broker');
CREATE TYPE pricing_model AS ENUM ('percentage', 'flat');
CREATE TYPE billing_cycle AS ENUM ('monthly', 'yearly');

-- Create admin_settings table
CREATE TABLE IF NOT EXISTS admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT '{}',
  description text,
  updated_by uuid REFERENCES user_profiles(id),
  updated_at timestamptz DEFAULT now()
);

-- Create subscription_plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type plan_type NOT NULL,
  pricing_model pricing_model NOT NULL,
  percentage decimal(5,2),
  flat_rate decimal(10,2),
  billing_cycle billing_cycle NOT NULL DEFAULT 'monthly',
  features text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

-- Admin settings policies
CREATE POLICY "Only admins can read admin settings"
  ON admin_settings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can manage admin settings"
  ON admin_settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Subscription plans policies
CREATE POLICY "Everyone can read active subscription plans"
  ON subscription_plans
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Only admins can manage subscription plans"
  ON subscription_plans
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Triggers for updated_at
CREATE TRIGGER update_admin_settings_updated_at
  BEFORE UPDATE ON admin_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_plans_updated_at
  BEFORE UPDATE ON subscription_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin settings
INSERT INTO admin_settings (key, value, description) VALUES
  ('company_profile', '{"company_name": "ECR Beach Resorts", "admin_name": "Admin User", "email": "admin@ecrbeachresorts.com", "phone": "+91 9876543210", "address": "Mumbai, Maharashtra, India"}', 'Company profile information'),
  ('razorpay_config', '{"enabled": false, "key_id": "", "key_secret": "", "webhook_secret": ""}', 'Razorpay payment gateway configuration'),
  ('mailchimp_config', '{"enabled": false, "api_key": "", "server_prefix": "", "list_id": ""}', 'Mailchimp email marketing configuration'),
  ('platform_settings', '{"platform_commission": 10, "broker_commission_rate": 20}', 'Platform commission and settings')
ON CONFLICT (key) DO NOTHING;

-- Insert default subscription plans
INSERT INTO subscription_plans (name, type, pricing_model, percentage, flat_rate, billing_cycle, features) VALUES
  ('Free', 'owner', 'percentage', 10.0, NULL, 'monthly', ARRAY['List up to 2 properties', 'Basic booking management', 'Email support', '10% platform commission']),
  ('Owner Pro', 'owner', 'percentage', 8.0, NULL, 'monthly', ARRAY['Unlimited properties', 'Advanced analytics dashboard', 'Priority support', 'Calendar management', '8% platform commission', 'Custom pricing rules', 'Bulk operations']),
  ('Enterprise', 'owner', 'percentage', 5.0, NULL, 'monthly', ARRAY['Everything in Pro', 'Dedicated account manager', 'Custom integrations', 'White-label options', '5% platform commission', 'API access', 'Advanced reporting']),
  ('Free', 'broker', 'percentage', 15.0, NULL, 'monthly', ARRAY['Up to 10 bookings/month', 'Basic commission tracking', 'Email support', '15% commission rate']),
  ('Broker Plus', 'broker', 'percentage', 20.0, NULL, 'monthly', ARRAY['Unlimited bookings', 'Advanced commission tracking', 'Customer management tools', 'Priority support', '20% commission rate', 'Marketing materials', 'Performance analytics']),
  ('Broker Pro', 'broker', 'percentage', 25.0, NULL, 'monthly', ARRAY['Everything in Plus', 'Team management', 'Custom branding', 'API access', '25% commission rate', 'Dedicated support', 'Advanced reporting'])
ON CONFLICT DO NOTHING;