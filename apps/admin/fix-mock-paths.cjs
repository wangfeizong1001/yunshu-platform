const fs = require('fs');
const path = require('path');

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
console.log('Found', files.length, 'route files');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  let changed = false;

  // 修复：../utils/ → ../../utils/
  if (content.includes("from '../utils/")) {
    content = content.replace(/from '..\/utils\//g, "from '../../utils/");
    changed = true;
  }

  // 有些文件已经写了 ../../utils/ 但 utils 在 mock/utils/：routes/system/role.ts → 用 ../../utils/ 实际上指向 routes/utils/（不存在），应该指向 mock/utils/
  // 让我检查一下路径：
  // routes/system/role.ts → .. = routes/, ../.. = routes/../ = mock/
  // ../../utils/ → mock/utils/ ✓ 这个是正确的

  // 但 ../utils/ → routes/utils/ ✗ 错误

  // 所以真正的修复：所有 from '../utils/xxx' 改成 from '../../utils/xxx'

  if (changed) {
    fs.writeFileSync(file, content);
    console.log('Fixed:', path.relative(__dirname, file));
  }
}
console.log('Done');
