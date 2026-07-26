const fs = require('fs');
const path = 'src/components/Chat/ChatWindow.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  /\`\$\{activeChat\.membersCount \|\| 0\} members\`/g,
  "\`${activeChat.membersCount || 1} members\`"
);

fs.writeFileSync(path, content);
