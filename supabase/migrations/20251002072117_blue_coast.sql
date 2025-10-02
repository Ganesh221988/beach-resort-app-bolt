/*
  # Create Demo User Accounts

  1. Demo Users
    - Admin: admin@ecrbeachresorts.com
    - Owner: owner@ecrbeachresorts.com  
    - Broker: broker@ecrbeachresorts.com
    - Customer: customer@ecrbeachresorts.com
    
  2. User Profiles
    - Complete profile data for each role
    - Proper KYC status and subscription settings
    - Bank details and contact information
    
  3. Security
    - All users have verified KYC status
    - Proper role assignments
    - Subscription status for business users
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
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role,
  aud,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES 
(
  'admin-demo-user-id-001',
  '00000000-0000-0000-0000-000000000000',
  'admin@ecrbeachresorts.com',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Admin User", "role": "admin"}',
  false,
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  ''
),
(
  'owner-demo-user-id-001', 
  '00000000-0000-0000-0000-000000000000',
  'owner@ecrbeachresorts.com',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "John Smith", "role": "owner"}',
  false,
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  ''
),
(
  'broker-demo-user-id-001',
  '00000000-0000-0000-0000-000000000000', 
  'broker@ecrbeachresorts.com',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Sarah Wilson", "role": "broker"}',
  false,
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  ''
),
(
  'customer-demo-user-id-001',
  '00000000-0000-0000-0000-000000000000',
  'customer@ecrbeachresorts.com', 
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "David Johnson", "role": "customer"}',
  false,
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  ''
) ON CONFLICT (email) DO NOTHING;

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
  gst_number,
  pan_number,
  license_number,
  bank_details,
  contact_info,
  integrations
) VALUES 
(
  'admin-demo-user-id-001',
  'Admin User',
  '+91 9876543210',
  'admin',
  'verified',
  'active',
  'ECR Beach Resorts',
  NULL,
  'GST123456789',
  'ADMIN1234A',
  NULL,
  '{"account_number": "1234567890", "bank_name": "HDFC Bank", "ifsc_code": "HDFC0001234"}',
  '{"address": "Mumbai, Maharashtra, India", "city": "Mumbai", "state": "Maharashtra", "pincode": "400001"}',
  '{}'
),
(
  'owner-demo-user-id-001',
  'John Smith', 
  '+91 9876543211',
  'owner',
  'verified',
  'active',
  'John''s Beach Resorts',
  NULL,
  'GST987654321',
  'OWNER1234B',
  NULL,
  '{"account_number": "9876543210", "bank_name": "ICICI Bank", "ifsc_code": "ICIC0001234"}',
  '{"address": "Goa, India", "city": "Goa", "state": "Goa", "pincode": "403001"}',
  '{}'
),
(
  'broker-demo-user-id-001',
  'Sarah Wilson',
  '+91 9876543212', 
  'broker',
  'verified',
  'active',
  NULL,
  'Sarah''s Travel Agency',
  'GST456789123',
  'BROKER123C',
  'TL123456789',
  '{"account_number": "5555666677", "bank_name": "SBI Bank", "ifsc_code": "SBIN0001234"}',
  '{"address": "Mumbai, Maharashtra, India", "city": "Mumbai", "state": "Maharashtra", "pincode": "400002"}',
  '{}'
),
(
  'customer-demo-user-id-001',
  'David Johnson',
  '+91 9876543213',
  'customer', 
  'verified',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '{}',
  '{"address": "Delhi, India", "city": "Delhi", "state": "Delhi", "pincode": "110001"}',
  '{}'
) ON CONFLICT (id) DO NOTHING;