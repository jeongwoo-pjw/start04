-- ============================================================
-- AI EDU — 초기 DB 마이그레이션
-- 실행 위치 : Supabase Dashboard › SQL Editor
-- 실행 방법 : 전체 선택(Ctrl+A) 후 Run
-- 재실행 안전 : IF NOT EXISTS / OR REPLACE 사용으로 중복 실행 가능
-- ============================================================


-- ────────────────────────────────────────
-- 1. posts 테이블
-- ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.posts (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text        NOT NULL,
  content      text        NOT NULL,
  board_type   text        NOT NULL DEFAULT 'general'
                           CHECK (board_type IN ('general', 'qna', 'notice')),
  author_id    uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_email text        NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;


-- ────────────────────────────────────────
-- 2. profiles 테이블
-- ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id       uuid    PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  is_admin boolean NOT NULL DEFAULT false
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;


-- ────────────────────────────────────────
-- 3. posts RLS 정책
-- ────────────────────────────────────────

DROP POLICY IF EXISTS "posts_select_all"        ON public.posts;
DROP POLICY IF EXISTS "posts_insert_general_qna" ON public.posts;
DROP POLICY IF EXISTS "posts_insert_notice"      ON public.posts;
DROP POLICY IF EXISTS "posts_update_own"         ON public.posts;
DROP POLICY IF EXISTS "posts_delete_own"         ON public.posts;

-- 읽기: 누구나 (비로그인 포함)
CREATE POLICY "posts_select_all"
  ON public.posts
  FOR SELECT
  USING (true);

-- 쓰기: 일반·Q&A — 로그인 유저
CREATE POLICY "posts_insert_general_qna"
  ON public.posts
  FOR INSERT
  WITH CHECK (
    auth.uid() = author_id
    AND board_type IN ('general', 'qna')
  );

-- 쓰기: 공지 — 관리자만
CREATE POLICY "posts_insert_notice"
  ON public.posts
  FOR INSERT
  WITH CHECK (
    auth.uid() = author_id
    AND board_type = 'notice'
    AND EXISTS (
      SELECT 1
      FROM   public.profiles
      WHERE  public.profiles.id       = auth.uid()
        AND  public.profiles.is_admin = true
    )
  );

-- 수정: 작성자 본인만
CREATE POLICY "posts_update_own"
  ON public.posts
  FOR UPDATE
  USING (auth.uid() = author_id);

-- 삭제: 작성자 본인만
CREATE POLICY "posts_delete_own"
  ON public.posts
  FOR DELETE
  USING (auth.uid() = author_id);


-- ────────────────────────────────────────
-- 4. profiles RLS 정책
-- ────────────────────────────────────────

DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;

-- 읽기: 누구나 (관리자 확인 쿼리에 필요)
CREATE POLICY "profiles_select_all"
  ON public.profiles
  FOR SELECT
  USING (true);


-- ────────────────────────────────────────
-- 5. updated_at 자동 갱신 함수·트리거
-- ────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.fn_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_posts_updated_at ON public.posts;

CREATE TRIGGER trg_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE PROCEDURE public.fn_set_updated_at();


-- ────────────────────────────────────────
-- 6. 신규 가입 시 profiles 자동 생성 함수·트리거
--    SECURITY DEFINER: RLS를 우회해 함수 소유자 권한으로 실행
-- ────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.fn_handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_on_auth_user_created ON auth.users;

CREATE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.fn_handle_new_user();


-- ────────────────────────────────────────
-- 7. 기존 가입 유저 profiles 일괄 생성
--    ON CONFLICT 다중 줄 파싱 오류 방지:
--    WHERE NOT IN 방식으로 중복 방지
-- ────────────────────────────────────────
INSERT INTO public.profiles (id)
SELECT u.id
FROM   auth.users u
WHERE  u.id NOT IN (SELECT p.id FROM public.profiles p);
