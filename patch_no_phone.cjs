const fs = require('fs');

// 1. Sidebar/SideMenuDrawer.tsx
let sidebarCode = fs.readFileSync('src/components/Sidebar/SideMenuDrawer.tsx', 'utf-8');
sidebarCode = sidebarCode.replace(
  /phone: "\+998 77 400 11 25", /g,
  ''
);
fs.writeFileSync('src/components/Sidebar/SideMenuDrawer.tsx', sidebarCode);
console.log('patched SideMenuDrawer');

// 2. Modals/UserProfileModal.tsx
let profileCode = fs.readFileSync('src/components/Modals/UserProfileModal.tsx', 'utf-8');

// phone settings item
const phoneSettingsRegex = /<div onClick=\{\(\) => showToast\("Change phone number wizard coming soon"\)\} className=\{\`flex items-center px-4 py-3 cursor-pointer hover:bg-black\/5\`\}>\s*<Phone className=\{\`w-5 h-5 mr-4 \$\{textSub\}\`\} \/>\s*<div className="flex-1 flex justify-between items-center">\s*<span className=\{textSub\}>Phone number<\/span>\s*<span className="text-sky-400">\{displayUser\.phone \|\| '\+998 77 400 11 25'\}<\/span>\s*<\/div>\s*<\/div>/;
profileCode = profileCode.replace(phoneSettingsRegex, '');

// phone info item
const phoneInfoRegex = /<div className="flex flex-col py-2">\s*<span className=\{\`text-\[15px\] font-medium \$\{isLight \? 'text-slate-800' : 'text-gray-100'\}\`\}>\s*\{displayUser\.phone \|\| '\+998 77 400 11 25'\}\s*<\/span>\s*<span className=\{\`text-\[13px\] \$\{textSub\}\`\}>\s*Mobile\s*<\/span>\s*<\/div>/;
profileCode = profileCode.replace(phoneInfoRegex, '');

// username modal text
const usernameTextRegex = /You can choose a username on Telegram\. If you do, other people will be able to find you by this username and contact you without knowing your phone number\./;
profileCode = profileCode.replace(usernameTextRegex, 'You can choose a username on Telegram. If you do, other people will be able to find you by this username and contact you easily.');

// "Username lets people contact you on Telegram without needing your phone number."
const usernameDescRegex = /Username lets people contact you on Telegram without needing your phone number\./;
profileCode = profileCode.replace(usernameDescRegex, 'Username lets people contact you on Telegram easily.');

fs.writeFileSync('src/components/Modals/UserProfileModal.tsx', profileCode);
console.log('patched UserProfileModal');

// 3. Settings/SettingsModal.tsx
let settingsCode = fs.readFileSync('src/components/Settings/SettingsModal.tsx', 'utf-8');
const settingsPhoneRegex = /<p className="text-\[13px\] opacity-80">\{user\?\.phone \|\| '\+998 77 400 11 25'\}<\/p>\n/;
settingsCode = settingsCode.replace(settingsPhoneRegex, '');
fs.writeFileSync('src/components/Settings/SettingsModal.tsx', settingsCode);
console.log('patched SettingsModal');

