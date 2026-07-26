const fs = require('fs');
const path = 'src/components/Modals/UserProfileModal.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add state variable
content = content.replace(
  "const [isEditMode, setIsEditMode] = useState(false);",
  "const [isEditMode, setIsEditMode] = useState(false);\n  const [activeModal, setActiveModal] = useState<'none' | 'name' | 'username' | 'channel' | 'automation' | 'color' | 'birthday'>('none');"
);

// 2. Add sub-modals before the return of isEditMode block.
const subModalsStr = `
  const renderSubModal = () => {
    if (activeModal === 'none') return null;

    if (activeModal === 'name') {
      return (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setActiveModal('none')} />
          <div className={\`relative w-full max-w-[300px] rounded-xl shadow-2xl z-10 \${bgModal} p-5 animate-in fade-in zoom-in-95\`}>
            <h3 className="text-[17px] font-medium mb-4">Edit your name</h3>
            <div className="space-y-4">
              <div className="relative">
                <input type="text" defaultValue="Fayozbek" className={\`w-full bg-transparent border-b border-sky-500 focus:outline-none pb-1 text-[15px] \${isLight ? 'text-slate-800' : 'text-white'}\`} />
                <label className="absolute -top-3 left-0 text-xs text-sky-500">First name</label>
              </div>
              <div className="relative pt-2">
                <input type="text" defaultValue="Yusubjonov" className={\`w-full bg-transparent border-b \${isLight ? 'border-slate-300' : 'border-gray-600'} focus:border-sky-500 focus:outline-none pb-1 text-[15px] \${isLight ? 'text-slate-800' : 'text-white'}\`} />
                <label className={\`absolute -top-1 left-0 text-xs \${textSub}\`}>Last name</label>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button onClick={() => setActiveModal('none')} className="text-sky-500 font-medium hover:text-sky-600">Cancel</button>
              <button onClick={() => setActiveModal('none')} className="text-sky-500 font-medium hover:text-sky-600">Save</button>
            </div>
          </div>
        </div>
      );
    }
    
    if (activeModal === 'username') {
      return (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setActiveModal('none')} />
          <div className={\`relative w-full max-w-[300px] rounded-xl shadow-2xl z-10 \${bgModal} p-5 animate-in fade-in zoom-in-95\`}>
            <h3 className="text-[17px] font-medium mb-4">Username</h3>
            <div className="relative mb-4">
              <input type="text" defaultValue="fayozchek" className={\`w-full bg-transparent border-b border-sky-500 focus:outline-none pb-1 text-[15px] \${isLight ? 'text-slate-800' : 'text-white'}\`} />
              <label className="absolute -top-3 left-0 text-xs text-sky-500">@username</label>
            </div>
            <p className={\`text-[13px] leading-tight mb-3 \${textSub}\`}>You can choose a username on Telegram. If you do, other people will be able to find you by this username and contact you without knowing your phone number.</p>
            <p className={\`text-[13px] leading-tight mb-6 \${textSub}\`}>You can use a-z, 0-9 and underscores. Minimum length is 5 characters.</p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setActiveModal('none')} className="text-sky-500 font-medium hover:text-sky-600">Cancel</button>
              <button onClick={() => setActiveModal('none')} className="text-sky-500 font-medium hover:text-sky-600">Save</button>
            </div>
          </div>
        </div>
      );
    }
    
    if (activeModal === 'channel') {
      return (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setActiveModal('none')} />
          <div className={\`relative w-full max-w-[300px] rounded-xl shadow-2xl z-10 \${bgModal} p-5 flex flex-col items-center justify-center min-h-[300px] animate-in fade-in zoom-in-95\`}>
            <h3 className="absolute top-4 left-5 text-[17px] font-medium">Personal channel</h3>
            <div className="flex flex-col items-center justify-center flex-1 w-full mt-8">
              <p className={\`text-[15px] mb-2 \${textSub}\`}>You don't have any public channels yet.</p>
              <button className="text-sky-500 font-medium hover:underline">Start a Channel</button>
            </div>
            <div className="w-full flex justify-end mt-4">
              <button onClick={() => setActiveModal('none')} className="text-sky-500 font-medium hover:text-sky-600">Done</button>
            </div>
          </div>
        </div>
      );
    }
    
    if (activeModal === 'automation') {
      return (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setActiveModal('none')} />
          <div className={\`relative w-full max-w-[300px] rounded-xl shadow-2xl z-10 \${bgModal} flex flex-col overflow-hidden animate-in fade-in zoom-in-95\`}>
            <div className={\`flex items-center justify-between p-3 border-b \${borderCol}\`}>
              <div className="flex items-center gap-3">
                <button onClick={() => setActiveModal('none')} className="p-1 rounded-full hover:bg-black/10 transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="font-medium text-[17px]">Chat Automation</h2>
              </div>
              <button onClick={() => setActiveModal('none')} className="p-1 rounded-full hover:bg-black/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 flex flex-col items-center">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mb-4">
                 <Bot className="w-8 h-8 text-sky-500" />
              </div>
              <p className={\`text-[14px] text-center mb-4 \${textSub}\`}>Add a bot to answer messages on your behalf.</p>
              
              <div className="w-full">
                <input type="text" placeholder="Enter bot URL or username" className={\`w-full bg-transparent border-b \${isLight ? 'border-slate-300' : 'border-gray-600'} focus:border-sky-500 focus:outline-none pb-2 mb-2 text-[15px] \${isLight ? 'text-slate-800' : 'text-white'}\`} />
                <p className={\`text-[12px] mb-4 \${textSub}\`}>Choose a bot to manage your chats automatically.</p>
                
                <h4 className="text-sky-500 text-[13px] font-medium mb-3">Chats the bot can access</h4>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-4 h-4 rounded-full border-[5px] border-sky-500"></div>
                  <span className="text-[15px]">All Private Chats Except...</span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className={\`w-4 h-4 rounded-full border-2 \${isLight ? 'border-slate-300' : 'border-gray-500'}\`}></div>
                  <span className="text-[15px]">Only Selected Chats</span>
                </div>
                
                <h4 className="text-sky-500 text-[13px] font-medium mb-3">Excluded chats</h4>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold">-</div>
                  <span className="text-[15px]">Exclude Chats</span>
                </div>
                <p className={\`text-[12px] \${textSub}\`}>Select chats or entire chat categories which the bot will not have access to.</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    if (activeModal === 'color') {
      const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-cyan-500', 'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-rose-500'];
      return (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setActiveModal('none')} />
          <div className={\`relative w-full max-w-[320px] rounded-xl shadow-2xl z-10 \${bgModal} flex flex-col overflow-hidden animate-in fade-in zoom-in-95 max-h-[90vh]\`}>
            <div className={\`flex items-center justify-between p-3 border-b \${borderCol}\`}>
              <h2 className="font-medium text-[17px] pl-2">Color preview</h2>
              <button onClick={() => setActiveModal('none')} className="p-1 rounded-full hover:bg-black/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex border-b border-black/10">
              <button className="flex-1 py-3 text-center text-sky-500 font-medium border-b-2 border-sky-500">Profile</button>
              <button className={\`flex-1 py-3 text-center \${textSub}\`}>Name</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 rounded-full border-4 border-green-500 p-1 mb-2">
                  <img src={user.avatar || 'https://i.pravatar.cc/150'} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                </div>
                <h3 className="font-medium">{user.name}</h3>
                <span className="text-sky-500 text-sm">online</span>
              </div>
              
              <div className="flex flex-wrap gap-3 justify-center mb-6">
                {colors.map((c, i) => (
                  <div key={i} className={\`w-8 h-8 rounded-full \${c} cursor-pointer hover:scale-110 transition-transform\`} />
                ))}
              </div>
              
              <div className={\`flex items-center justify-between py-3 border-y \${borderCol} cursor-pointer\`}>
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-black/5 rounded"><Gift className="w-4 h-4 text-sky-500" /></div>
                  <span>Add icons to Profile</span>
                </div>
                <span className="text-sky-500">Off</span>
              </div>
              
              <p className={\`text-[13px] my-3 \${textSub}\`}>You can change the color of your name and customize replies to you. <span className="text-sky-500 cursor-pointer">Change {'>'}</span></p>
              
              <div className="flex gap-4 text-[13px] font-medium mb-4">
                <span className={\`border-b-2 border-slate-400 pb-1\`}>My Gifts</span>
                <span className={\`\${textSub}\`}>🌪️ Chill Flame</span>
                <span className={\`\${textSub}\`}>🍦 Vice Cream</span>
              </div>
              
              <div className="flex flex-col items-center justify-center py-6">
                 <div className="text-6xl mb-2">🦆</div>
                 <p className="text-[14px] text-center font-medium">You don't have any gifts you<br/>can use as a profile cover.</p>
                 <button className="text-sky-500 text-[14px] mt-2">Browse gifts available for purchase {'>'}</button>
              </div>
            </div>
            
            <div className="p-4 border-t border-black/10">
              <button className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors" onClick={() => setActiveModal('none')}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/></svg>
                APPLY STYLE
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    if (activeModal === 'birthday') {
      return (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setActiveModal('none')} />
          <div className={\`relative w-full max-w-[300px] rounded-xl shadow-2xl z-10 \${bgModal} p-5 animate-in fade-in zoom-in-95\`}>
            <h3 className="text-[17px] font-medium mb-6">Set your Birthday</h3>
            
            <div className="relative flex justify-between items-center h-[120px] mb-6 px-4">
               {/* Selection Highlight */}
               <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-8 border-y border-sky-500/30 bg-sky-500/10 pointer-events-none"></div>
               
               {/* Columns - Fake scrollable appearance */}
               <div className="flex flex-col items-center gap-3 text-[15px] z-10">
                 <span className={\`\${textSub} opacity-50\`}>23</span>
                 <span className={\`\${textSub}\`}>24</span>
                 <span className={\`font-medium \${isLight ? 'text-slate-900' : 'text-white'}\`}>25</span>
                 <span className={\`\${textSub}\`}>26</span>
                 <span className={\`\${textSub} opacity-50\`}>27</span>
               </div>
               <div className="flex flex-col items-center gap-3 text-[15px] z-10">
                 <span className={\`\${textSub} opacity-50\`}>May</span>
                 <span className={\`\${textSub}\`}>June</span>
                 <span className={\`font-medium \${isLight ? 'text-slate-900' : 'text-white'}\`}>July</span>
                 <span className={\`\${textSub}\`}>August</span>
                 <span className={\`\${textSub} opacity-50\`}>September</span>
               </div>
               <div className="flex flex-col items-center gap-3 text-[15px] z-10">
                 <span className={\`\${textSub} opacity-50\`}>2025</span>
                 <span className={\`\${textSub}\`}>2026</span>
                 <span className={\`font-medium \${isLight ? 'text-slate-900' : 'text-white'}\`}>—</span>
                 <span className={\`\${textSub}\`}>—</span>
                 <span className={\`\${textSub} opacity-50\`}>—</span>
               </div>
            </div>
            
            <div className="flex justify-end gap-4">
              <button onClick={() => setActiveModal('none')} className="text-sky-500 font-medium hover:text-sky-600">Cancel</button>
              <button onClick={() => setActiveModal('none')} className="text-sky-500 font-medium hover:text-sky-600">Save</button>
            </div>
          </div>
        </div>
      );
    }
  };
`;

content = content.replace(
  "return (\n      <div className=\"fixed inset-0 z-[100] flex items-center justify-center\">",
  subModalsStr + "\n    return (\n      <div className=\"fixed inset-0 z-[100] flex items-center justify-center\">"
);

// 3. Inject `{renderSubModal()}` into the main modal
content = content.replace(
  "{/* Header */}",
  "{renderSubModal()}\n          {/* Header */}"
);

// 4. Update click handlers to open sub-modals
content = content.replace(
  /<div className={`flex items-center px-4 py-3 cursor-pointer hover:bg-black\/5`}>\s*<UserIcon/g,
  `<div className={\`flex items-center px-4 py-3 cursor-pointer hover:bg-black/5\`} onClick={() => setActiveModal('name')}>\n                <UserIcon`
);

content = content.replace(
  /<div className={`flex items-center px-4 py-3 cursor-pointer hover:bg-black\/5`}>\s*<AtSign/g,
  `<div className={\`flex items-center px-4 py-3 cursor-pointer hover:bg-black/5\`} onClick={() => setActiveModal('username')}>\n                <AtSign`
);

content = content.replace(
  /<div className={`flex items-center px-4 py-3 cursor-pointer hover:bg-black\/5`}>\s*<Megaphone/g,
  `<div className={\`flex items-center px-4 py-3 cursor-pointer hover:bg-black/5\`} onClick={() => setActiveModal('channel')}>\n                <Megaphone`
);

content = content.replace(
  /<div className={`flex items-center px-4 py-3 cursor-pointer hover:bg-black\/5`}>\s*<Bot/g,
  `<div className={\`flex items-center px-4 py-3 cursor-pointer hover:bg-black/5\`} onClick={() => setActiveModal('automation')}>\n                <Bot`
);

content = content.replace(
  /<div className={`flex items-center px-4 py-3 cursor-pointer hover:bg-black\/5`}>\s*<Palette/g,
  `<div className={\`flex items-center px-4 py-3 cursor-pointer hover:bg-black/5\`} onClick={() => setActiveModal('color')}>\n                <Palette`
);

content = content.replace(
  /<div className={`flex items-center px-4 py-3 cursor-pointer hover:bg-black\/5 border-b \${borderCol}`}>\s*<Gift/g,
  `<div className={\`flex items-center px-4 py-3 cursor-pointer hover:bg-black/5 border-b \${borderCol}\`} onClick={() => setActiveModal('birthday')}>\n                <Gift`
);

fs.writeFileSync(path, content);
