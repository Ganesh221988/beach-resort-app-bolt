/*
  # Insert Demo Data for ECR Beach Resorts

  1. Demo Users
    - Admin, Owner, Broker, Customer accounts
    - Proper authentication setup
    - Complete profile information

  2. Sample Properties
    - Luxury properties with room types
    - Complete amenities and pricing
    - High-quality images

  3. Sample Bookings
    - Various booking scenarios
    - Commission calculations
    - Different payment statuses

  4. Configuration Data
    - Subscription plans
    - Admin settings
    - Sample coupons
*/

-- Insert demo users into auth.users first
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    invited_at,
    confirmation_token,
    confirmation_sent_at,
    recovery_token,
    recovery_sent_at,
    email_change_token_new,
    email_change,
    email_change_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    phone,
    phone_confirmed_at,
    phone_change,
    phone_change_token,
    phone_change_sent_at,
    email_change_token_current,
    email_change_confirm_status,
    banned_until,
    reauthentication_token,
    reauthentication_sent_at
) VALUES 
(
    '00000000-0000-0000-0000-000000000000',
    'ADMIN001',
    'authenticated',
    'authenticated',
    'admin@ecrbeachresorts.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    '',
    now(),
    '',
    null,
    '',
    '',
    null,
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "Admin User", "role": "admin"}',
    false,
    now(),
    now(),
    null,
    null,
    '',
    '',
    null,
    '',
    0,
    null,
    '',
    null
),
(
    '00000000-0000-0000-0000-000000000000',
    'ECO2547001',
    'authenticated',
    'authenticated',
    'owner@ecrbeachresorts.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    '',
    now(),
    '',
    null,
    '',
    '',
    null,
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "John Smith", "role": "owner"}',
    false,
    now(),
    now(),
    null,
    null,
    '',
    '',
    null,
    '',
    0,
    null,
    '',
    null
),
(
    '00000000-0000-0000-0000-000000000000',
    'ECB3547001',
    'authenticated',
    'authenticated',
    'broker@ecrbeachresorts.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    '',
    now(),
    '',
    null,
    '',
    '',
    null,
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "Sarah Wilson", "role": "broker"}',
    false,
    now(),
    now(),
    null,
    null,
    '',
    '',
    null,
    '',
    0,
    null,
    '',
    null
),
(
    '00000000-0000-0000-0000-000000000000',
    'ECC1547001',
    'authenticated',
    'authenticated',
    'customer@ecrbeachresorts.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    '',
    now(),
    '',
    null,
    '',
    '',
    null,
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "David Johnson", "role": "customer"}',
    false,
    now(),
    now(),
    null,
    null,
    '',
    '',
    null,
    '',
    0,
    null,
    '',
    null
)
ON CONFLICT (id) DO NOTHING;

-- Insert user profiles (these will be created automatically by trigger, but we can update them)
INSERT INTO user_profiles (
    id, name, phone, role, kyc_status, subscription_status, 
    business_name, agency_name, gst_number, pan_number, license_number,
    bank_details, contact_info
) VALUES 
(
    'ADMIN001',
    'Admin User',
    '+91 9876543210',
    'admin',
    'verified',
    'active',
    'ECR Beach Resorts',
    null,
    'GST000000001',
    'ADMIN1234A',
    null,
    '{"account_number": "1111111111", "bank_name": "HDFC Bank", "ifsc_code": "HDFC0000001"}',
    '{"address": "Mumbai, Maharashtra, India", "city": "Mumbai", "state": "Maharashtra", "pincode": "400001"}'
),
(
    'ECO2547001',
    'John Smith',
    '+91 9876543211',
    'owner',
    'verified',
    'active',
    'John\'s Beach Resorts',
    null,
    'GST123456789',
    'ABCDE1234F',
    null,
    '{"account_number": "1234567890", "bank_name": "HDFC Bank", "ifsc_code": "HDFC0001234"}',
    '{"address": "Goa, India", "city": "Goa", "state": "Goa", "pincode": "403001"}'
),
(
    'ECB3547001',
    'Sarah Wilson',
    '+91 9876543212',
    'broker',
    'verified',
    'active',
    null,
    'Sarah\'s Travel Agency',
    'GST987654321',
    'FGHIJ5678K',
    'TL123456789',
    '{"account_number": "9876543210", "bank_name": "ICICI Bank", "ifsc_code": "ICIC0001234"}',
    '{"address": "Mumbai, Maharashtra, India", "city": "Mumbai", "state": "Maharashtra", "pincode": "400002"}'
),
(
    'ECC1547001',
    'David Johnson',
    '+91 9876543213',
    'customer',
    'verified',
    null,
    null,
    null,
    null,
    null,
    null,
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
    gst_number = EXCLUDED.gst_number,
    pan_number = EXCLUDED.pan_number,
    license_number = EXCLUDED.license_number,
    bank_details = EXCLUDED.bank_details,
    contact_info = EXCLUDED.contact_info;

-- Insert sample properties
INSERT INTO properties (
    id, owner_id, title, description, address, city, state, geo,
    amenities, images, video_url, booking_mode, booking_types,
    full_villa_rates, policies, check_in_time, check_out_time, status
) VALUES 
(
    'PROP001',
    'ECO2547001',
    'Luxury Beachside Villa',
    'Stunning 4-bedroom villa with private beach access, infinity pool, and modern amenities. Perfect for families and groups seeking luxury and comfort by the sea.',
    '123 Beach Road, Calangute, Goa',
    'Goa',
    'Goa',
    '{"lat": 15.2993, "lng": 74.1240}',
    ARRAY['Private Pool', 'Beach Access', 'WiFi', 'AC', 'Kitchen', 'Parking', 'Garden', 'Balcony'],
    ARRAY[
        'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg',
        'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg',
        'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
        'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg'
    ],
    'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    'both',
    'both',
    '{"daily_rate": 25000, "hourly_rate": 3500}',
    '{"cancellation": "Free cancellation up to 24 hours before check-in", "pets": "Pets allowed with prior approval", "smoking": "No smoking inside the property"}',
    '15:00',
    '11:00',
    'active'
),
(
    'PROP002',
    'ECO2547001',
    'Mountain View Resort',
    'Peaceful resort nestled in the hills with panoramic mountain views. Ideal for romantic getaways and wellness retreats away from city life.',
    '456 Hill Station Road, Old Manali',
    'Manali',
    'Himachal Pradesh',
    '{"lat": 32.2396, "lng": 77.1887}',
    ARRAY['Mountain View', 'Spa', 'Restaurant', 'WiFi', 'Fireplace', 'Trekking', 'Hot Tub'],
    ARRAY[
        'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg',
        'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg',
        'https://images.pexels.com/photos/2506988/pexels-photo-2506988.jpeg'
    ],
    'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
    'rooms_only',
    'daily',
    '{"daily_rate": 18000, "hourly_rate": 2500}',
    '{"cancellation": "Free cancellation up to 48 hours before check-in", "pets": "No pets allowed", "smoking": "Designated smoking areas only"}',
    '14:00',
    '12:00',
    'active'
)
ON CONFLICT (id) DO NOTHING;

-- Insert room types
INSERT INTO room_types (
    id, property_id, title, capacity, price_per_night, price_per_hour, extra_person_charge, amenities
) VALUES 
(
    'ROOM001',
    'PROP001',
    'Master Suite',
    2,
    8500,
    1200,
    500,
    ARRAY['King Bed', 'Private Bathroom', 'Balcony', 'AC', 'Mini Bar']
),
(
    'ROOM002',
    'PROP001',
    'Standard Room',
    2,
    6500,
    900,
    300,
    ARRAY['Queen Bed', 'Private Bathroom', 'AC', 'WiFi']
),
(
    'ROOM003',
    'PROP002',
    'Deluxe Suite',
    3,
    7200,
    1000,
    400,
    ARRAY['King Bed', 'Mountain View', 'Fireplace', 'Mini Bar', 'Spa Access']
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample bookings
INSERT INTO bookings (
    id, property_id, customer_id, broker_id, owner_id, room_type_ids,
    start_date, end_date, duration_type, guests, total_amount,
    platform_commission, broker_commission, net_to_owner,
    status, payment_status, coupon_code, discount_amount
) VALUES 
(
    'BOOK001',
    'PROP001',
    'ECC1547001',
    'ECB3547001',
    'ECO2547001',
    ARRAY['ROOM001'],
    '2024-03-15T15:00:00Z',
    '2024-03-18T11:00:00Z',
    'day',
    2,
    25500,
    2550,
    510,
    22440,
    'confirmed',
    'success',
    null,
    0
),
(
    'BOOK002',
    'PROP002',
    'ECC1547001',
    null,
    'ECO2547001',
    ARRAY['ROOM003'],
    '2024-04-10T10:00:00Z',
    '2024-04-10T16:00:00Z',
    'hour',
    2,
    6000,
    600,
    null,
    5400,
    'pending',
    'pending',
    'WELCOME20',
    1200
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample transactions
INSERT INTO transactions (
    id, booking_id, user_id, amount, type, status, gateway_txn_id, description
) VALUES 
(
    'TXN001',
    'BOOK001',
    'ECC1547001',
    25500,
    'payment',
    'success',
    'razorpay_123456789',
    'Booking payment for Luxury Beachside Villa'
),
(
    'TXN002',
    'BOOK001',
    'ECB3547001',
    510,
    'commission',
    'pending',
    null,
    'Broker commission for booking #BOOK001'
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample commissions
INSERT INTO commissions (
    id, booking_id, broker_id, owner_id, booking_amount,
    platform_commission, broker_commission, net_to_owner, status
) VALUES 
(
    'COMM001',
    'BOOK001',
    'ECB3547001',
    'ECO2547001',
    25500,
    2550,
    510,
    22440,
    'pending'
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample coupons
INSERT INTO coupons (
    id, code, type, value, valid_from, valid_to, applicable_to,
    usage_limit, used_count, created_by, min_booking_amount
) VALUES 
(
    'COUP001',
    'WELCOME20',
    'percentage',
    20,
    '2024-03-01T00:00:00Z',
    '2024-06-30T23:59:59Z',
    'all',
    1000,
    45,
    'ADMIN001',
    5000
),
(
    'COUP002',
    'BEACH500',
    'fixed',
    500,
    '2024-03-01T00:00:00Z',
    '2024-05-31T23:59:59Z',
    'property',
    100,
    12,
    'ECO2547001',
    10000
)
ON CONFLICT (id) DO NOTHING;

-- Insert subscription plans
INSERT INTO subscription_plans (
    id, name, type, pricing_model, percentage, flat_rate, billing_cycle, features, is_active
) VALUES 
(
    'PLAN001',
    'Owner Free',
    'owner',
    'percentage',
    10,
    null,
    'monthly',
    ARRAY['List up to 2 properties', 'Basic booking management', 'Email support'],
    true
),
(
    'PLAN002',
    'Owner Pro',
    'owner',
    'percentage',
    8,
    null,
    'monthly',
    ARRAY['Unlimited properties', 'Advanced analytics', 'Priority support', 'Calendar management', 'Social media marketing'],
    true
),
(
    'PLAN003',
    'Broker Free',
    'broker',
    'flat',
    null,
    0,
    'monthly',
    ARRAY['Up to 10 bookings/month', 'Basic commission tracking', 'Email support'],
    true
),
(
    'PLAN004',
    'Broker Plus',
    'broker',
    'flat',
    null,
    999,
    'monthly',
    ARRAY['Unlimited bookings', 'Advanced commission tracking', 'Customer management', 'Marketing tools'],
    true
)
ON CONFLICT (id) DO NOTHING;

-- Insert admin settings
INSERT INTO admin_settings (
    id, key, value, description, updated_by
) VALUES 
(
    'SET001',
    'platform_commission_rate',
    '10',
    'Platform commission percentage on bookings',
    'ADMIN001'
),
(
    'SET002',
    'broker_commission_rate',
    '20',
    'Broker commission percentage of platform commission',
    'ADMIN001'
),
(
    'SET003',
    'company_info',
    '{"name": "ECR Beach Resorts", "email": "info@ecrbeachresorts.com", "phone": "+91 98765 43210", "address": "Mumbai, Maharashtra, India"}',
    'Company contact information',
    'ADMIN001'
)
ON CONFLICT (key) DO NOTHING;