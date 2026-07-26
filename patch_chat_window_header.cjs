const fs = require('fs');
const path = 'src/components/Chat/ChatWindow.tsx';
let content = fs.readFileSync(path, 'utf8');

const regexStatus = /<p className=\{\`text-\[11px\] sm:text-xs truncate font-medium \$\{isLight \? 'text-slate-500' : 'text-gray-400'\}\`\}>\s*\{activeChat\.isOnline \? \(\s*<span className="text-sky-500">online<\/span>\s*\) : \(\s*'last seen recently'\s*\)\}\s*<\/p>/m;

const replacementStatus = `<p className={\`text-[11px] sm:text-xs truncate font-medium \${isLight ? 'text-slate-500' : 'text-gray-400'}\`}>
              {activeChat.type === 'group' || activeChat.type === 'channel' ? (
                \`\${activeChat.membersCount || 0} members\`
              ) : activeChat.isOnline ? (
                <span className="text-sky-500">online</span>
              ) : (
                'last seen recently'
              )}
            </p>`;

content = content.replace(regexStatus, replacementStatus);


const regexHeaderActions = /\{\/\* Header Actions \*\/\}\s*<div className="flex items-center gap-0\.5 sm:gap-1\.5 shrink-0">\s*<button\s*onClick=\{[^}]*\}\s*title="Call"[\s\S]*?<Phone className="w-4 h-4 sm:w-5 sm:h-5" \/>\s*<\/button>\s*<button\s*onClick=\{[^}]*\}\s*title="Video Call"[\s\S]*?<Video className="w-4 h-4 sm:w-5 sm:h-5" \/>\s*<\/button>/m;

const replacementHeaderActions = `{/* Header Actions */}
        <div className="flex items-center gap-0.5 sm:gap-1.5 shrink-0">
          {activeChat.type !== 'group' && activeChat.type !== 'channel' && (
            <>
              <button
                onClick={() => startCall(activeChat.name, activeChat.avatar, false)}
                title="Call"
                className={\`hidden sm:flex p-1.5 sm:p-2 rounded-full transition-colors \${
                  isLight ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-[#202b36] text-gray-400'
                }\`}
              >
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              
              <button
                onClick={() => startCall(activeChat.name, activeChat.avatar, true)}
                title="Video Call"
                className={\`hidden sm:flex p-1.5 sm:p-2 rounded-full transition-colors \${
                  isLight ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-[#202b36] text-gray-400'
                }\`}
              >
                <Video className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </>
          )}`;

content = content.replace(regexHeaderActions, replacementHeaderActions);

fs.writeFileSync(path, content);
