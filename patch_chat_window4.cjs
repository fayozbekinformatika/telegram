const fs = require('fs');
const path = 'src/components/Chat/ChatWindow.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  /\{\/\* User Profile Modal \*\/\}\s*<\/div>\s*\);\s*\};/m,
  "{/* User Profile Modal */}\n    </div>\n    </div>\n  );\n};"
);

fs.writeFileSync(path, content);
