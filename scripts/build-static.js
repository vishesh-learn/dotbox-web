const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

function projectPath(...segments) {
  return path.join(rootDir, ...segments);
}

function distPath(...segments) {
  return path.join(distDir, ...segments);
}

function displayPath(filePath) {
  return path.relative(rootDir, filePath).replaceAll(path.sep, '/');
}

function copyHTML(src, dest, find, replace) {
  let html = fs.readFileSync(src, 'utf8');
  html = html.replaceAll(find, replace);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, html);
  console.log(`  ${displayPath(dest)}`);
}

console.log('Copying HTML...');

copyHTML(projectPath('index.html'), distPath('index.html'), '"dist/', '"');

for (const entry of fs.readdirSync(projectPath('pages'), { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const src = projectPath('pages', entry.name, 'index.html');
  if (!fs.existsSync(src)) continue;
  copyHTML(src, distPath('pages', entry.name, 'index.html'), '"../../dist/', '"../../');
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
copyDir(projectPath('assets'), distPath('assets'));
fs.copyFileSync(projectPath('icon.png'), distPath('icon.png'));
fs.copyFileSync(projectPath('dotbox.webmanifest'), distPath('dotbox.webmanifest'));
console.log('  dist/assets/, dist/icon.png, dist/dotbox.webmanifest');
