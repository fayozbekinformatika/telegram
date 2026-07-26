const fs = require('fs');
const path = 'src/context/TelegramContext.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "const [searchQuery, setSearchQuery] = useState<string>('');",
  "const [searchQuery, setSearchQuery] = useState<string>('');\n  const [searchInChatMode, setSearchInChatMode] = useState<boolean>(false);"
);

fs.writeFileSync(path, content);
