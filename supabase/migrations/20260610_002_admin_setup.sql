-- ============================================================
-- AI EDU — 관리자 계정 설정
-- 실행 조건: 001_init.sql 완료 + 관리자 계정으로 회원가입 완료 후 실행
-- ============================================================

-- 'admin@example.com' 자리에 실제 관리자 이메일 입력 후 실행
UPDATE public.profiles
SET    is_admin = true
WHERE  id = (
  SELECT id
  FROM   auth.users
  WHERE  email = 'admin@example.com'
  LIMIT  1
);

-- 실행 결과 확인
SELECT
  u.email,
  p.is_admin,
  p.id
FROM  public.profiles p
JOIN  auth.users      u ON u.id = p.id
WHERE p.is_admin = true;
