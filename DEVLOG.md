# 개발일지 — AI EDU 프로젝트

> 프로젝트: `start04` / 저장소: https://github.com/jeongwoo-pjw/start04  
> 배포 주소: https://jeongwoo-pjw.github.io/start04/  
> 기술 스택: Vanilla JS · HTML · CSS · Supabase · GitHub Pages

---

## 2024년 — 초기 구축

### v0.1 — 프로젝트 초기 설정 (`Initial commit`)

- 저장소 생성 및 기본 디렉터리 구조 확립
- HTML 단일 페이지 구조 설계
- Google Fonts(Noto Sans KR, Inter) 연결

---

### v0.2 — AI EDU 사이트 초기 구축 (`AI EDU 온라인 교육 사이트 초기 구축`)

**구현 내용**

- **메인 페이지(index.html)** 전체 레이아웃 완성
  - Header: 반응형 네비게이션, 모바일 햄버거 메뉴
  - Hero: 통계 배지(수강생 500+, 강의 50+, 만족도 98%)
  - Feature 섹션: 4개 핵심 가치 카드
  - AI 동영상 / AI 리터러시 강의 섹션
  - About, Contact, Footer

- **디자인 시스템(main.css)** 구축
  - CSS 토큰: `--midnight`, `--royal`, `--azure`, `--gold`, `--teal`
  - 다크/라이트 모드 `data-theme` 속성 기반 전환
  - 5가지 컬러 팔레트 드롭다운 지원
  - 반응형 그리드 레이아웃

- **app.js** 핵심 기능
  - `VideoSection` 클래스: 2×3 그리드 + 페이지네이션
  - YouTube 모달 플레이어(자동재생, ESC 닫기)
  - IntersectionObserver 스크롤 애니메이션
  - 헤더 스크롤 감지 및 active nav 처리

---

### v0.3 — 배포 환경 설정 (`gh-pages 배포 설정 + 실제 YouTube 영상 ID 업데이트`)

- `gh-pages` 패키지 도입 — GitHub Pages 자동 배포 파이프라인 구성
- `scripts/predeploy.js`: `dist/` 디렉터리 생성 및 파일 복사 스크립트
- `package.json` scripts: `predeploy` → `deploy` 순서 실행
- 실제 YouTube 영상 ID로 강의 콘텐츠 교체
- `.nojekyll` 자동 생성으로 Jekyll 빌드 우회

---

### v0.4 — UI 개선 (`컬러 팔레트 스트립 제거 + Hero 라이트 모드 적용`)

- 푸터 컬러 팔레트 dot 스트립 제거 (디자인 단순화)
- Hero 섹션 라이트 모드 배경/텍스트 색상 최적화
- 전반적인 라이트 테마 가독성 개선

---

## 2026년 — Supabase 연동 및 게시판 기능 추가

### v1.0 — Supabase 연동 · 로그인 · 게시판 CRUD (`feat: Supabase 연동 로그인 및 게시판 구현`)

**배경**

정적 사이트에서 실제 사용자 데이터를 다룰 필요가 생겨 Supabase를 백엔드로 도입. 서버 없이 브라우저에서 직접 Supabase JS SDK로 DB 접근.

**구현 내용**

- **Supabase 연동** (`assets/js/supabase-client.js`)
  - CDN 방식으로 `@supabase/supabase-js@2` 로드
  - `window.sb`로 전역 클라이언트 노출

- **인증** (`login.html`, `assets/js/auth.js`)
  - 로그인 / 회원가입 탭 전환 UI
  - `signInWithPassword` / `signUp` API 호출
  - 이미 로그인된 경우 게시판으로 자동 리다이렉트
  - 에러 메시지 한국어 처리

- **게시판 목록** (`board.html`, `assets/js/board.js`)
  - 10개 단위 서버사이드 페이지네이션
  - 로그인 상태에 따라 글쓰기 버튼 노출
  - 로그아웃 버튼 및 사용자 이메일 표시

- **글쓰기 / 수정** (`board-write.html`, `assets/js/board-write.js`)
  - 미로그인 시 login.html 리다이렉트
  - `?id=` 파라미터로 수정 모드 자동 전환
  - 본인 게시글만 수정 가능 (author_id 검증)

- **게시글 상세** (`board-detail.html`, `assets/js/board-detail.js`)
  - 본문 줄바꿈 보존 (`nl2br`)
  - 작성자 본인에게만 수정/삭제 버튼 노출
  - 삭제 전 확인 모달

- **공통 스타일** (`assets/css/board.css`)
  - 기존 `main.css` 디자인 토큰 재사용
  - 인증 카드, 게시판 테이블, 페이지네이션 컴포넌트

- **Supabase DB 설계**
  ```sql
  posts (id, title, content, author_id, author_email, created_at, updated_at)
  ```
  - RLS: 읽기 전체 공개 / 쓰기·수정·삭제 본인만

**트러블슈팅**

- Supabase 새 publishable key 형식(`sb_publishable_`) — 기존 JWT anon key 대신 적용

---

### v1.1 — 게시판 다종화 · 관리자 권한 분리 (`feat: 공지/Q&A 게시판 추가 및 관리자 권한 분리`)

**배경**

단일 게시판에서 공지사항(관리자 전용)과 Q&A(로그인 필수)를 분리해야 할 필요 발생. 별도 테이블 대신 `board_type` 컬럼으로 확장하여 단일 테이블 유지.

**구현 내용**

- **DB 확장**
  - `posts.board_type` 컬럼 추가: `'general'` / `'qna'` / `'notice'`
  - `profiles(id, is_admin)` 테이블 신설
  - 신규 가입 시 자동 프로필 생성 트리거(`handle_new_user`)
  - RLS 정책 세분화:
    - 공지 작성 → `profiles.is_admin = true` 조건
    - 일반/Q&A 작성 → `auth.uid() = author_id` 조건

- **게시판 목록** (`board.js`)
  - `?type=` URL 파라미터로 board_type 필터링
  - 관리자 여부(`checkAdmin`) 비동기 확인
  - 공지 게시판: 비관리자에게 "🔒 관리자만 작성 가능" 배지 표시
  - 비로그인: "로그인 후 작성 가능" 버튼 표시
  - 게시판별 빈 메시지 개별 설정

- **글쓰기** (`board-write.js`)
  - `board_type` 파라미터 읽어 insert 시 포함
  - 공지 게시판 접근 시 관리자 확인 후 차단
  - 저장 후 해당 board_type 목록으로 리다이렉트

- **게시글 상세** (`board-detail.js`)
  - 게시판 타입 뱃지 표시
  - 뒤로가기 버튼: 원래 게시판으로 정확히 이동

- **UI**
  - 헤더 네비게이션에 📢 공지 / 💬 Q&A / 📋 게시판 링크 추가
  - 현재 게시판 활성 스타일(`nav-board-active`)
  - `.board-type-chip` — 게시글 상단 게시판 타입 표시
  - `.admin-only-badge` — 관리자 전용 안내

---

## 아키텍처 결정 기록

| 결정 | 이유 |
|---|---|
| 바닐라 JS 유지 | 기존 사이트 기반, 번들러 없이 GitHub Pages 배포 가능 |
| Supabase CDN | 서버 없이 브라우저 직접 통신, 빠른 프로토타이핑 |
| 단일 테이블 `board_type` | 게시판별 테이블 분리보다 조회 쿼리 간결 |
| RLS 기반 권한 | 프론트 검증만 믿지 않고 DB 레벨에서 강제 |
| `?type=` URL 파라미터 | HTML 파일 중복 없이 게시판 확장 가능 |

---

## 앞으로 할 일

- [ ] 댓글 기능 (posts_comments 테이블)
- [ ] 파일 첨부 (Supabase Storage)
- [ ] 검색 기능 (posts.title full-text search)
- [ ] Q&A 답변 채택 기능
- [ ] 소셜 로그인 (Google OAuth)
