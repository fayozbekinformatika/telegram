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

content = content.replace(
  /<span className="font-medium flex-1 text-left">Contacts<\/span>[\s\S]*?onClick=\{\(\) => \{\}\}/m,
  `<span className="font-medium flex-1 text-left">Contacts</span>\n          </button>\n          \n          <button\n            onClick={() => { onOpenCalls(); onClose(); }}`
);

// We need to be careful with the replacement. Let's do it using generic replace based on the file content.
