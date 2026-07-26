const fs = require('fs');
const path = 'src/types/telegram.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "profileColor?: string;",
  "profileColor?: string;\n  birthday?: string;\n  personalChannel?: string;\n  automationEnabled?: boolean;"
);

fs.writeFileSync(path, content);
