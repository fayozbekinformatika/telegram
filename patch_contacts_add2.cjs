const fs = require('fs');
const path = 'src/components/Modals/ContactsModal.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "const { theme, mockChats } = useTelegram();",
  "const { theme, mockChats, createNewChat, setActiveChatId } = useTelegram();"
);

content = content.replace(
  /if \(typeof window !== 'undefined'\) \{[\s\S]*?window\.dispatchEvent\(event\);\n\s*\}/m,
  "createNewChat(name, 'private', phone, 'Added from contacts');"
);

// We should also let clicking a contact open the chat
content = content.replace(
  /<div key=\{contact.id\} className="flex items-center px-4 py-2 hover:bg-black\/5 cursor-pointer transition-colors">/,
  `<div key={contact.id} className="flex items-center px-4 py-2 hover:bg-black/5 cursor-pointer transition-colors" onClick={() => { setActiveChatId(contact.id); onClose(); }}>`
);

fs.writeFileSync(path, content);
