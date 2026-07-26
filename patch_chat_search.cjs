const fs = require('fs');
const path = 'src/components/Chat/ChatWindow.tsx';
let content = fs.readFileSync(path, 'utf8');

// Need to grab setSearchInChatMode from context
content = content.replace(
  "const { chats, activeChatId, setActiveChatId, messages, startCall, theme } = useTelegram();",
  "const { chats, activeChatId, setActiveChatId, messages, startCall, theme, setSearchInChatMode } = useTelegram();"
);

// Update search button
content = content.replace(
  /<button\s*title="Search in chat"\s*className=\{`p-1\.5 sm:p-2 rounded-full transition-colors \$\{[\s\S]*?\}`\}\s*>/,
  (match) => match.replace("<button", "<button onClick={() => setSearchInChatMode(true)}")
);

fs.writeFileSync(path, content);
