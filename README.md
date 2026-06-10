# AI EDU — AI 전문 교육 플랫폼

> AI 기초부터 리터러시까지, 체계적인 동영상 강의와 커뮤니티 게시판을 제공하는 온라인 교육 플랫폼

**라이브 데모:** https://jeongwoo-pjw.github.io/start04/

---

## 주요 기능

| 기능 | 설명 |
|---|---|
| AI 동영상 강의 | YouTube 연동 강의 목록 / 페이지네이션 / 모달 플레이어 |
| AI 리터러시 | 별도 강의 섹션 및 커리큘럼 안내 |
| 다크/라이트 모드 | 5가지 컬러 팔레트 + 테마 토글 |
| 회원가입 / 로그인 | 이메일·비밀번호 인증 (Supabase Auth) |
| 게시판 (일반) | 로그인 유저 CRUD |
| Q&A 게시판 | 로그인 유저 질문 작성 |
| 공지사항 | 관리자(Admin)만 작성, 전체 공개 |

---

## 기술 스택

- **Frontend** — 바닐라 JavaScript · HTML5 · CSS3 (프레임워크 없음)
- **Backend / DB** — [Supabase](https://supabase.com) (PostgreSQL + Row Level Security)
- **인증** — Supabase Auth (이메일 + 비밀번호)
- **배포** — GitHub Pages (`gh-pages` 패키지)

---

## 프로젝트 구조

```
start04/
├── index.html            # 메인 페이지 (강의 목록, 소개)
├── login.html            # 로그인 / 회원가입
├── board.html            # 게시판 목록 (?type=notice|qna|general)
├── board-write.html      # 글쓰기 / 수정
├── board-detail.html     # 게시글 상세
├── assets/
│   ├── css/
│   │   ├── main.css      # 메인 디자인 시스템 (토큰, 컴포넌트)
│   │   └── board.css     # 게시판 / 인증 전용 스타일
│   └── js/
│       ├── app.js              # 메인 페이지 인터랙션
│       ├── supabase-client.js  # Supabase 클라이언트 초기화
│       ├── auth.js             # 로그인 / 회원가입 로직
│       ├── board.js            # 게시판 목록 + 권한 분기
│       ├── board-write.js      # 글쓰기 / 수정 로직
│       └── board-detail.js     # 상세 보기 + 삭제
├── scripts/
│   └── predeploy.js      # 빌드 스크립트 (dist/ 생성)
├── DEVLOG.md             # 개발일지
└── README.md
```

---

## Supabase 테이블 구조

### `posts`
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid | PK |
| title | text | 제목 |
| content | text | 본문 |
| board_type | text | `general` / `qna` / `notice` |
| author_id | uuid | auth.users FK |
| author_email | text | 작성자 이메일 |
| created_at | timestamptz | 작성일 |
| updated_at | timestamptz | 수정일 |

### `profiles`
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid | auth.users FK |
| is_admin | boolean | 관리자 여부 |

### Row Level Security 정책
- `posts` 읽기 — 전체 공개
- `posts` 쓰기 (general / qna) — 로그인 유저
- `posts` 쓰기 (notice) — `profiles.is_admin = true` 인 유저만
- `posts` 수정 / 삭제 — 작성자 본인만

---

## 로컬 실행

```bash
# 의존성 설치
npm install

# 정적 파일이므로 index.html 직접 열기 또는
# VS Code Live Server 확장 사용 권장
```

## 빌드 & 배포

```bash
npm run deploy
```

> `predeploy.js`가 `dist/`를 생성하고, `gh-pages`가 GitHub Pages에 자동 배포합니다.

---

## 관리자 설정

Supabase SQL Editor에서 실행:

```sql
UPDATE public.profiles
SET is_admin = true
WHERE id = (SELECT id FROM auth.users WHERE email = '관리자_이메일');
```

---

## 라이선스

MIT
