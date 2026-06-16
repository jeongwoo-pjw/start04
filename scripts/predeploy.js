'use strict';
const fs   = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

// 초기화
fs.rmSync(DIST, { recursive: true, force: true });

// 디렉터리 생성
['', 'assets', 'assets/css', 'assets/js'].forEach(d => {
  fs.mkdirSync(path.join(DIST, d), { recursive: true });
});

// 복사할 파일 목록
const copies = [
  // HTML
  ['index.html',               'index.html'],
  ['login.html',               'login.html'],
  ['board.html',               'board.html'],
  ['board-write.html',         'board-write.html'],
  ['board-detail.html',        'board-detail.html'],
  ['README.md',                'README.md'],
  // CSS
  ['assets/css/main.css',      'assets/css/main.css'],
  ['assets/css/board.css',     'assets/css/board.css'],
  // JS
  ['assets/js/app.js',         'assets/js/app.js'],
  ['assets/js/supabase-client.js', 'assets/js/supabase-client.js'],
  ['assets/js/auth.js',        'assets/js/auth.js'],
  ['assets/js/board.js',       'assets/js/board.js'],
  ['assets/js/board-write.js', 'assets/js/board-write.js'],
  ['assets/js/board-detail.js','assets/js/board-detail.js'],
  ['assets/js/chat.js',        'assets/js/chat.js'],
];

copies.forEach(([src, dest]) => {
  fs.copyFileSync(path.join(ROOT, src), path.join(DIST, dest));
  console.log(`  copied: ${src}`);
});

// Jekyll 비활성화
fs.writeFileSync(path.join(DIST, '.nojekyll'), '');

console.log('✅ dist/ 준비 완료 → gh-pages 배포 시작');
