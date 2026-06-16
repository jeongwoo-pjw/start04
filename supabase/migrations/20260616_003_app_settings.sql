-- ============================================================
-- app_settings 테이블 — API 키 등 앱 설정값 저장
-- Supabase Dashboard › SQL Editor 에서 실행
-- ============================================================

CREATE TABLE IF NOT EXISTS public.app_settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "app_settings_select_anon" ON public.app_settings;

-- 비로그인 포함 누구나 읽기 가능 (API 키 로드에 필요)
CREATE POLICY "app_settings_select_anon"
  ON public.app_settings
  FOR SELECT
  USING (true);

-- ── API 키 삽입 ─────────────────────────────────────────────
-- ※ 실제 키 값은 Supabase Dashboard SQL Editor 에서 직접 입력하세요.
--   아래 YOUR_SOLAR_API_KEY / YOUR_OPENAI_API_KEY 를 실제 값으로 교체 후 실행.
INSERT INTO public.app_settings (key, value)
VALUES
  ('solar_api_key',  'YOUR_SOLAR_API_KEY'),
  ('openai_api_key', 'YOUR_OPENAI_API_KEY')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
