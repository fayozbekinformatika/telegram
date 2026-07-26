const fs = require('fs');
const path = 'src/App.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "import { AuthProvider, useAuth } from './context/AuthContext';",
  "import { AuthProvider, useAuth } from './context/AuthContext';\nimport { ToastProvider } from './context/ToastContext';"
);

content = content.replace(
  "<TelegramProvider>",
  "<ToastProvider><TelegramProvider>"
);

content = content.replace(
  "</TelegramProvider>",
  "</TelegramProvider></ToastProvider>"
);

fs.writeFileSync(path, content);
