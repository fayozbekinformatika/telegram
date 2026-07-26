const fs = require('fs');
let code = fs.readFileSync('src/components/Modals/NewChatModal.tsx', 'utf-8');

code = code.replace(
  "createNewChat(name.trim(), type as ChatType, avatarPreview, description.trim());",
  "createNewChat(name.trim(), type as ChatType, '', description.trim(), avatarPreview);"
);

fs.writeFileSync('src/components/Modals/NewChatModal.tsx', code);
console.log('patched modal call');
