const fs = require('fs');
const path = 'src/context/TelegramContext.tsx';
let content = fs.readFileSync(path, 'utf8');

const regex = /\s*\/\/ Update message read status after short delay \(Telegram 2 ticks \/ galochka simulation\)[\s\S]*?setTimeout\(\(\) => \{[\s\S]*?setMessages\(\(prev\) => \{[\s\S]*?const chatMsgs = prev\[chatId\];[\s\S]*?if \(!chatMsgs\) return prev;[\s\S]*?return \{[\s\S]*?\.\.\.prev,[\s\S]*?\[chatId\]: chatMsgs\.map\(\(m\) => \(m\.id === newMsg\.id \? \{ \.\.\.m, isRead: true \} : m\)\),[\s\S]*?\};[\s\S]*?\}\);[\s\S]*?setChats\(\(prev\) =>[\s\S]*?prev\.map\(\(c\) =>[\s\S]*?c\.id === chatId && c\.lastMessage\?.id === newMsg\.id[\s\S]*?\? \{ \.\.\.c, lastMessage: \{ \.\.\.c\.lastMessage, isRead: true \} \}[\s\S]*?: c[\s\S]*?\)[\s\S]*?\);[\s\S]*?\}, 2000\);/m;

content = content.replace(regex, "");
fs.writeFileSync(path, content);
