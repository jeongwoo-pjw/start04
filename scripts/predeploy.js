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

// 파일 복사
const copies = [
  ['index.html',          'index.html'],
  ['assets/css/main.css', 'assets/css/main.css'],
  ['assets/js/app.js',    'assets/js/app.js'],
];
copies.forEach(([src, dest]) => {
  fs.copyFileSync(path.join(ROOT, src), path.join(DIST, dest));
  console.log(`  copied: ${src}`);
});

// Jekyll 비활성화 (.nojekyll)
fs.writeFileSync(path.join(DIST, '.nojekyll'), '');

console.log('✅ dist/ 준비 완료 → gh-pages 배포 시작');
