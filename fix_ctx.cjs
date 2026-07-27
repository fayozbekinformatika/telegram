const fs = require('fs');
let lines = fs.readFileSync('src/context/TelegramContext.tsx', 'utf-8').split('\n');

const toFix = [111, 116, 211, 232, 237, 245, 287, 293, 323, 329, 332, 357, 358, 361];

for (let i = 0; i < lines.length; i++) {
  if (toFix.includes(i + 1)) {
    if (i + 1 === 111 || i + 1 === 116) {
      // These were replaced. Leave them, but we need to insert the missing `}` before `, (error)`
      lines[i] = lines[i].replace('}, (error)', '} }, (error)');
    } else {
      lines[i] = '        }' + lines[i].trimStart();
    }
  }
}

fs.writeFileSync('src/context/TelegramContext.tsx', lines.join('\n'));
