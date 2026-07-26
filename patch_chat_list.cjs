const fs = require('fs');
const path = 'src/components/Sidebar/ChatList.tsx';
let content = fs.readFileSync(path, 'utf8');

// If no lastMessage, don't show "09:00" default time.
content = content.replace(
  "{chat.lastMessage?.timestamp || '09:00'}",
  "{chat.lastMessage?.timestamp || ''}"
);

// If no lastMessage, and no description, show empty instead of "No messages yet", or just render nothing.
content = content.replace(
  "chat.description || 'No messages yet'",
  "chat.description || ''"
);

fs.writeFileSync(path, content);
