import fs from 'fs';
let code = fs.readFileSync('src/context/TelegramContext.tsx', 'utf8');

const target = `  useEffect(() => {
    localStorage.setItem('tg_chats', JSON.stringify(chats));`;

const replacement = `  // Heartbeat
  useEffect(() => {
    if (user && isFirebaseConfigured() && db) {
      const interval = setInterval(() => {
        setDoc(doc(db, 'telegram_clone', 'users'), { 
          [user.id]: { lastSeen: Date.now(), status: 'online' } 
        }, { merge: true }).catch(err => console.error(err));
      }, 60000); // 1 minute
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('tg_chats', JSON.stringify(chats));`;

code = code.replace(target, replacement);
fs.writeFileSync('src/context/TelegramContext.tsx', code);
