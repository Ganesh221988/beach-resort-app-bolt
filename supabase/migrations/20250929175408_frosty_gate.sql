/*
  # User Management and Authentication Schema

  1. New Tables
    - `user_profiles` - Extended user information beyond Supabase auth
      - `id` (uuid, references auth.users)
      - `name` (text)
      - `phone` (text)
      - `role` (enum: admin, owner, broker, customer)
      - `kyc_status` (enum: pending, verified, rejected)
      - `subscription_status` (enum: active, inactive, trial)
      - `business_name` (text, nullable)
      - `agency_name` (text, nullable)
      - `bank_details` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_profiles` table
    - Add policies for users to read/update their own profiles
    - Add policy for admins to read all profiles
*/

-- Create enum types
CREATE TYPE user_role AS ENUM ('admin', 'owner', 'broker', 'customer');
CREATE TYPE kyc_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE subscription_status AS ENUM ('active', 'inactive', 'trial');

-- Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text,
  role user_role NOT NULL DEFAULT 'customer',
  kyc_status kyc_status NOT NULL DEFAULT 'pending',
  subscription_status subscription_status,
  business_name text,
  agency_name text,
  gst_number text,
  pan_number text,
  license_number text,
  bank_details jsonb DEFAULT '{}',
  contact_info jsonb DEFAULT '{}',
  integrations jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO user_profiles (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();