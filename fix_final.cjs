const fs = require('fs');
let content = fs.readFileSync('src/context/TelegramContext.tsx', 'utf8');

const badIndex = content.indexOf('};\\n      setTimeout');
if (badIndex !== -1) {
  content = content.substring(0, badIndex + 2);
}

let lines = content.split('\n');
const toFix = [111, 116, 211, 232, 237, 245, 287, 293, 323, 329, 332, 357, 358, 361];
for (let i = 0; i < lines.length; i++) {
  if (toFix.includes(i + 1)) {
    if (i + 1 === 111 || i + 1 === 116) {
      lines[i] = '} ' + lines[i];
    } else {
      lines[i] = '        }' + lines[i];
    }
  }
}

fs.writeFileSync('src/context/TelegramContext.tsx', lines.join('\n'));
