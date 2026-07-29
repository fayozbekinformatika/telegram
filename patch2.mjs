import fs from 'fs';
let code = fs.readFileSync('src/components/Modals/UserProfileModal.tsx', 'utf8');

let target1 = `                <span className="text-sky-500 text-sm">online</span>`;
let repl1 = `                <span className={\`text-sm \${displayUser.status === 'online' ? 'text-sky-500' : 'text-gray-400'}\`}>{displayUser.status || 'last seen recently'}</span>`;
code = code.replace(target1, repl1);

let target2 = `              <p className="text-sm text-sky-400">online</p>`;
let repl2 = `              <p className={\`text-sm \${displayUser.status === 'online' ? 'text-sky-400' : 'text-gray-400'}\`}>{displayUser.status || 'last seen recently'}</p>`;
code = code.replace(target2, repl2);

fs.writeFileSync('src/components/Modals/UserProfileModal.tsx', code);
