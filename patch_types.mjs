import fs from 'fs';
let code = fs.readFileSync('src/types/telegram.ts', 'utf8');
code = code.replace("lastSeen?: string;", "lastSeen?: number | string;");
fs.writeFileSync('src/types/telegram.ts', code);
