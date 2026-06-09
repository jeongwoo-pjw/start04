/* ============================================================
   AI EDU — app.js
   start02(JWIT) 개발 패턴 기반:
   - localStorage 기반 다크/라이트 + 5가지 컬러 팔레트
   - 스크롤 반응형 헤더 + 모바일 햄버거 메뉴
   - VideoSection 클래스: 2×3 그리드 + 페이지네이션
   - YouTube 임베드 모달
   - IntersectionObserver 스크롤 리빌
   ============================================================ */

'use strict';

/* ────────────────────────────────────────────────────────────
   1. COLOR PALETTES  (start02 ThemeContext 패턴 이식)
   ──────────────────────────────────────────────────────────── */
const PALETTES = [
  {
    id: 'dark-blue',
    label: '다크블루',
    swatch: '#3b82f6',
    vars: {
      '--royal':    '#1e3a8a',
      '--azure':    '#3b82f6',
      '--azure-lt': '#60a5fa',
      '--gold':     '#f59e0b',
      '--gold-lt':  '#fbbf24',
      '--teal':     '#06b6d4',
      '--teal-lt':  '#22d3ee',
    },
  },
  {
    id: 'midnight',
    label: '미드나잇',
    swatch: '#7c3aed',
    vars: {
      '--royal':    '#4c1d95',
      '--azure':    '#7c3aed',
      '--azure-lt': '#a78bfa',
      '--gold':     '#f59e0b',
      '--gold-lt':  '#fcd34d',
      '--teal':     '#8b5cf6',
      '--teal-lt':  '#c4b5fd',
    },
  },
  {
    id: 'ocean',
    label: '오션',
    swatch: '#0891b2',
    vars: {
      '--royal':    '#164e63',
      '--azure':    '#0891b2',
      '--azure-lt': '#22d3ee',
      '--gold':     '#10b981',
      '--gold-lt':  '#34d399',
      '--teal':     '#06b6d4',
      '--teal-lt':  '#67e8f9',
    },
  },
  {
    id: 'sunset',
    label: '선셋',
    swatch: '#ea580c',
    vars: {
      '--royal':    '#7c2d12',
      '--azure':    '#ea580c',
      '--azure-lt': '#fb923c',
      '--gold':     '#eab308',
      '--gold-lt':  '#fde047',
      '--teal':     '#dc2626',
      '--teal-lt':  '#f87171',
    },
  },
  {
    id: 'nature',
    label: '네이처',
    swatch: '#16a34a',
    vars: {
      '--royal':    '#14532d',
      '--azure':    '#16a34a',
      '--azure-lt': '#4ade80',
      '--gold':     '#ca8a04',
      '--gold-lt':  '#fde047',
      '--teal':     '#0d9488',
      '--teal-lt':  '#2dd4bf',
    },
  },
];

/* ────────────────────────────────────────────────────────────
   2. VIDEO DATA  (실제 YouTube 영상 ID)
   ──────────────────────────────────────────────────────────── */
const AI_VIDEOS = [
  {
    videoId: 'nWABdc4boN8',
    title: '초간단! AI 기초 강의 — AI·머신러닝·딥러닝 개념정리',
    desc: '인공지능, 머신러닝, 딥러닝의 핵심 개념을 한 번에 정리합니다.',
    duration: '13:42',
    date: '2024-03-10',
    category: 'AI 기초',
    views: '28k',
  },
  {
    videoId: 'i_kQw-8JKdU',
    title: '더 늦기 전에 알아두는 인공지능 AI 기초원리',
    desc: 'AI의 기본 원리와 현실 적용 사례를 누구나 이해할 수 있게 설명합니다.',
    duration: '18:55',
    date: '2024-04-02',
    category: 'AI 기초',
    views: '15k',
  },
  {
    videoId: 'oyzIT1g1Z3U',
    title: '머신러닝 강의 1편 — 카카오 추천팀 출신 KAIST AI박사',
    desc: '데이터 과학 전문가가 알려주는 머신러닝 핵심 이론과 실전 응용.',
    duration: '58:20',
    date: '2024-02-15',
    category: '머신러닝',
    views: '62k',
  },
  {
    videoId: 'CgSvahZkJmc',
    title: '머신러닝 입문강의 2024 — 국내 Top AI대학원 박사',
    desc: '최신 머신러닝 트렌드와 실용적인 알고리즘을 체계적으로 학습합니다.',
    duration: '44:10',
    date: '2024-05-20',
    category: '머신러닝',
    views: '41k',
  },
  {
    videoId: 'nHt7BHyJGko',
    title: '딥러닝 1강 — AI and Neural Network (한국어)',
    desc: '인공 신경망의 구조와 딥러닝의 핵심 원리를 단계별로 이해합니다.',
    duration: '31:08',
    date: '2024-01-18',
    category: '딥러닝',
    views: '35k',
  },
  {
    videoId: 'U57LVkQVf4o',
    title: 'ㄹㅇ쉬운 딥러닝 1강 — 머신러닝 개념부터 중학교 레벨로',
    desc: '복잡한 딥러닝 개념을 누구나 이해할 수 있는 쉬운 언어로 풀어냅니다.',
    duration: '22:33',
    date: '2024-03-28',
    category: '딥러닝',
    views: '87k',
  },
  {
    videoId: 'osv2csoHVAo',
    title: 'LLM 바닥부터 만들기 — 대형언어모델 1시간 핵심 정리',
    desc: 'ChatGPT와 같은 대형 언어 모델의 사전학습 원리와 구조를 심층 분석합니다.',
    duration: '1:02:15',
    date: '2024-06-01',
    category: 'LLM/생성형 AI',
    views: '53k',
  },
  {
    videoId: '-vnxFKHmKjc',
    title: 'ChatGPT의 원리 — 대규모 언어 모델(LLM) 개념 정리',
    desc: 'ChatGPT가 어떻게 동작하는지, LLM의 핵심 구조와 학습 방법을 알아봅니다.',
    duration: '24:47',
    date: '2024-04-15',
    category: 'LLM/생성형 AI',
    views: '120k',
  },
  {
    videoId: '9f2_8e3PtLI',
    title: '컴퓨터 비전 개념과 응용분야 17분 정리 — AI대학원 출신',
    desc: 'AI가 이미지를 보는 방법, 컴퓨터 비전의 핵심 개념과 실제 응용 분야를 소개합니다.',
    duration: '17:22',
    date: '2024-05-05',
    category: '컴퓨터 비전',
    views: '19k',
  },
  {
    videoId: 'RLTFzcGvHFg',
    title: '강화학습 기초 및 실습 01 — Introduction to RL',
    desc: '강화학습의 기초 개념부터 실제 구현까지, 입문자를 위한 체계적인 강의입니다.',
    duration: '48:30',
    date: '2024-02-28',
    category: '강화학습',
    views: '24k',
  },
  {
    videoId: 'j-t2eqezCkA',
    title: '자연어처리(NLP) AI 핵심원리 — word2vec·BERT·GPT 딥러닝',
    desc: '텍스트를 이해하는 AI 기술, NLP의 발전 과정과 핵심 알고리즘을 한눈에 정리합니다.',
    duration: '29:18',
    date: '2024-03-22',
    category: 'NLP',
    views: '31k',
  },
  {
    videoId: 'jPBevYJ-6pI',
    title: '생성형 AI 교육 — 업무에 AI 제대로 쓰려면 이것부터',
    desc: '생성형 AI의 핵심 원리를 10분 만에 정리하고 실무에서 바로 활용하는 방법을 배웁니다.',
    duration: '10:45',
    date: '2024-06-10',
    category: '생성형 AI',
    views: '76k',
  },
];

const LITERACY_VIDEOS = [
  {
    videoId: 'eEU2t8ey3qQ',
    title: 'AI 리터러시 널 이해해보겠어',
    desc: 'AI 리터러시가 무엇인지, 왜 현대인에게 필수 역량인지 쉽게 풀어냅니다.',
    duration: '11:20',
    date: '2024-02-10',
    category: 'AI 리터러시 개념',
    views: '18k',
  },
  {
    videoId: 'XV18VA2_aHg',
    title: '[ICT가 좋다] AI 리터러시? AI는 이제 선택이 아닌 필수',
    desc: 'AI 시대에 반드시 갖춰야 할 AI 리터러시의 의미와 실천 방법을 알아봅니다.',
    duration: '8:45',
    date: '2024-03-05',
    category: 'AI 리터러시 개념',
    views: '9k',
  },
  {
    videoId: '20IL3NcvEPo',
    title: '인공지능 시대의 문해력, AI 리터러시 — AI 기술의 이해',
    desc: 'AI를 비판적으로 이해하고 활용하는 AI 문해력의 핵심 개념을 다룹니다.',
    duration: '19:35',
    date: '2024-01-25',
    category: 'AI 리터러시',
    views: '12k',
  },
  {
    videoId: 'VOCeRGyp-Fs',
    title: '[AI리터러시] 학생에게 AI를 어떻게 가르칠까? — AI 리터러시 교육 1부',
    desc: 'AI 교육의 현장, 학생들에게 AI를 효과적으로 가르치는 방법을 탐구합니다.',
    duration: '26:10',
    date: '2024-04-20',
    category: 'AI 교육',
    views: '7k',
  },
  {
    videoId: '9nFk5hq9m_0',
    title: '[AI리터러시] AI 시대, 교사는 사라질까? — AI 리터러시의 의미 2부',
    desc: '교육 현장에서 AI의 역할과 미래 교육의 방향을 교사와 학생 관점에서 논의합니다.',
    duration: '22:48',
    date: '2024-04-27',
    category: 'AI 교육',
    views: '8k',
  },
  {
    videoId: 'pGByFXOtAh8',
    title: '챗GPT 실력자 되는 법 — 프롬프트 엔지니어링 기술 5가지',
    desc: 'AI 성능을 146% 높이는 프롬프트 작성 기법 5가지를 실전 예시와 함께 배웁니다.',
    duration: '15:22',
    date: '2024-05-08',
    category: '프롬프트 엔지니어링',
    views: '142k',
  },
  {
    videoId: 'Q0Kzsda5K9I',
    title: '[생성형 AI 교육] 이것만 알면 ChatGPT 고수 — 프롬프트 엔지니어링 실전',
    desc: 'ChatGPT를 제대로 활용하는 프롬프트 엔지니어링 실전 전략을 집중 훈련합니다.',
    duration: '18:55',
    date: '2024-06-05',
    category: '프롬프트 엔지니어링',
    views: '95k',
  },
  {
    videoId: 'QQSZWDdkuxA',
    title: '청소년 딥페이크 사이버범죄 예방 교육영상',
    desc: '딥페이크 기술의 위험성과 조작된 미디어를 식별하는 방법을 청소년 눈높이로 설명합니다.',
    duration: '12:18',
    date: '2024-03-18',
    category: '딥페이크/미디어 리터러시',
    views: '44k',
  },
  {
    videoId: 'IqLJv8Y4NoE',
    title: '[사이언스포럼] AI도 윤리적 판단을 할 수 있을까? — YTN 사이언스',
    desc: 'AI의 윤리적 판단 능력과 한계, 그리고 우리 사회에 미치는 영향을 전문가와 토론합니다.',
    duration: '23:40',
    date: '2024-02-22',
    category: 'AI 윤리',
    views: '21k',
  },
  {
    videoId: 'HAMkbqo0dVQ',
    title: 'AI 윤리 국가표준 첫 제정 — YTN 사이언스',
    desc: '국가 차원의 AI 윤리 표준 제정 배경과 주요 내용, AI 편향성 문제를 짚어봅니다.',
    duration: '6:32',
    date: '2024-04-10',
    category: 'AI 윤리/정책',
    views: '16k',
  },
  {
    videoId: 'XyghibTfoP8',
    title: '이미지 생성 AI 업무에 활용하기 — AI 전문가 특강 (서울시교육청)',
    desc: '이미지 생성 AI를 업무와 교육 현장에서 실제로 활용하는 방법을 전문가가 직접 알려줍니다.',
    duration: '35:15',
    date: '2024-05-15',
    category: 'AI 도구 활용',
    views: '33k',
  },
  {
    videoId: 'GuV80VALL5A',
    title: '생성형 AI 활용 실제 수업 설계 — 국어·미술·도덕 연계',
    desc: '생성형 AI를 교과 수업에 연계한 실제 수업 사례와 설계 방법을 소개합니다.',
    duration: '41:28',
    date: '2024-06-08',
    category: 'AI 교육/창의성',
    views: '27k',
  },
];

/* ────────────────────────────────────────────────────────────
   3. THEME SYSTEM  (start02 ThemeContext 이식 → 순수 JS)
   ──────────────────────────────────────────────────────────── */
const ThemeSystem = (() => {
  const root = document.documentElement;

  function applyPalette(id) {
    const palette = PALETTES.find(p => p.id === id) || PALETTES[0];
    Object.entries(palette.vars).forEach(([k, v]) => root.style.setProperty(k, v));
    localStorage.setItem('aiedu-palette', id);
  }

  function applyTheme(isDark) {
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('aiedu-dark', isDark ? '1' : '0');
    const icon = document.querySelector('.theme-toggle');
    if (icon) icon.setAttribute('aria-label', isDark ? '라이트 모드로 전환' : '다크 모드로 전환');
  }

  function isDark() {
    return root.getAttribute('data-theme') === 'dark';
  }

  function init() {
    const savedDark    = localStorage.getItem('aiedu-dark');
    const savedPalette = localStorage.getItem('aiedu-palette') || 'dark-blue';
    const dark = savedDark === null ? true : savedDark === '1';
    applyTheme(dark);
    applyPalette(savedPalette);
  }

  function toggle() {
    applyTheme(!isDark());
  }

  return { init, toggle, applyPalette, isDark, palettes: PALETTES };
})();

/* ────────────────────────────────────────────────────────────
   4. PALETTE DROPDOWN  (start02 Header palette dropdown 이식)
   ──────────────────────────────────────────────────────────── */
function buildPaletteDropdown() {
  const wrap = document.createElement('div');
  wrap.className = 'palette-wrap';
  wrap.innerHTML = `
    <button class="palette-btn" aria-label="컬러 테마 선택" aria-expanded="false">
      <span class="palette-dot"></span>
      <span class="palette-caret">▾</span>
    </button>
    <div class="palette-dropdown" hidden>
      <p class="palette-label">컬러 테마</p>
      ${ThemeSystem.palettes.map(p => `
        <button class="palette-item" data-pid="${p.id}">
          <span class="palette-swatch" style="background:${p.swatch}"></span>
          <span>${p.label}</span>
          <span class="palette-check" aria-hidden="true">✓</span>
        </button>
      `).join('')}
    </div>
  `;
  return wrap;
}

/* ────────────────────────────────────────────────────────────
   5. VIDEO SECTION CLASS
   ──────────────────────────────────────────────────────────── */
class VideoSection {
  constructor(videos, gridId, paginationId, perPage = 6) {
    this.videos     = videos;
    this.gridEl     = document.getElementById(gridId);
    this.pagEl      = document.getElementById(paginationId);
    this.perPage    = perPage;
    this.page       = 1;
    this.totalPages = Math.ceil(videos.length / perPage);
    if (!this.gridEl || !this.pagEl) return;
    this._bindEvents();
    this.render();
  }

  _bindEvents() {
    this.pagEl.addEventListener('click', e => {
      const btn = e.target.closest('[data-page]');
      if (!btn || btn.disabled) return;
      const val = btn.dataset.page;
      if (val === 'prev') this.goto(this.page - 1);
      else if (val === 'next') this.goto(this.page + 1);
      else this.goto(+val);
    });
    this.gridEl.addEventListener('click', e => {
      const card = e.target.closest('[data-vid]');
      if (!card) return;
      openModal(
        card.dataset.vid,
        card.dataset.title,
        card.dataset.desc,
        card.dataset.cat
      );
    });
    this.gridEl.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        const card = e.target.closest('[data-vid]');
        if (card) { e.preventDefault(); card.click(); }
      }
    });
  }

  goto(page) {
    if (page < 1 || page > this.totalPages) return;
    this.page = page;
    this.render();
    this.gridEl.closest('.section').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  render() { this._renderGrid(); this._renderPag(); }

  _renderGrid() {
    const start = (this.page - 1) * this.perPage;
    this.gridEl.innerHTML = this.videos
      .slice(start, start + this.perPage)
      .map(v => this._cardHtml(v))
      .join('');
    // reveal animation
    this.gridEl.querySelectorAll('.vcard').forEach((c, i) => {
      c.style.animationDelay = `${i * 60}ms`;
      c.classList.add('vcard-in');
    });
  }

  _renderPag() {
    const { page, totalPages } = this;
    let html = `<button class="pag-btn" data-page="prev" ${page === 1 ? 'disabled' : ''} aria-label="이전 페이지">◀</button>`;
    for (let i = 1; i <= totalPages; i++) {
      html += `<button class="pag-btn ${i === page ? 'active' : ''}" data-page="${i}" aria-current="${i === page ? 'page' : ''}">${i}</button>`;
    }
    html += `<button class="pag-btn" data-page="next" ${page === totalPages ? 'disabled' : ''} aria-label="다음 페이지">▶</button>`;
    this.pagEl.innerHTML = html;
  }

  _cardHtml(v) {
    const thumb = `https://img.youtube.com/vi/${v.videoId}/maxresdefault.jpg`;
    const safeTitle = v.title.replace(/"/g, '&quot;');
    const safeDesc  = v.desc.replace(/"/g, '&quot;');
    const safeCat   = v.category.replace(/"/g, '&quot;');
    return `
      <article class="vcard" tabindex="0" role="button"
        data-vid="${v.videoId}"
        data-title="${safeTitle}"
        data-desc="${safeDesc}"
        data-cat="${safeCat}"
        aria-label="${safeTitle} 영상 재생">
        <div class="vthumb">
          <img src="${thumb}"
               alt="${safeTitle} 썸네일"
               loading="lazy"
               onerror="this.style.display='none'">
          <div class="vthumb-placeholder" aria-hidden="true">🎬</div>
          <div class="vplay" aria-hidden="true">▶</div>
          <span class="vduration">${v.duration}</span>
        </div>
        <div class="vinfo">
          <span class="vcat">${v.category}</span>
          <h3 class="vtitle">${v.title}</h3>
          <p class="vdesc">${v.desc}</p>
          <div class="vmeta">
            <span>📅 ${v.date}</span>
            <span>👁 ${v.views}</span>
          </div>
        </div>
      </article>`;
  }
}

/* ────────────────────────────────────────────────────────────
   6. VIDEO MODAL
   ──────────────────────────────────────────────────────────── */
const modal   = document.getElementById('videoModal');
const iframe  = document.getElementById('modalIframe');
const mTitle  = document.getElementById('modalTitle');
const mDesc   = document.getElementById('modalDesc');
const mCat    = document.getElementById('modalCategory');
const mClose  = document.getElementById('modalClose');

function openModal(videoId, title, desc, category) {
  iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  mTitle.textContent    = title;
  mDesc.textContent     = desc;
  mCat.textContent      = category;
  mCat.className        = 'modal-category badge teal';
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  mClose.focus();
}

function closeModal() {
  modal.classList.remove('open');
  iframe.src = '';
  document.body.style.overflow = '';
}

mClose.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ────────────────────────────────────────────────────────────
   7. HEADER  (start02 Header 동작 이식)
   ──────────────────────────────────────────────────────────── */
function initHeader() {
  const header  = document.getElementById('header');
  const burger  = document.getElementById('burger');
  const nav     = document.getElementById('nav');
  const overlay = document.getElementById('mobileOverlay');
  const navLinks = document.querySelectorAll('.nav-link');
  const themeBtn = document.getElementById('themeToggle');

  /* Palette dropdown */
  const paletteWrap = buildPaletteDropdown();
  header.querySelector('.header-actions').prepend(paletteWrap);
  const paletteBtn  = paletteWrap.querySelector('.palette-btn');
  const paletteDrop = paletteWrap.querySelector('.palette-dropdown');
  const paletteDot  = paletteWrap.querySelector('.palette-dot');

  function updatePaletteDot() {
    const id = localStorage.getItem('aiedu-palette') || 'dark-blue';
    const p  = PALETTES.find(x => x.id === id) || PALETTES[0];
    paletteDot.style.background = p.swatch;
    paletteWrap.querySelectorAll('.palette-item').forEach(btn => {
      const active = btn.dataset.pid === id;
      btn.classList.toggle('active', active);
      btn.querySelector('.palette-check').style.visibility = active ? 'visible' : 'hidden';
    });
  }
  updatePaletteDot();

  paletteBtn.addEventListener('click', e => {
    e.stopPropagation();
    const open = !paletteDrop.hidden;
    paletteDrop.hidden = open;
    paletteBtn.setAttribute('aria-expanded', !open);
  });
  paletteWrap.addEventListener('click', e => {
    const item = e.target.closest('.palette-item');
    if (!item) return;
    ThemeSystem.applyPalette(item.dataset.pid);
    paletteDrop.hidden = true;
    paletteBtn.setAttribute('aria-expanded', 'false');
    updatePaletteDot();
  });
  document.addEventListener('click', e => {
    if (!paletteWrap.contains(e.target)) {
      paletteDrop.hidden = true;
      paletteBtn.setAttribute('aria-expanded', 'false');
    }
  });

  /* Theme toggle */
  themeBtn.addEventListener('click', () => ThemeSystem.toggle());

  /* Burger / mobile nav */
  function openMenu() {
    nav.classList.add('open');
    overlay.classList.add('open');
    burger.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    nav.classList.remove('open');
    overlay.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', () => nav.classList.contains('open') ? closeMenu() : openMenu());
  overlay.addEventListener('click', closeMenu);
  navLinks.forEach(a => a.addEventListener('click', closeMenu));

  /* Scroll: header style + active nav (start02 패턴) */
  const sections = document.querySelectorAll('section[id]');
  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 50);

    // Active link
    let current = '';
    sections.forEach(s => {
      if (y >= s.offsetTop - 100) current = s.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.dataset.nav === current);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ────────────────────────────────────────────────────────────
   8. SCROLL REVEAL  (IntersectionObserver)
   ──────────────────────────────────────────────────────────── */
function initReveal() {
  const targets = document.querySelectorAll(
    '.feat-card, .section-hd, .about-content, .about-stat, .contact-item, .contact-form'
  );
  targets.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => io.observe(el));
}

/* ────────────────────────────────────────────────────────────
   9. CONTACT FORM
   ──────────────────────────────────────────────────────────── */
function initContactForm() {
  const form   = document.getElementById('contactForm');
  const notice = document.getElementById('formNotice');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = '전송 중...';
    // 실제 서버 연동 전 시뮬레이션 (EmailJS 등으로 교체 가능)
    setTimeout(() => {
      notice.textContent = '✅ 문의가 성공적으로 접수되었습니다. 빠른 시일 내 답변 드리겠습니다.';
      notice.className   = 'form-notice success';
      form.reset();
      btn.disabled = false;
      btn.textContent = '문의 보내기';
      setTimeout(() => { notice.textContent = ''; notice.className = 'form-notice'; }, 6000);
    }, 1200);
  });
}

/* ────────────────────────────────────────────────────────────
   10. SMOOTH SCROLL for anchor links
   ──────────────────────────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 68; // header height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ────────────────────────────────────────────────────────────
   11. HEADER SCROLLED STYLE (add to CSS via JS)
   ──────────────────────────────────────────────────────────── */
const scrolledStyle = document.createElement('style');
scrolledStyle.textContent = `
  .header.scrolled { box-shadow: 0 2px 20px rgba(0,0,0,.15); }
  .vcard-in { animation: vcard-appear .4s ease both; }
  @keyframes vcard-appear {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:none; }
  }
  .palette-wrap { position: relative; }
  .palette-btn {
    width: 42px; height: 42px;
    border-radius: 9999px;
    background: var(--bg3);
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center; gap: .3rem;
    cursor: pointer; transition: .15s ease;
  }
  .palette-btn:hover { border-color: var(--azure); background: rgba(59,130,246,.1); }
  .palette-dot {
    width: 16px; height: 16px; border-radius: 50%;
    border: 2px solid rgba(255,255,255,.3);
    display: block; flex-shrink: 0;
  }
  .palette-caret { font-size: .7rem; color: var(--txt2); }
  .palette-dropdown {
    position: absolute; top: calc(100% + 8px); right: 0;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r-lg);
    padding: .75rem;
    width: 160px;
    box-shadow: 0 12px 32px rgba(0,0,0,.25);
    z-index: 2000;
  }
  .palette-label {
    font-size: .7rem; font-weight: 800; text-transform: uppercase; letter-spacing: .06em;
    color: var(--txt3); padding: 0 .4rem .5rem; margin-bottom: .25rem;
    border-bottom: 1px solid var(--border);
  }
  .palette-item {
    display: flex; align-items: center; gap: .6rem;
    width: 100%; padding: .5rem .4rem; border-radius: var(--r);
    font-size: .875rem; color: var(--txt2); cursor: pointer;
    transition: .12s ease;
  }
  .palette-item:hover { background: rgba(59,130,246,.1); color: var(--azure); }
  .palette-item.active { color: var(--azure); font-weight: 700; }
  .palette-swatch {
    width: 14px; height: 14px; border-radius: 50%; flex-shrink: 0;
    border: 1.5px solid rgba(0,0,0,.15);
  }
  .palette-check { margin-left: auto; font-size: .75rem; color: var(--azure); }
`;
document.head.appendChild(scrolledStyle);

/* ────────────────────────────────────────────────────────────
   INIT
   ──────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  ThemeSystem.init();
  initHeader();
  new VideoSection(AI_VIDEOS,      'aiVideoGrid',  'aiPagination');
  new VideoSection(LITERACY_VIDEOS, 'litVideoGrid', 'litPagination');
  initReveal();
  initContactForm();
  initSmoothScroll();
});
