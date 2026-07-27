const fs = require('fs');
let text = fs.readFileSync('src/context/TelegramContext.tsx', 'utf8');

// 1. Cut off the corrupted tail
const badIdx = text.indexOf('};\\n      setTimeout');
if (badIdx !== -1) {
  text = text.substring(0, badIdx + 2);
}

// 2. Fix the missing `        }` that I originally removed
let lines = text.split('\n');
const toFix = [111, 116, 211, 232, 237, 245, 287, 293, 323, 329, 332, 357, 358, 361];
for (let i = 0; i < lines.length; i++) {
  if (toFix.includes(i + 1)) {
    if (i + 1 === 111 || i + 1 === 116) {
      lines[i] = '} ' + lines[i]; // these are the onSnapshot lines
    } else {
      lines[i] = '        }' + lines[i];
    }
  }
}

fs.writeFileSync('src/context/TelegramContext.tsx', lines.join('\n'));
console.log('Fixed TelegramContext.tsx');
