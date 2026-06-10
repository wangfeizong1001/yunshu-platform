const fs = require('fs');
const path = require('path');

// routes/system/*.ts: 3 层深度 → ../../../utils/
const files = [
  'mock/routes/system/form.ts',
  'mock/routes/system/knowledge.ts',
  'mock/routes/system/message.ts',
  'mock/routes/system/notification.ts',
];

for (const file of files) {
  const full = path.join(__dirname, file);
  let content = fs.readFileSync(full, 'utf-8');
  if (content.includes("from '../../utils/")) {
    content = content.replace(/from '..\/..\/utils\//g, "from '../../../utils/");
    fs.writeFileSync(full, content);
    console.log('Fixed:', file);
  }
}
console.log('Done');
