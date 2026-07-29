import fs from 'fs';
let code = fs.readFileSync('src/components/Modals/UserProfileModal.tsx', 'utf8');

if (!code.includes('import { isUserOnline }')) {
  code = code.replace("import { motion, AnimatePresence }", "import { isUserOnline } from '../../lib/time';\nimport { motion, AnimatePresence }");
}

let target1 = `<span className={\`text-sm \${displayUser.status === 'online' ? 'text-sky-500' : 'text-gray-400'}\`}>{displayUser.status || 'last seen recently'}</span>`;
let repl1 = `<span className={\`text-sm \${isUserOnline(displayUser) ? 'text-sky-500' : 'text-gray-400'}\`}>{isUserOnline(displayUser) ? 'online' : (displayUser.status === 'service notification' ? 'service notification' : 'last seen recently')}</span>`;
code = code.replace(target1, repl1);

let target2 = `<p className={\`text-sm \${displayUser.status === 'online' ? 'text-sky-400' : 'text-gray-400'}\`}>{displayUser.status || 'last seen recently'}</p>`;
let repl2 = `<p className={\`text-sm \${isUserOnline(displayUser) ? 'text-sky-400' : 'text-gray-400'}\`}>{isUserOnline(displayUser) ? 'online' : (displayUser.status === 'service notification' ? 'service notification' : 'last seen recently')}</p>`;
code = code.replace(target2, repl2);

let target3 = `{isGroupOrChannel ? \`\${membersList.length} \${membersList.length === 1 ? 'member' : 'members'}\` : (displayUser.status || 'last seen recently')}`;
let repl3 = `{isGroupOrChannel ? \`\${membersList.length} \${membersList.length === 1 ? 'member' : 'members'}\` : (isUserOnline(displayUser) ? 'online' : (displayUser.status === 'service notification' ? 'service notification' : 'last seen recently'))}`;
code = code.replace(target3, repl3);

let target4 = `<span className={\`text-xs \${member.status === 'online' ? 'text-sky-400 font-medium' : textSub}\`}>
                          {member.status || 'last seen recently'}
                        </span>`;
let repl4 = `<span className={\`text-xs \${isUserOnline(member) ? 'text-sky-400 font-medium' : textSub}\`}>
                          {isUserOnline(member) ? 'online' : (member.status === 'service notification' ? 'service notification' : 'last seen recently')}
                        </span>`;
code = code.replace(target4, repl4);

fs.writeFileSync('src/components/Modals/UserProfileModal.tsx', code);
