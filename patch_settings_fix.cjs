const fs = require('fs');
const path = 'src/components/Settings/SettingsModal.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "const { theme } = useTelegram();",
  "const { theme } = useTelegram();\n  const { showToast } = useToast();"
);

fs.writeFileSync(path, content);
