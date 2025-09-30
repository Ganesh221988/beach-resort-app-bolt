/*
  # Create Demo Accounts

  1. Demo Users
    - Creates 4 demo accounts with different roles
    - Admin: admin@ecrbeachresorts.com
    - Owner: owner@ecrbeachresorts.com  
    - Broker: broker@ecrbeachresorts.com
    - Customer: customer@ecrbeachresorts.com
    - All accounts use password: password123

  2. User Profiles
    - Creates corresponding user profiles for each demo account
    - Sets appropriate roles and KYC status
    - Adds sample contact information

  3. Security
    - Uses proper password hashing
    - Sets email confirmation as not required for demo accounts
*/

-- Insert demo users into auth.users table
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES 
  (
    '00000000-0000-0000-0000-000000000001'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'admin@ecrbeachresorts.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '',
    '',
    '',
    ''
  ),
  (
    '00000000-0000-0000-0000-000000000002'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'owner@ecrbeachresorts.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '',
    '',
    '',
    ''
  ),
  (
    '00000000-0000-0000-0000-000000000003'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'broker@ecrbeachresorts.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '',
    '',
    '',
    ''
  ),
  (
    '00000000-0000-0000-0000-000000000004'::uuid,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'customer@ecrbeachresorts.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '',
    '',
    '',
    ''
  )
ON CONFLICT (email) DO NOTHING;

-- Insert corresponding user profiles
INSERT INTO user_profiles (
  id,
  name,
  phone,
  role,
  kyc_status,
  subscription_status,
  business_name,
  agency_name,
  contact_info,
  created_at,
  updated_at
) VALUES 
  (
    '00000000-0000-0000-0000-000000000001'::uuid,
    'Admin User',
    '+91 9876543210',
    'admin'::user_role,
    'verified'::kyc_status,
    NULL,
    'ECR Beach Resorts',
    NULL,
    '{"address": "ECR Main Road, Chennai", "city": "Chennai", "state": "Tamil Nadu"}'::jsonb,
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000002'::uuid,
    'Property Owner',
    '+91 9876543211',
    'owner'::user_role,
    'verified'::kyc_status,
    'active'::subscription_status,
    'Seaside Resorts Pvt Ltd',
    NULL,
    '{"address": "Beach Road, Mahabalipuram", "city": "Mahabalipuram", "state": "Tamil Nadu"}'::jsonb,
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000003'::uuid,
    'Travel Broker',
    '+91 9876543212',
    'broker'::user_role,
    'verified'::kyc_status,
    'active'::subscription_status,
    NULL,
    'Coastal Travel Agency',
    '{"address": "OMR, Chennai", "city": "Chennai", "state": "Tamil Nadu"}'::jsonb,
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000004'::uuid,
    'John Customer',
    '+91 9876543213',
    'customer'::user_role,
    'pending'::kyc_status,
    NULL,
    NULL,
    NULL,
    '{"address": "IT Corridor, Chennai", "city": "Chennai", "state": "Tamil Nadu"}'::jsonb,
    now(),
    now()
  )
ON CONFLICT (id) DO NOTHING;