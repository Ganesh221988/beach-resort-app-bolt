/*
  # Properties and Room Types Schema

  1. New Tables
    - `properties` - Property listings
      - `id` (uuid, primary key)
      - `owner_id` (uuid, references user_profiles)
      - `title` (text)
      - `description` (text)
      - `address` (text)
      - `city` (text)
      - `state` (text)
      - `geo` (jsonb for lat/lng)
      - `amenities` (text array)
      - `images` (text array)
      - `video_url` (text)
      - `booking_mode` (enum)
      - `booking_types` (enum)
      - `full_villa_rates` (jsonb)
      - `policies` (jsonb)
      - `check_in_time` (time)
      - `check_out_time` (time)
      - `status` (enum)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `room_types` - Room configurations for properties
      - `id` (uuid, primary key)
      - `property_id` (uuid, references properties)
      - `title` (text)
      - `capacity` (integer)
      - `price_per_night` (decimal)
      - `price_per_hour` (decimal)
      - `extra_person_charge` (decimal)
      - `amenities` (text array)

  2. Security
    - Enable RLS on both tables
    - Owners can manage their own properties
    - Everyone can read active properties
*/

-- Create enum types
CREATE TYPE booking_mode AS ENUM ('full_villa', 'rooms_only', 'both');
CREATE TYPE booking_types AS ENUM ('daily', 'hourly', 'both');
CREATE TYPE property_status AS ENUM ('active', 'inactive', 'under_review');

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  geo jsonb DEFAULT '{}',
  amenities text[] DEFAULT '{}',
  images text[] DEFAULT '{}',
  video_url text,
  booking_mode booking_mode NOT NULL DEFAULT 'both',
  booking_types booking_types NOT NULL DEFAULT 'both',
  full_villa_rates jsonb DEFAULT '{}',
  policies jsonb DEFAULT '{}',
  check_in_time time DEFAULT '15:00',
  check_out_time time DEFAULT '11:00',
  status property_status NOT NULL DEFAULT 'under_review',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create room_types table
CREATE TABLE IF NOT EXISTS room_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  title text NOT NULL,
  capacity integer NOT NULL DEFAULT 2,
  price_per_night decimal(10,2) NOT NULL,
  price_per_hour decimal(10,2),
  extra_person_charge decimal(10,2) DEFAULT 0,
  amenities text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_types ENABLE ROW LEVEL SECURITY;

-- Properties policies
CREATE POLICY "Everyone can read active properties"
  ON properties
  FOR SELECT
  USING (status = 'active');

CREATE POLICY "Owners can read own properties"
  ON properties
  FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Owners can insert own properties"
  ON properties
  FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can update own properties"
  ON properties
  FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Admins can read all properties"
  ON properties
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Room types policies
CREATE POLICY "Everyone can read room types for active properties"
  ON room_types
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM properties 
      WHERE id = room_types.property_id AND status = 'active'
    )
  );

CREATE POLICY "Owners can manage room types for own properties"
  ON room_types
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties 
      WHERE id = room_types.property_id AND owner_id = auth.uid()
    )
  );

-- Triggers for updated_at
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_room_types_updated_at
  BEFORE UPDATE ON room_types
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_properties_owner_id ON properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_room_types_property_id ON room_types(property_id);