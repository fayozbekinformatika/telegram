const fs = require('fs');
let code = fs.readFileSync('src/context/TelegramContext.tsx', 'utf-8');

// 1. Update the interface
code = code.replace(
  "createNewChat: (name: string, type: Chat['type'], username?: string, description?: string) => Chat;",
  "createNewChat: (name: string, type: Chat['type'], username?: string, description?: string, avatar?: string) => Chat;"
);

// 2. Update the implementation
code = code.replace(
  "const createNewChat = (name: string, type: Chat['type'], username?: string, description?: string): Chat => {",
  "const createNewChat = (name: string, type: Chat['type'], username?: string, description?: string, avatar?: string): Chat => {"
);

// 3. Update the object creation
code = code.replace(
  "avatar: \`https://api.dicebear.com/7.x/identicon/svg?seed=\${name}\`,",
  "avatar: avatar || \`https://api.dicebear.com/7.x/identicon/svg?seed=\${name}\`,"
);

fs.writeFileSync('src/context/TelegramContext.tsx', code);
console.log('patched context');
