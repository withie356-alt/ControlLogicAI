-- 테스트 계정 생성
-- 이메일: 123@test.com
-- 비밀번호: 123123

-- 1. auth.users에 사용자 생성 (비밀번호는 bcrypt 해시)
-- 비밀번호 '123123'의 해시값
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  '123@test.com',
  crypt('123123', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"테스트사용자"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
) ON CONFLICT (email) DO NOTHING;

-- 2. public.users 프로필은 트리거가 자동으로 생성
