const fs = require('fs');
const path = require('path');

function walk(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) {
      results.push(...walk(full));
    } else if (full.endsWith('.tsx')) {
      results.push(full);
    }
  }
  return results;
}

const pagesDir = path.join(__dirname, 'src', 'pages');
const componentsDir = path.join(__dirname, 'src', 'components');

const files = [...walk(pagesDir), ...walk(componentsDir)];
let totalFixed = 0;

for (const filePath of files) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Replace bg-white with bg-surface (but not bg-white/ patterns like bg-white/10)
  content = content.replace(/\bbg-white\b(?!\/)/g, 'bg-surface');

  // Replace border-surface-container-high with border-outline-variant/30
  content = content.replace(/\bborder-surface-container-high\b/g, 'border-outline-variant/30');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    totalFixed++;
    console.log('Fixed:', path.relative(__dirname, filePath));
  }
}

console.log('Total files fixed:', totalFixed);
