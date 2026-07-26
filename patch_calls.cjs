const fs = require('fs');
const path = 'src/components/Modals/CallsModal.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "import { useTelegram } from '../../context/TelegramContext';",
  "import { useTelegram } from '../../context/TelegramContext';\nimport { useToast } from '../../context/ToastContext';"
);

content = content.replace(
  "const { theme } = useTelegram();",
  "const { theme, startCall } = useTelegram();\n  const { showToast } = useToast();"
);

content = content.replace(
  /<div className="flex items-center px-4 py-3 hover:bg-black\/5 cursor-pointer transition-colors">\s*<Link2 className="w-5 h-5 text-sky-500 mr-4" \/>\s*<span className="text-sky-500 font-medium flex-1">Start New Call<\/span>\s*<\/div>/,
  `<div onClick={() => { startCall('New Group Call', 'https://ui-avatars.com/api/?name=GC&background=0D8ABC&color=fff', false); onClose(); showToast('Started new call'); }} className="flex items-center px-4 py-3 hover:bg-black/5 cursor-pointer transition-colors">
             <Link2 className="w-5 h-5 text-sky-500 mr-4" />
             <span className="text-sky-500 font-medium flex-1">Start New Call</span>
          </div>`
);

fs.writeFileSync(path, content);
