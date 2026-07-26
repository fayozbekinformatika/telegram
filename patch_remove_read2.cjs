const fs = require('fs');
const path = 'src/context/TelegramContext.tsx';
let content = fs.readFileSync(path, 'utf8');

const strToReplace = `    // Update message read status after short delay (Telegram 2 ticks / galochka simulation)
    setTimeout(() => {
      setMessages((prev) => {
        const chatMsgs = prev[chatId];
        if (!chatMsgs) return prev;
        return {
          ...prev,
          [chatId]: chatMsgs.map((m) => (m.id === newMsg.id ? { ...m, isRead: true } : m)),
        };
      });
      setChats((prev) =>
        prev.map((c) =>
          c.id === chatId && c.lastMessage?.id === newMsg.id
            ? { ...c, lastMessage: { ...c.lastMessage, isRead: true } }
            : c
        )
      );
    }, 2000);`;

content = content.replace(strToReplace, "");
fs.writeFileSync(path, content);
