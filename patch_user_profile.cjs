const fs = require('fs');
const path = 'src/components/Modals/UserProfileModal.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "import { useTelegram } from '../../context/TelegramContext';",
  "import { useTelegram } from '../../context/TelegramContext';\nimport { useToast } from '../../context/ToastContext';"
);

content = content.replace(
  "const { theme } = useTelegram();",
  "const { theme } = useTelegram();\n  const { showToast } = useToast();"
);

content = content.replace(
  '<div className={`flex items-center justify-between py-3 border-y ${borderCol} cursor-pointer`}>',
  '<div onClick={() => showToast("Icons library coming soon")} className={`flex items-center justify-between py-3 border-y ${borderCol} cursor-pointer`}>'
);

content = content.replace(
  '<span className="text-sky-500 cursor-pointer">Change {\'>\'}</span>',
  '<span onClick={() => showToast("Change color scheme coming soon")} className="text-sky-500 cursor-pointer">Change {\'>\'}</span>'
);

content = content.replace(
  '<button className="text-sky-500 font-medium hover:underline">Start a Channel</button>',
  '<button onClick={() => showToast("Start channel wizard coming soon")} className="text-sky-500 font-medium hover:underline">Start a Channel</button>'
);

content = content.replace(
  '<div className={`flex items-center px-4 py-4 cursor-pointer hover:bg-black/5 text-sky-400`}>',
  '<div onClick={() => showToast("Add Account wizard coming soon")} className={`flex items-center px-4 py-4 cursor-pointer hover:bg-black/5 text-sky-400`}>'
);

content = content.replace(
  '<div className={`flex items-center px-4 py-3 cursor-pointer hover:bg-black/5`}>\n                <Phone className={`w-5 h-5 mr-4 ${textSub}`} />',
  '<div onClick={() => showToast("Change phone number wizard coming soon")} className={`flex items-center px-4 py-3 cursor-pointer hover:bg-black/5`}>\n                <Phone className={`w-5 h-5 mr-4 ${textSub}`} />'
);

fs.writeFileSync(path, content);
