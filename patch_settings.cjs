const fs = require('fs');
const path = 'src/components/Settings/SettingsModal.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "import { useTelegram } from '../../context/TelegramContext';",
  "import { useTelegram } from '../../context/TelegramContext';\nimport { useToast } from '../../context/ToastContext';"
);

content = content.replace(
  "const { theme, setChatWallpaper } = useTelegram();",
  "const { theme, setChatWallpaper } = useTelegram();\n  const { showToast } = useToast();"
);

content = content.replace(
  '<button className="hover:bg-black/10 p-1.5 rounded-full transition-colors"><Search className="w-5 h-5" /></button>',
  '<button onClick={() => showToast("Search settings...")} className="hover:bg-black/10 p-1.5 rounded-full transition-colors"><Search className="w-5 h-5" /></button>'
);

content = content.replace(
  '<button className="hover:bg-black/10 p-1.5 rounded-full transition-colors"><MoreVertical className="w-5 h-5" /></button>',
  '<button onClick={() => showToast("More options")} className="hover:bg-black/10 p-1.5 rounded-full transition-colors"><MoreVertical className="w-5 h-5" /></button>'
);

fs.writeFileSync(path, content);
