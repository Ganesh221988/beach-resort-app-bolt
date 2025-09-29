/*
  # Bookings and Transactions Schema

  1. New Tables
    - `bookings` - Property bookings
      - `id` (uuid, primary key)
      - `property_id` (uuid, references properties)
      - `customer_id` (uuid, references user_profiles)
      - `broker_id` (uuid, references user_profiles, nullable)
      - `owner_id` (uuid, references user_profiles)
      - `room_type_ids` (uuid array)
      - `start_date` (timestamptz)
      - `end_date` (timestamptz)
      - `duration_type` (enum)
      - `guests` (integer)
      - `total_amount` (decimal)
      - `platform_commission` (decimal)
      - `broker_commission` (decimal)
      - `net_to_owner` (decimal)
      - `status` (enum)
      - `payment_status` (enum)
      - `booking_details` (jsonb)
      - `created_at` (timestamp)

    - `transactions` - Payment transactions
    - `commissions` - Commission tracking
    - `coupons` - Discount coupons

  2. Security
    - Enable RLS on all tables
    - Users can see their own bookings
    - Owners can see bookings for their properties
    - Brokers can see their brokered bookings
*/

-- Create enum types
CREATE TYPE duration_type AS ENUM ('day', 'hour');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE payment_status AS ENUM ('pending', 'success', 'failed', 'refunded');
CREATE TYPE transaction_type AS ENUM ('payment', 'refund', 'commission', 'payout', 'subscription');
CREATE TYPE commission_status AS ENUM ('pending', 'paid');
CREATE TYPE coupon_type AS ENUM ('percentage', 'fixed');

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id),
  customer_id uuid NOT NULL REFERENCES user_profiles(id),
  broker_id uuid REFERENCES user_profiles(id),
  owner_id uuid NOT NULL REFERENCES user_profiles(id),
  room_type_ids uuid[] DEFAULT '{}',
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  duration_type duration_type NOT NULL DEFAULT 'day',
  guests integer NOT NULL DEFAULT 1,
  total_amount decimal(10,2) NOT NULL,
  platform_commission decimal(10,2) NOT NULL DEFAULT 0,
  broker_commission decimal(10,2) DEFAULT 0,
  net_to_owner decimal(10,2) NOT NULL,
  status booking_status NOT NULL DEFAULT 'pending',
  payment_status payment_status NOT NULL DEFAULT 'pending',
  booking_details jsonb DEFAULT '{}',
  coupon_code text,
  discount_amount decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id),
  user_id uuid NOT NULL REFERENCES user_profiles(id),
  amount decimal(10,2) NOT NULL,
  type transaction_type NOT NULL,
  status payment_status NOT NULL DEFAULT 'pending',
  gateway_txn_id text,
  description text NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create commissions table
CREATE TABLE IF NOT EXISTS commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id),
  broker_id uuid NOT NULL REFERENCES user_profiles(id),
  owner_id uuid NOT NULL REFERENCES user_profiles(id),
  booking_amount decimal(10,2) NOT NULL,
  platform_commission decimal(10,2) NOT NULL,
  broker_commission decimal(10,2) NOT NULL,
  net_to_owner decimal(10,2) NOT NULL,
  status commission_status NOT NULL DEFAULT 'pending',
  paid_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  type coupon_type NOT NULL,
  value decimal(10,2) NOT NULL,
  valid_from timestamptz NOT NULL,
  valid_to timestamptz NOT NULL,
  applicable_to text NOT NULL DEFAULT 'all',
  property_ids uuid[] DEFAULT '{}',
  usage_limit integer DEFAULT 1000,
  used_count integer DEFAULT 0,
  min_booking_amount decimal(10,2),
  created_by uuid NOT NULL REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now()
);

-- Create calendar_slots table for availability
CREATE TABLE IF NOT EXISTS calendar_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id),
  room_type_id uuid REFERENCES room_types(id),
  date date NOT NULL,
  hour integer,
  status text NOT NULL DEFAULT 'available',
  booking_id uuid REFERENCES bookings(id),
  price decimal(10,2),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_slots ENABLE ROW LEVEL SECURITY;

-- Bookings policies
CREATE POLICY "Users can read own bookings as customer"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

CREATE POLICY "Users can read own bookings as owner"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Users can read own bookings as broker"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (broker_id = auth.uid());

CREATE POLICY "Users can create bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    customer_id = auth.uid() OR 
    broker_id = auth.uid() OR 
    owner_id = auth.uid()
  );

-- Transactions policies
CREATE POLICY "Users can read own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Commissions policies
CREATE POLICY "Brokers can read own commissions"
  ON commissions
  FOR SELECT
  TO authenticated
  USING (broker_id = auth.uid());

CREATE POLICY "Owners can read commissions for their properties"
  ON commissions
  FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

-- Calendar slots policies
CREATE POLICY "Everyone can read calendar slots"
  ON calendar_slots
  FOR SELECT
  USING (true);

CREATE POLICY "Property owners can manage calendar slots"
  ON calendar_slots
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties 
      WHERE id = calendar_slots.property_id AND owner_id = auth.uid()
    )
  );

-- Triggers for updated_at
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_owner_id ON bookings(owner_id);
CREATE INDEX IF NOT EXISTS idx_bookings_broker_id ON bookings(broker_id);
CREATE INDEX IF NOT EXISTS idx_bookings_property_id ON bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_booking_id ON transactions(booking_id);
CREATE INDEX IF NOT EXISTS idx_commissions_broker_id ON commissions(broker_id);
CREATE INDEX IF NOT EXISTS idx_calendar_slots_property_date ON calendar_slots(property_id, date);