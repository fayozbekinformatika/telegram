import fs from 'fs';
let code = fs.readFileSync('src/components/Chat/ChatWindow.tsx', 'utf8');

// The issue is an extra `};`
code = code.replace("  };\n\n  };\n", "  };\n\n");

fs.writeFileSync('src/components/Chat/ChatWindow.tsx', code);
