const fs = require('fs');
const path = 'src/context/TelegramContext.tsx';
let content = fs.readFileSync(path, 'utf8');

const regex = /\s*\/\/ Update message read status after short delay \(Telegram 2 ticks \/ galochka simulation\)[\s\S]*?\}, 2000\);/g;

content = content.replace(regex, "");
fs.writeFileSync(path, content);
