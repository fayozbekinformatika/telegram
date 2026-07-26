const fs = require('fs');
const path = 'src/components/Sidebar/SideMenuDrawer.tsx';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('UserProfileModal')) {
  content = content.replace(
    "import { useTelegram } from '../../context/TelegramContext';",
    "import { useTelegram } from '../../context/TelegramContext';\nimport { UserProfileModal } from '../Modals/UserProfileModal';"
  );
  
  content = content.replace(
    "const { theme, toggleTheme } = useTelegram();",
    "const { theme, toggleTheme } = useTelegram();\n  const [showMyProfile, setShowMyProfile] = React.useState(false);"
  );

  const headerTarget = `<div className={\`p-4 \${isLight ? 'bg-blue-500' : 'bg-[#1e2c3a]'}\`}>`;
  const headerReplacement = `<div className={\`p-4 cursor-pointer \${isLight ? 'bg-blue-500' : 'bg-[#1e2c3a]'}\`} onClick={() => setShowMyProfile(true)}>`;
  content = content.replace(headerTarget, headerReplacement);

  const btnTarget = `<button
            onClick={() => {}}
            className={\`w-full flex items-center gap-4 px-5 py-3 text-[15px] transition-colors \${
              isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-[#202b36] text-gray-200'
            }\`}
          >
            <UserIcon className="w-5 h-5 opacity-70" />
            <span className="font-medium flex-1 text-left">My Profile</span>
          </button>`;
  
  const btnReplacement = `<button
            onClick={() => { setShowMyProfile(true); }}
            className={\`w-full flex items-center gap-4 px-5 py-3 text-[15px] transition-colors \${
              isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-[#202b36] text-gray-200'
            }\`}
          >
            <UserIcon className="w-5 h-5 opacity-70" />
            <span className="font-medium flex-1 text-left">My Profile</span>
          </button>`;
  content = content.replace(btnTarget, btnReplacement);
  
  const modalAddTarget = `      {/* Backdrop */}`;
  const modalAddReplacement = `      <UserProfileModal 
        isOpen={showMyProfile} 
        onClose={() => setShowMyProfile(false)} 
        user={{ id: user?.id || 'me', name: user?.name || 'Fayozbek Yusubjonov', phone: "+998 77 400 11 25", username: "fayozchek", avatar: user?.avatar || 'https://i.pravatar.cc/150?u=a042581f4e29026024d', isOnline: true } as any}
      />
      
      {/* Backdrop */}`;
  
  content = content.replace(modalAddTarget, modalAddReplacement);
  fs.writeFileSync(path, content);
}
