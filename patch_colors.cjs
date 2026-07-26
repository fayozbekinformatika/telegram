const fs = require('fs');
let code = fs.readFileSync('src/components/Modals/UserProfileModal.tsx', 'utf-8');

const regex = /if \(activeModal === 'color'\) \{[\s\S]*?(?=if \(activeModal === 'birthday'\))/;
const match = code.match(regex);
if (match) {
  code = code.replace(
    match[0],
    `if (activeModal === 'color') {
      const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-cyan-500', 'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-rose-500'];
      
      const currentActiveColor = colorTab === 'profile' ? activeProfileColor : activeNameColor;
      const setCurrentColor = colorTab === 'profile' ? setActiveProfileColor : setActiveNameColor;
      
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
              <button onClick={() => setColorTab('profile')} className={\`flex-1 py-3 text-center font-medium \${colorTab === 'profile' ? 'text-sky-500 border-b-2 border-sky-500' : textSub}\`}>Profile</button>
              <button onClick={() => setColorTab('name')} className={\`flex-1 py-3 text-center font-medium \${colorTab === 'name' ? 'text-sky-500 border-b-2 border-sky-500' : textSub}\`}>Name</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
              <div className="flex flex-col items-center mb-6">
                <div className={\`w-20 h-20 rounded-full border-[3px] \${activeProfileColor.replace('bg-', 'border-')} p-1 mb-2\`}>
                  <img src={displayUser.avatar || 'https://i.pravatar.cc/150'} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                </div>
                <h3 className={\`font-medium \${activeNameColor.replace('bg-', 'text-')}\`}>{displayUser.name}</h3>
                <span className="text-sky-500 text-sm">online</span>
              </div>
              
              <div className="flex flex-wrap gap-3 justify-center mb-6">
                {colors.map((c, i) => (
                  <div key={i} onClick={() => setCurrentColor(c)} className={\`w-10 h-10 rounded-full \${c} cursor-pointer hover:scale-110 transition-transform \${currentActiveColor === c ? 'ring-[3px] ring-sky-500 ring-offset-[3px] ring-offset-[#17212b]' : ''}\`} />
                ))}
              </div>
              
              <div onClick={() => showToast("Icons library coming soon")} className={\`flex items-center justify-between py-3 border-y \${borderCol} cursor-pointer\`}>
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-black/5 rounded"><Gift className="w-4 h-4 text-sky-500" /></div>
                  <span>Add icons to Profile</span>
                </div>
                <span className="text-sky-500">Off</span>
              </div>
              
              <p className={\`text-[13px] my-3 \${textSub}\`}>You can change the color of your name and customize replies to you. <span onClick={() => showToast("Change color scheme coming soon")} className="text-sky-500 cursor-pointer">Change {'>'}</span></p>
              
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
              <button className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors" onClick={() => { updateUserProfile({ profileColor: activeProfileColor, nameColor: activeNameColor }); setActiveModal('none'); }}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/></svg>
                APPLY STYLE
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    `
  );
  fs.writeFileSync('src/components/Modals/UserProfileModal.tsx', code);
  console.log("Match found and replaced");
} else {
  console.log("Match not found");
}
