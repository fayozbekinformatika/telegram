import fs from 'fs';
let code = fs.readFileSync('src/components/Modals/UserProfileModal.tsx', 'utf8');

const targetHelper = `  const { user: authUser, updateUserProfile } = useAuth();`;
const replHelper = `  const { user: authUser, updateUserProfile } = useAuth();
  
  const isUserOnline = (u: any) => {
    if (!u) return false;
    if (u.id === authUser?.id) return true;
    if (u.lastSeen) {
      const time = typeof u.lastSeen === 'string' ? parseInt(u.lastSeen, 10) : u.lastSeen;
      if (!isNaN(time)) {
        return (Date.now() - time) < 120000;
      }
    }
    if (u.id === 'user_me') return true;
    return false;
  };
`;
code = code.replace(targetHelper, replHelper);

const target1 = `<span className={\`text-sm \${displayUser.status === 'online' ? 'text-sky-500' : 'text-gray-400'}\`}>{displayUser.status || 'last seen recently'}</span>`;
const repl1 = `<span className={\`text-sm \${isUserOnline(displayUser) ? 'text-sky-500' : 'text-gray-400'}\`}>{isUserOnline(displayUser) ? 'online' : (displayUser.status === 'service notification' ? 'service notification' : 'last seen recently')}</span>`;
code = code.replace(target1, repl1);

const target2 = `<p className={\`text-sm \${displayUser.status === 'online' ? 'text-sky-400' : 'text-gray-400'}\`}>{displayUser.status || 'last seen recently'}</p>`;
const repl2 = `<p className={\`text-sm \${isUserOnline(displayUser) ? 'text-sky-400' : 'text-gray-400'}\`}>{isUserOnline(displayUser) ? 'online' : (displayUser.status === 'service notification' ? 'service notification' : 'last seen recently')}</p>`;
code = code.replace(target2, repl2);

const target3 = `{isGroupOrChannel ? \`\${membersList.length} \${membersList.length === 1 ? 'member' : 'members'}\` : (displayUser.status || 'last seen recently')}`;
const repl3 = `{isGroupOrChannel ? \`\${membersList.length} \${membersList.length === 1 ? 'member' : 'members'}\` : (isUserOnline(displayUser) ? 'online' : (displayUser.status === 'service notification' ? 'service notification' : 'last seen recently'))}`;
code = code.replace(target3, repl3);

const target4 = `status: member.status || 'last seen recently',`;
const repl4 = `status: isUserOnline(member) ? 'online' : (member.status === 'service notification' ? 'service notification' : 'last seen recently'),`;
code = code.replace(target4, repl4);

const target5 = `<span className={\`text-xs \${member.status === 'online' ? 'text-sky-400 font-medium' : textSub}\`}>`;
const repl5 = `<span className={\`text-xs \${member.status === 'online' ? 'text-sky-400 font-medium' : textSub}\`}>`;

fs.writeFileSync('src/components/Modals/UserProfileModal.tsx', code);
