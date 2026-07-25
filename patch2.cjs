const fs = require('fs');
const path = 'src/components/Chat/ChatWindow.tsx';
let content = fs.readFileSync(path, 'utf8');

const strToReplace = `<div className="relative shrink-0 cursor-pointer" onClick={() => setShowProfile(true)}>`;

const newContent = `<button
            onClick={() => setActiveChatId(null)}
            className={\`md:hidden p-1.5 sm:p-2 mr-1 -ml-1.5 rounded-full transition-colors \${
              isLight
                ? 'hover:bg-slate-100 text-slate-700'
                : 'hover:bg-[#202b36] text-gray-200'
            }\`}
            title="Back to chat list"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="relative shrink-0 cursor-pointer" onClick={() => setShowProfile(true)}>`;

content = content.replace(strToReplace, newContent);
fs.writeFileSync(path, content);
