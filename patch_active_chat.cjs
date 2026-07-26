const fs = require('fs');
const path = 'src/context/TelegramContext.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "const [activeChatId, setActiveChatId] = useState<string | null>('chat_ai_bot');",
  "const [activeChatId, setActiveChatId] = useState<string | null>('chat_sleepwalkers');"
);

fs.writeFileSync(path, content);
