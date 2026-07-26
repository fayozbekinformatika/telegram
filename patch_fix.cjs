const fs = require('fs');
const path = 'src/context/TelegramContext.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "              unreadCount: 0,\n      membersCount: type === 'group' || type === 'channel' ? 1 : undefined,",
  "              unreadCount: 0,"
);

fs.writeFileSync(path, content);
