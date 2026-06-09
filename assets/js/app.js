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
   2. VIDEO DATA
      videoId: 실제 YouTube 영상 ID로 교체하세요.
      예) https://www.youtube.com/watch?v=VIDEO_ID_HERE
   ──────────────────────────────────────────────────────────── */
const AI_VIDEOS = [
  {
    videoId: 'hFZFjoX2cGg',
    title: 'AI란 무엇인가? 인공지능의 기초 이해',
    desc: '인공지능의 기본 개념, 역사, 그리고 우리 일상에 미치는 영향을 알아봅니다.',
    duration: '15:30',
    date: '2024-01-15',
    category: 'AI 기초',
    views: '1.2k',
  },
  {
    videoId: 'ukzFI9rgwfU',
    title: '머신러닝의 원리와 작동 방식',
    desc: '머신러닝이 데이터에서 패턴을 학습하고 예측을 하는 원리를 쉽게 설명합니다.',
    duration: '22:15',
    date: '2024-01-22',
    category: '머신러닝',
    views: '980',
  },
  {
    videoId: 'bfmFfD2RIcg',
    title: '딥러닝과 신경망 이해하기',
    desc: '인간의 뇌를 모방한 딥러닝과 인공 신경망 알고리즘의 구조를 이해합니다.',
    duration: '28:45',
    date: '2024-02-01',
    category: '딥러닝',
    views: '1.5k',
  },
  {
    videoId: 'qbIk7-JPB2c',
    title: 'ChatGPT와 대형 언어 모델(LLM) 심층 분석',
    desc: 'ChatGPT 등 대형 언어 모델의 원리와 활용 방법을 심층 분석합니다.',
    duration: '35:20',
    date: '2024-02-10',
    category: '생성형 AI',
    views: '3.2k',
  },
  {
    videoId: 'SVcsDDABEkM',
    title: '이미지 생성 AI — Stable Diffusion 완전 정복',
    desc: '이미지 생성 AI의 원리와 Stable Diffusion을 활용한 창작 방법을 배웁니다.',
    duration: '41:10',
    date: '2024-02-20',
    category: '생성형 AI',
    views: '2.1k',
  },
  {
    videoId: 'EzTz4sIRHak',
    title: 'AI 윤리와 책임있는 AI 개발',
    desc: 'AI 기술의 윤리적 사용과 책임있는 AI 개발 원칙에 대해 논의합니다.',
    duration: '19:55',
    date: '2024-03-01',
    category: 'AI 윤리',
    views: '750',
  },
  {
    videoId: 'JgX0fAZNroA',
    title: '강화학습의 개념과 응용',
    desc: '게임 AI부터 로봇 제어까지, 강화학습의 기본 원리와 실제 응용 사례를 알아봅니다.',
    duration: '25:30',
    date: '2024-03-10',
    category: '머신러닝',
    views: '890',
  },
  {
    videoId: 'ISNdQcPhsts',
    title: '자연어 처리(NLP) 기초와 활용',
    desc: '텍스트 데이터를 이해하고 처리하는 자연어 처리 기술의 핵심을 배웁니다.',
    duration: '32:00',
    date: '2024-03-20',
    category: 'NLP',
    views: '1.1k',
  },
  {
    videoId: 'mNjaaU3JsBQ',
    title: '컴퓨터 비전과 이미지 인식',
    desc: 'AI가 이미지를 인식하고 분석하는 컴퓨터 비전 기술의 원리를 탐구합니다.',
    duration: '27:45',
    date: '2024-04-01',
    category: '컴퓨터 비전',
    views: '1.3k',
  },
  {
    videoId: 'pOYAXv15r3g',
    title: 'AI와 빅데이터의 관계',
    desc: 'AI 기술을 뒷받침하는 빅데이터의 수집, 처리, 분석 방법을 이해합니다.',
    duration: '20:15',
    date: '2024-04-10',
    category: '데이터',
    views: '820',
  },
  {
    videoId: 'lXLBTBLpBs8',
    title: 'AI 플랫폼 비교 — Google, OpenAI, Anthropic',
    desc: '주요 AI 플랫폼들의 특징과 차이점을 비교 분석합니다.',
    duration: '38:20',
    date: '2024-04-20',
    category: 'AI 도구',
    views: '4.5k',
  },
  {
    videoId: 'J9gHxFwdZLA',
    title: 'AI 시대의 미래 직업과 커리어',
    desc: 'AI 시대에 살아남을 직업과 새롭게 부상하는 커리어 경로를 탐구합니다.',
    duration: '30:00',
    date: '2024-05-01',
    category: '미래',
    views: '5.8k',
  },
];

const LITERACY_VIDEOS = [
  {
    videoId: 'ad79nYk2keg',
    title: 'AI 리터러시란 무엇인가?',
    desc: '디지털 시대의 필수 역량, AI 리터러시의 개념과 중요성을 알아봅니다.',
    duration: '12:30',
    date: '2024-01-20',
    category: 'AI 리터러시',
    views: '2.3k',
  },
  {
    videoId: 'aircAruvnKk',
    title: 'AI와 함께하는 비판적 사고',
    desc: 'AI가 제공하는 정보를 비판적으로 분석하고 활용하는 방법을 배웁니다.',
    duration: '18:45',
    date: '2024-01-28',
    category: '비판적 사고',
    views: '1.8k',
  },
  {
    videoId: 'dQw4w9WgXcQ',
    title: '딥페이크와 AI 조작 콘텐츠 구별하기',
    desc: '딥페이크 기술의 원리와 AI로 조작된 콘텐츠를 식별하는 방법을 배웁니다.',
    duration: '24:10',
    date: '2024-02-05',
    category: '미디어 리터러시',
    views: '6.2k',
  },
  {
    videoId: 'Qf9QkMisSzY',
    title: 'AI 도구 활용 — 업무 생산성 높이기',
    desc: 'ChatGPT, Claude 등 AI 도구를 활용해 업무 효율을 극대화하는 방법을 소개합니다.',
    duration: '45:00',
    date: '2024-02-15',
    category: 'AI 활용',
    views: '8.9k',
  },
  {
    videoId: 'oFtjKbXKqbg',
    title: 'AI 프롬프트 엔지니어링 입문',
    desc: 'AI와 효과적으로 소통하는 프롬프트 작성법의 기초를 마스터하세요.',
    duration: '33:20',
    date: '2024-02-25',
    category: '프롬프팅',
    views: '7.1k',
  },
  {
    videoId: 'WmVLcj-XKnM',
    title: '개인정보와 AI — 데이터 프라이버시',
    desc: 'AI 서비스 사용 시 개인정보 보호와 데이터 프라이버시를 지키는 방법을 배웁니다.',
    duration: '22:40',
    date: '2024-03-05',
    category: '디지털 시민',
    views: '3.4k',
  },
  {
    videoId: 'QdDoFfkVkcg',
    title: '교육에서의 AI 활용 — 학습 혁신',
    desc: '교육 현장에서 AI를 효과적으로 활용해 학습 경험을 혁신하는 방법을 탐구합니다.',
    duration: '28:15',
    date: '2024-03-15',
    category: 'AI 교육',
    views: '4.2k',
  },
  {
    videoId: 'GHosQqhJVdM',
    title: 'AI와 창의성 — 예술과 AI의 만남',
    desc: 'AI가 예술, 음악, 글쓰기 등 창의적 영역에서 어떻게 활용되는지 알아봅니다.',
    duration: '37:00',
    date: '2024-03-25',
    category: 'AI 창의성',
    views: '5.6k',
  },
  {
    videoId: 'ZSt9tm3RoUU',
    title: 'AI 챗봇 바로 알기 — 장점과 한계',
    desc: 'AI 챗봇의 능력과 한계를 정확히 이해하고 올바르게 활용하는 방법을 배웁니다.',
    duration: '19:30',
    date: '2024-04-05',
    category: 'AI 이해',
    views: '9.1k',
  },
  {
    videoId: 'tJQSyzBUAew',
    title: '사회 속의 AI — 편향성과 공정성',
    desc: 'AI 시스템에 내재된 편향성과 공정성 문제, 그리고 해결 방향을 논의합니다.',
    duration: '26:50',
    date: '2024-04-15',
    category: 'AI 윤리',
    views: '3.7k',
  },
  {
    videoId: 'M5fNRrwB1Gk',
    title: 'AI 법률과 규제 — 알아야 할 것들',
    desc: '전 세계 AI 관련 법률과 규제 동향을 파악하고 이에 대비하는 방법을 배웁니다.',
    duration: '31:15',
    date: '2024-04-25',
    category: 'AI 정책',
    views: '2.9k',
  },
  {
    videoId: 'FrbFxkzAQTA',
    title: 'AI 리터러시 완성 — 종합 정리',
    desc: 'AI 리터러시의 모든 핵심 요소를 종합 정리하며 실전 활용 능력을 점검합니다.',
    duration: '50:00',
    date: '2024-05-10',
    category: '종합',
    views: '12.4k',
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
