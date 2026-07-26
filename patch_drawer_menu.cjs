const fs = require('fs');
const path = 'src/components/Sidebar/SideMenuDrawer.tsx';
let content = fs.readFileSync(path, 'utf8');

const newMenuList = `<div className="flex-1 overflow-y-auto py-2 space-y-0.5">
          <button
            onClick={() => { setShowMyProfile(true); }}
            className={\`w-full flex items-center gap-4 px-5 py-3 text-[15px] transition-colors \${
              isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-[#202b36] text-gray-200'
            }\`}
          >
            <UserIcon className="w-5 h-5 opacity-70" />
            <span className="font-medium flex-1 text-left">My Profile</span>
          </button>
          <div className={\`my-1 border-t \${isLight ? 'border-slate-100' : 'border-black/20'}\`} />
          <button
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
          </button>
          
          <button
            onClick={() => {
              setActiveChatId('saved_messages');
              onClose();
            }}
            className={\`w-full flex items-center gap-4 px-5 py-3 text-[15px] transition-colors \${
              isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-[#202b36] text-gray-200'
            }\`}
          >
            <Bookmark className="w-5 h-5 opacity-70" />
            <span className="font-medium flex-1 text-left">Saved Messages</span>
          </button>
          
          <button
            onClick={() => { onOpenContacts(); onClose(); }}
            className={\`w-full flex items-center gap-4 px-5 py-3 text-[15px] transition-colors \${
              isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-[#202b36] text-gray-200'
            }\`}
          >
            <UserIcon className="w-5 h-5 opacity-70" />
            <span className="font-medium flex-1 text-left">Contacts</span>
          </button>
          
          <button
            onClick={() => {
              onOpenSettings();
              onClose();
            }}
            className={\`w-full flex items-center gap-4 px-5 py-3 text-[15px] transition-colors \${
              isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-[#202b36] text-gray-200'
            }\`}
          >
            <Settings className="w-5 h-5 opacity-70" />
            <span className="font-medium flex-1 text-left">Settings</span>
          </button>
          
          <button
            onClick={toggleNightMode}
            className={\`w-full flex items-center gap-4 px-5 py-3 text-[15px] transition-colors \${
              isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-[#202b36] text-gray-200'
            }\`}
          >
            <Moon className="w-5 h-5 opacity-70" />
            <span className="font-medium flex-1 text-left">Dark Mode</span>
            {/* Toggle switch */}
            <div className={\`w-8 h-4 rounded-full relative transition-colors \${!isLight ? 'bg-sky-500' : 'bg-slate-300'}\`}>
              <div className={\`absolute top-0.5 bottom-0.5 w-3 bg-white rounded-full transition-transform \${!isLight ? 'translate-x-4' : 'translate-x-0.5'}\`} />
            </div>
          </button>
          
          <button className={\`w-full flex items-center gap-4 px-5 py-3 text-[15px] transition-colors \${isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-[#202b36] text-gray-200'}\`}>
            <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            <span className="font-medium flex-1 text-left">Animations</span>
          </button>
          
          <button className={\`w-full flex items-center gap-4 px-5 py-3 text-[15px] transition-colors \${isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-[#202b36] text-gray-200'}\`}>
            <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            <span className="font-medium flex-1 text-left">Telegram Features</span>
          </button>
          
          <button className={\`w-full flex items-center gap-4 px-5 py-3 text-[15px] transition-colors \${isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-[#202b36] text-gray-200'}\`}>
            <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
            <span className="font-medium flex-1 text-left">Report Bug</span>
          </button>
          
          <button className={\`w-full flex items-center gap-4 px-5 py-3 text-[15px] transition-colors \${isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-[#202b36] text-gray-200'}\`}>
            <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
            <span className="font-medium flex-1 text-left">Switch to K Version</span>
          </button>
          
          <button className={\`w-full flex items-center gap-4 px-5 py-3 text-[15px] transition-colors \${isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-[#202b36] text-gray-200'}\`}>
            <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            <span className="font-medium flex-1 text-left">Install App</span>
          </button>
        </div>

        {/* Footer */}
        <div
          className={\`p-4 border-t flex flex-col justify-center \${
            isLight ? 'border-slate-100 text-slate-500' : 'border-black/20 text-gray-500'
          }\`}
        >
          <span className="text-[13px] font-medium mb-0.5">
            Telegram Web Z
          </span>
          <span className="text-[12px]">
            Version 2.1.2 alpha — About
          </span>
        </div>`;

const menuListRegex = /\{\/\* Menu Items List \*\/\}\s*<div className="flex-1 overflow-y-auto py-2 space-y-0.5">[\s\S]*?Version 7\.0\.4 x64 — About\s*<\/span>\s*<\/div>/m;

content = content.replace(menuListRegex, "{/* Menu Items List */}\n        " + newMenuList);
fs.writeFileSync(path, content);
