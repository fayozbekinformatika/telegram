const fs = require('fs');
const path = 'src/components/Modals/ContactsModal.tsx';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(/mockChats/g, 'chats');
fs.writeFileSync(path, content);
