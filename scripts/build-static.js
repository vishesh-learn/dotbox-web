const fs = require('fs');
const path = require('path');

// HTML: copy to dist/ with dist/-prefix stripped from paths
const htmlPages = [
  { src: 'index.html',                      dest: 'dist/index.html',                      find: '"dist/',     replace: '"' },
  { src: 'pages/play/index.html',           dest: 'dist/pages/play/index.html',           find: '"../../dist/', replace: '"../../' },
  { src: 'pages/set-board/index.html',      dest: 'dist/pages/set-board/index.html',      find: '"../../dist/', replace: '"../../' },
  { src: 'pages/set-players/index.html',    dest: 'dist/pages/set-players/index.html',    find: '"../../dist/', replace: '"../../' },
  { src: 'pages/privacy-policy/index.html', dest: 'dist/pages/privacy-policy/index.html', find: '"../../dist/', replace: '"../../' },
  { src: 'pages/credits/index.html',        dest: 'dist/pages/credits/index.html',        find: '"../../dist/', replace: '"../../' },
];

console.log('Copying HTML...');
for (const { src, dest, find, replace } of htmlPages) {
  let html = fs.readFileSync(src, 'utf8');
  html = html.replaceAll(find, replace);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, html);
  console.log(`  ${dest}`);
}

// Assets: copy static files to dist/
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('Copying assets...');
copyDir('assets', 'dist/assets');
fs.copyFileSync('icon.png', 'dist/icon.png');
fs.copyFileSync('dotbox.webmanifest', 'dist/dotbox.webmanifest');
console.log('  dist/assets/');
console.log('  dist/icon.png');
console.log('  dist/dotbox.webmanifest');
