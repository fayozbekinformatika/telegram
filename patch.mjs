import fs from 'fs';
let code = fs.readFileSync('src/components/Chat/ChatWindow.tsx', 'utf8');

const target = `              ) : (activeChat.isOnline || getOtherUser(activeChat.id)?.status === 'online') ? (
                <span className="text-sky-500">online</span>
              ) : (
                getOtherUser(activeChat.id)?.status || 'last seen recently'
              )}`;

const replacement = `              ) : (activeChat.isOnline || getOtherUser(activeChat.id)?.status === 'online') ? (
                <span className="text-sky-500">online</span>
              ) : (
                (getOtherUser(activeChat.id)?.status === 'service notification') ? 'service notification' : 'last seen recently'
              )}`;

code = code.replace(target, replacement);
fs.writeFileSync('src/components/Chat/ChatWindow.tsx', code);
