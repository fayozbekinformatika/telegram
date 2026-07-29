import fs from 'fs';
let code = fs.readFileSync('src/components/Chat/ChatWindow.tsx', 'utf8');

const targetToRemove = `  const isUserOnline = (u: any) => {
    if (!u) return false;
    if (u.id === user?.id) return true;
    if (u.lastSeen) {
      const time = typeof u.lastSeen === 'string' ? parseInt(u.lastSeen, 10) : u.lastSeen;
      if (!isNaN(time)) {
        return (Date.now() - time) < 120000; // 2 minutes
      }
    }
    // fallback
    return u.status === 'online';
  };`;
  
code = code.replace(targetToRemove, "");
fs.writeFileSync('src/components/Chat/ChatWindow.tsx', code);
