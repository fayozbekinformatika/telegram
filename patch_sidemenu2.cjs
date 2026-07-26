const fs = require('fs');
const path = 'src/components/Sidebar/SideMenuDrawer.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "const { theme, setTheme, setActiveChatId } = useTelegram();",
  "const { theme, setTheme, setActiveChatId } = useTelegram();\n  const [showMyProfile, setShowMyProfile] = React.useState(false);"
);

fs.writeFileSync(path, content);
