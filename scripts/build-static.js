const fs = require('fs');
const path = require('path');

function copyHTML(src, dest, find, replace) {
  let html = fs.readFileSync(src, 'utf8');
  html = html.replaceAll(find, replace);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, html);
  console.log(`  ${dest}`);
}

console.log('Copying HTML...');

copyHTML('index.html', 'dist/index.html', '"dist/', '"');

for (const entry of fs.readdirSync('pages', { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const src = path.join('pages', entry.name, 'index.html');
  if (!fs.existsSync(src)) continue;
  copyHTML(src, path.join('dist', 'pages', entry.name, 'index.html'), '"../../dist/', '"../../');
}

// Assets
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    entry.isDirectory() ? copyDir(srcPath, destPath) : fs.copyFileSync(srcPath, destPath);
  }
}

console.log('Copying assets...');
copyDir('assets', 'dist/assets');
fs.copyFileSync('icon.png', 'dist/icon.png');
fs.copyFileSync('dotbox.webmanifest', 'dist/dotbox.webmanifest');
console.log('  dist/assets/, dist/icon.png, dist/dotbox.webmanifest');
