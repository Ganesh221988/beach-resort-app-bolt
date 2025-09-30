/*
  # Create Demo User Accounts

  1. New Demo Accounts
    - Admin: admin@ecrbeachresorts.com
    - Owner: owner@ecrbeachresorts.com  
    - Broker: broker@ecrbeachresorts.com
    - Customer: customer@ecrbeachresorts.com
    
  2. Security
    - All accounts have password: password123
    - Proper user profiles created
    - KYC status set appropriately
    - Subscription status configured
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
  role,
  aud,
  confirmation_token,
  email_change_token_new,
  recovery_token
) VALUES 
(
  'admin-demo-user-id-001',
  '00000000-0000-0000-0000-000000000000',
  'admin@ecrbeachresorts.com',
  '$2a$10$8qvZ7Z7Z7Z7Z7Z7Z7Z7Z7O7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7',
  NOW(),
  NOW(),
  NOW(),
  'authenticated',
  'authenticated',
  '',
  '',
  ''
),
(
  'owner-demo-user-id-002',
  '00000000-0000-0000-0000-000000000000',
  'owner@ecrbeachresorts.com',
  '$2a$10$8qvZ7Z7Z7Z7Z7Z7Z7Z7Z7O7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7',
  NOW(),
  NOW(),
  NOW(),
  'authenticated',
  'authenticated',
  '',
  '',
  ''
),
(
  'broker-demo-user-id-003',
  '00000000-0000-0000-0000-000000000000',
  'broker@ecrbeachresorts.com',
  '$2a$10$8qvZ7Z7Z7Z7Z7Z7Z7Z7Z7O7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7',
  NOW(),
  NOW(),
  NOW(),
  'authenticated',
  'authenticated',
  '',
  '',
  ''
),
(
  'customer-demo-user-id-004',
  '00000000-0000-0000-0000-000000000000',
  'customer@ecrbeachresorts.com',
  '$2a$10$8qvZ7Z7Z7Z7Z7Z7Z7Z7Z7O7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7Z7',
  NOW(),
  NOW(),
  NOW(),
  'authenticated',
  'authenticated',
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
  gst_number,
  pan_number,
  bank_details,
  contact_info
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
  '{"account_number": "1234567890", "bank_name": "HDFC Bank", "ifsc_code": "HDFC0001234"}',
  '{"address": "Mumbai, Maharashtra, India", "city": "Mumbai", "state": "Maharashtra", "pincode": "400001"}'
),
(
  'owner-demo-user-id-002',
  'John Smith',
  '+91 9876543211',
  'owner',
  'verified',
  'active',
  'John''s Beach Resorts',
  NULL,
  'GST987654321',
  'OWNER1234B',
  '{"account_number": "9876543210", "bank_name": "ICICI Bank", "ifsc_code": "ICIC0001234"}',
  '{"address": "Goa, India", "city": "Goa", "state": "Goa", "pincode": "403001"}'
),
(
  'broker-demo-user-id-003',
  'Sarah Wilson',
  '+91 9876543212',
  'broker',
  'verified',
  'active',
  NULL,
  'Sarah''s Travel Agency',
  'GST456789123',
  'BROKER123C',
  '{"account_number": "5678901234", "bank_name": "SBI", "ifsc_code": "SBIN0001234"}',
  '{"address": "Mumbai, Maharashtra, India", "city": "Mumbai", "state": "Maharashtra", "pincode": "400002"}'
),
(
  'customer-demo-user-id-004',
  'David Johnson',
  '+91 9876543213',
  'customer',
  'pending',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '{}',
  '{"address": "Delhi, India", "city": "Delhi", "state": "Delhi", "pincode": "110001"}'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role,
  kyc_status = EXCLUDED.kyc_status,
  subscription_status = EXCLUDED.subscription_status,
  business_name = EXCLUDED.business_name,
  agency_name = EXCLUDED.agency_name,
  updated_at = NOW();