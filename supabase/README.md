# Supabase DB 설정 가이드

프로젝트: **AI EDU**  
Supabase URL: `https://poudbyqhmmdqrxoandhf.supabase.co`

---

## 테이블 구조

### `public.posts` — 게시글

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | uuid | PK, DEFAULT gen_random_uuid() | 게시글 고유 ID |
| `title` | text | NOT NULL | 제목 |
| `content` | text | NOT NULL | 본문 |
| `board_type` | text | NOT NULL, CHECK IN ('general','qna','notice') | 게시판 종류 |
| `author_id` | uuid | NOT NULL, FK → auth.users | 작성자 ID |
| `author_email` | text | NOT NULL | 작성자 이메일 |
| `created_at` | timestamptz | NOT NULL, DEFAULT now() | 작성일 |
| `updated_at` | timestamptz | NOT NULL, DEFAULT now() | 수정일 |

### `public.profiles` — 사용자 프로필

| 컬럼 | 타입 | 제약 | 설명 |
|---|---|---|---|
| `id` | uuid | PK, FK → auth.users | 유저 ID |
| `is_admin` | boolean | NOT NULL, DEFAULT false | 관리자 여부 |

---

## RLS(Row Level Security) 정책

### posts

| 정책명 | 명령 | 조건 |
|---|---|---|
| `posts_select_all` | SELECT | 전체 공개 |
| `posts_insert_general_qna` | INSERT | 로그인 + board_type IN ('general','qna') |
| `posts_insert_notice` | INSERT | 로그인 + board_type = 'notice' + is_admin = true |
| `posts_update_own` | UPDATE | auth.uid() = author_id |
| `posts_delete_own` | DELETE | auth.uid() = author_id |

### profiles

| 정책명 | 명령 | 조건 |
|---|---|---|
| `profiles_select_all` | SELECT | 전체 공개 (관리자 확인 쿼리에 필요) |

---

## 트리거 / 함수

| 이름 | 설명 |
|---|---|
| `fn_set_updated_at` / `trg_posts_updated_at` | posts 수정 시 updated_at 자동 갱신 |
| `fn_handle_new_user` / `trg_on_auth_user_created` | 신규 가입 시 profiles 행 자동 생성 |

---

## 실행 순서

```
Supabase Dashboard › SQL Editor
```

### Step 1 — 테이블·정책·트리거 생성

`migrations/20260610_001_init.sql` 전체 복사 → Run

### Step 2 — 관리자 계정으로 회원가입

사이트(`/login.html`)에서 관리자로 사용할 이메일로 회원가입

### Step 3 — 관리자 권한 부여

`migrations/20260610_002_admin_setup.sql` 에서  
`admin@example.com` 을 실제 이메일로 교체 후 Run

### Step 4 — 동작 확인

| 확인 항목 | 예상 결과 |
|---|---|
| 비로그인으로 게시판 접근 | 목록 조회 가능, 글쓰기 버튼 없음 |
| 일반 로그인으로 공지 글쓰기 | 차단 메시지 표시 |
| 관리자 로그인으로 공지 글쓰기 | 정상 등록 |
| 본인 글 수정/삭제 | 가능 |
| 타인 글 수정/삭제 | 차단 (RLS) |
