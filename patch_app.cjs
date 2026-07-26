const fs = require('fs');
const path = 'src/App.tsx';
let content = fs.readFileSync(path, 'utf8');

// Imports
content = content.replace(
  "import { MiniAppModal } from './components/Modals/MiniAppModal';",
  "import { MiniAppModal } from './components/Modals/MiniAppModal';\nimport { ContactsModal } from './components/Modals/ContactsModal';\nimport { CallsModal } from './components/Modals/CallsModal';"
);

// State
content = content.replace(
  "const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState(false);",
  "const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState(false);\n  const [isContactsModalOpen, setIsContactsModalOpen] = useState(false);\n  const [isCallsModalOpen, setIsCallsModalOpen] = useState(false);"
);

// SideMenuDrawer props
content = content.replace(
  "onOpenPasscode={() => setIsPasscodeModalOpen(true)}",
  "onOpenPasscode={() => setIsPasscodeModalOpen(true)}\n        onOpenContacts={() => setIsContactsModalOpen(true)}\n        onOpenCalls={() => setIsCallsModalOpen(true)}"
);

// Modals
content = content.replace(
  "{/* New Chat / Group / Channel Modal */}",
  "<ContactsModal isOpen={isContactsModalOpen} onClose={() => setIsContactsModalOpen(false)} />\n      <CallsModal isOpen={isCallsModalOpen} onClose={() => setIsCallsModalOpen(false)} />\n\n      {/* New Chat / Group / Channel Modal */}"
);

fs.writeFileSync(path, content);
