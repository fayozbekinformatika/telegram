const fs = require('fs');
const path = 'src/components/Sidebar/SideMenuDrawer.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "onOpenPasscode: () => void;",
  "onOpenPasscode: () => void;\n  onOpenContacts: () => void;\n  onOpenCalls: () => void;"
);

content = content.replace(
  "onOpenSettings,",
  "onOpenSettings,\n  onOpenContacts,\n  onOpenCalls,"
);

// Replace Contacts empty onClick
content = content.replace(
  /onClick=\{\(\) => \{\}\}([\s\S]*?)<span className="font-medium flex-1 text-left">Contacts<\/span>/g,
  `onClick={() => { onOpenContacts(); onClose(); }}$1<span className="font-medium flex-1 text-left">Contacts</span>`
);

// Replace Calls empty onClick
content = content.replace(
  /onClick=\{\(\) => \{\}\}([\s\S]*?)<span className="font-medium flex-1 text-left">Calls<\/span>/g,
  `onClick={() => { onOpenCalls(); onClose(); }}$1<span className="font-medium flex-1 text-left">Calls</span>`
);

fs.writeFileSync(path, content);
