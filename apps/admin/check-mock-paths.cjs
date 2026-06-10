const fs = require('fs');
const path = require('path');

// 统一检查：所有路由文件的 utils 引用都应该是 ../../utils/
const routesDir = path.join(__dirname, 'mock', 'routes');

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(walk(full));
    } else if (entry.name.endsWith('.ts')) {
      files.push(full);
    }
  }
  return files;
}

const files = walk(routesDir);
let issues = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8');
  const rel = path.relative(__dirname, file);

  // 目录深度：mock/routes/<category>/<file>.ts → 深度 2 → 用 ../../utils/
  const matches = content.match(/from\s+'([^']+utils\/[^']+)'/g);
  if (matches) {
    for (const m of matches) {
      if (!m.includes("from '../../utils/")) {
        issues.push(`${rel}: ${m}`);
      }
    }
  }
}

if (issues.length) {
  console.log('Found issues:');
  issues.forEach((i) => console.log('  ', i));
} else {
  console.log('All imports look correct!');
}
