const fs = require('fs');
const path = 'src/components/Modals/NewChatModal.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "import { useTelegram } from '../../context/TelegramContext';",
  "import { useTelegram } from '../../context/TelegramContext';\nimport { useToast } from '../../context/ToastContext';"
);

content = content.replace(
  "const { createNewChat, theme } = useTelegram();",
  "const { createNewChat, theme } = useTelegram();\n  const { showToast } = useToast();"
);

content = content.replace(
  /<button className=\{\`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-black\/10 transition-colors\`\}>/g,
  '<button onClick={(e) => showToast(e.currentTarget.textContent || "Coming soon")} className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-black/10 transition-colors`}>'
);

fs.writeFileSync(path, content);
