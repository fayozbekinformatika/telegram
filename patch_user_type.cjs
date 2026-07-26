const fs = require('fs');
let code = fs.readFileSync('src/types/telegram.ts', 'utf-8');
code = code.replace(
  '  profileColor?: string;',
  '  profileColor?: string;\n  nameColor?: string;'
);
fs.writeFileSync('src/types/telegram.ts', code);
