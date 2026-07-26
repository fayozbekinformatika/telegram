const fs = require('fs');
const path = 'src/components/Sidebar/SideMenuDrawer.tsx';
let content = fs.readFileSync(path, 'utf8');

// I will insert New Group above Channel
const channelBtn = `<button
            onClick={() => {
              onOpenNewChat('channel');
              onClose();
            }}
            className={\`w-full flex items-center gap-4 px-5 py-3 text-[15px] transition-colors \${
              isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-[#202b36] text-gray-200'
            }\`}
          >
            <Radio className="w-5 h-5 opacity-70" />
            <span className="font-medium flex-1 text-left">Channel</span>
          </button>`;

const newGroupBtn = `<button
            onClick={() => {
              onOpenNewChat('group');
              onClose();
            }}
            className={\`w-full flex items-center gap-4 px-5 py-3 text-[15px] transition-colors \${
              isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-[#202b36] text-gray-200'
            }\`}
          >
            <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            <span className="font-medium flex-1 text-left">New Group</span>
          </button>`;

content = content.replace(channelBtn, newGroupBtn + "\n          " + channelBtn);
fs.writeFileSync(path, content);
