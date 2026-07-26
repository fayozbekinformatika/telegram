const fs = require('fs');
const path = 'src/context/TelegramContext.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "  leaveChat: (chatId: string) => void;",
  "  leaveChat: (chatId: string) => void;\n  toggleMute: (chatId: string) => void;"
);

content = content.replace(
  "  const leaveChat = (chatId: string) => {",
  `  const toggleMute = (chatId: string) => {
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, isMuted: !c.isMuted } : c))
    );
  };

  const leaveChat = (chatId: string) => {`
);

content = content.replace(
  "        leaveChat,",
  "        leaveChat,\n        toggleMute,"
);

fs.writeFileSync(path, content);
