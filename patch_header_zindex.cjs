const fs = require('fs');
const path = 'src/components/Chat/ChatWindow.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "className={\`relative z-10 flex items-center justify-between px-3 py-2 sm:px-4 sm:py-2.5 border-b shadow-xs transition-colors \${",
  "className={\`relative z-30 flex items-center justify-between px-3 py-2 sm:px-4 sm:py-2.5 border-b shadow-xs transition-colors \${"
);

fs.writeFileSync(path, content);
