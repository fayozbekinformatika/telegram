const fs = require('fs');
const path = 'src/context/TelegramContext.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "createNewChat: (name: string, type: Chat['type'], username?: string, description?: string) => Chat;",
  "createNewChat: (name: string, type: Chat['type'], username?: string, description?: string) => Chat;\n  clearHistory: (chatId: string) => void;\n  leaveChat: (chatId: string) => void;"
);

content = content.replace(
  "  const createNewChat = (name: string, type: Chat['type'], username?: string, description?: string): Chat => {",
  `  const clearHistory = (chatId: string) => {
    setMessages((prev) => ({ ...prev, [chatId]: [] }));
  };

  const leaveChat = (chatId: string) => {
    setChats((prev) => prev.filter((c) => c.id !== chatId));
    setMessages((prev) => {
      const newMsgs = { ...prev };
      delete newMsgs[chatId];
      return newMsgs;
    });
    if (activeChatId === chatId) setActiveChatId(null);
  };

  const createNewChat = (name: string, type: Chat['type'], username?: string, description?: string): Chat => {`
);

content = content.replace(
  "        createNewChat,",
  "        createNewChat,\n        clearHistory,\n        leaveChat,"
);

// We need to also remove the setTimeout from sendMessage to fix the 2 ticks for unread messages (or handle it correctly)
// Wait, the user said "xabar oqilmasayam 2 ta galochka chiqib qolyapdi".
// This happens because setTimeout always sets it to read.
// Let's modify sendMessage.

content = content.replace(
  /    \/\/ Simulate read receipt after 2 seconds\s*setTimeout\(\(\) => \{\s*setMessages\(\(prev\) => \{\s*const chatMsgs = prev\[chatId\] \|\| \[\];\s*return \{\s*\.\.\.prev,\s*\[chatId\]: chatMsgs\.map\(\(m\) => \(m\.id === newMsg\.id \? \{ \.\.\.m, isRead: true \} : m\)\),\s*\};\s*\}\);\s*\}\, 2000\);/gm,
  ""
);


fs.writeFileSync(path, content);
