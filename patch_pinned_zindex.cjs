const fs = require('fs');
const path = 'src/components/Chat/ChatWindow.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  /className=\{\`flex items-center justify-between px-4 py-2 border-b text-xs z-10 backdrop-blur-xs cursor-pointer select-none transition-colors \$\{/m,
  "className={\`relative flex items-center justify-between px-4 py-2 border-b text-xs z-20 backdrop-blur-xs cursor-pointer select-none transition-colors \${"
);

fs.writeFileSync(path, content);
