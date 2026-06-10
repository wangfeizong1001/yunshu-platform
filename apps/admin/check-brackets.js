const fs = require('fs');
const content = fs.readFileSync('src/mock/gen/gen.mock.ts', 'utf8');
let depth = 0;
let bracketDepth = 0;
let inTemplate = 0;
let inString = '';
let prevChar = '';
let lineNum = 1;
let lineStartBracketStart = -1;

for (let i = 0; i < content.length; i++) {
  const ch = content[i];
  if (ch === '\n') lineNum++;
  
  if (inString) {
    if (ch === inString && prevChar !== '\\') {}
    if (ch === inString) inString = '';
    prevChar = ch;
    continue;
  }
  if (inTemplate > 0) {
    if (ch === '`' && prevChar !== '\\') inTemplate--;
    prevChar = ch;
    continue;
  }
  if (ch === '"' || ch === "'") { inString = ch; prevChar = ch; continue; }
  if (ch === '`') { inTemplate++; prevChar = ch; continue; }
  
  if (ch === '{') depth++;
  else if (ch === '}') depth--;
  else if (ch === '[') bracketDepth++;
  else if (ch === ']') bracketDepth--;
  
  prevChar = ch;
}
console.log('Final brace depth:', depth);
console.log('Final bracket depth:', bracketDepth);
console.log('In template:', inTemplate);
console.log('In string:', inString);
console.log('Total lines:', lineNum);
