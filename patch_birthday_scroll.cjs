const fs = require('fs');
let code = fs.readFileSync('src/components/Modals/UserProfileModal.tsx', 'utf-8');

// Add editBirthday state
code = code.replace(
  "const [activeNameColor, setActiveNameColor] = useState(displayUser?.nameColor || 'bg-yellow-500');",
  "const [activeNameColor, setActiveNameColor] = useState(displayUser?.nameColor || 'bg-yellow-500');\n  const [editBirthday, setEditBirthday] = useState<Date | null>(displayUser?.birthday ? new Date(displayUser.birthday) : null);"
);

// Get the date strings for the display
const birthdayModalReplacement = `
    if (activeModal === 'birthday') {
      const getDisplayDate = () => {
         if (!editBirthday) return new Date();
         return editBirthday;
      };
      
      const d = getDisplayDate();
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      
      const mStr = monthNames[d.getMonth()];
      const day = d.getDate();
      const year = d.getFullYear();
      
      return (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setActiveModal('none')} />
          <div className={\`relative w-full max-w-[300px] rounded-xl shadow-2xl z-10 \${bgModal} p-5 animate-in fade-in zoom-in-95\`}>
            <h3 className="text-[17px] font-medium mb-6">Set your Birthday</h3>
            
            <div className="relative flex justify-between items-center h-[120px] mb-6 px-4 overflow-hidden">
               {/* Invisible input on top */}
               <input 
                 type="date" 
                 className="absolute inset-0 opacity-0 z-20 cursor-pointer w-full h-full"
                 value={editBirthday ? editBirthday.toISOString().split('T')[0] : ''}
                 onChange={(e) => {
                   if (e.target.value) {
                     setEditBirthday(new Date(e.target.value));
                   } else {
                     setEditBirthday(null);
                   }
                 }}
               />
            
               {/* Selection Highlight */}
               <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-8 border-y border-sky-500/30 bg-sky-500/10 pointer-events-none"></div>
               
               {/* Columns - Fake scrollable appearance */}
               <div className="flex flex-col items-center gap-3 text-[15px] z-10">
                 <span className={\`\${textSub} opacity-50\`}>{day - 2 > 0 ? day - 2 : ''}</span>
                 <span className={\`\${textSub}\`}>{day - 1 > 0 ? day - 1 : ''}</span>
                 <span className={\`font-medium \${isLight ? 'text-slate-900' : 'text-white'}\`}>{day}</span>
                 <span className={\`\${textSub}\`}>{day + 1 <= 31 ? day + 1 : ''}</span>
                 <span className={\`\${textSub} opacity-50\`}>{day + 2 <= 31 ? day + 2 : ''}</span>
               </div>
               <div className="flex flex-col items-center gap-3 text-[15px] z-10">
                 <span className={\`\${textSub} opacity-50\`}>{monthNames[(d.getMonth() + 10) % 12]}</span>
                 <span className={\`\${textSub}\`}>{monthNames[(d.getMonth() + 11) % 12]}</span>
                 <span className={\`font-medium \${isLight ? 'text-slate-900' : 'text-white'}\`}>{mStr}</span>
                 <span className={\`\${textSub}\`}>{monthNames[(d.getMonth() + 1) % 12]}</span>
                 <span className={\`\${textSub} opacity-50\`}>{monthNames[(d.getMonth() + 2) % 12]}</span>
               </div>
               <div className="flex flex-col items-center gap-3 text-[15px] z-10">
                 <span className={\`\${textSub} opacity-50\`}>{year - 2}</span>
                 <span className={\`\${textSub}\`}>{year - 1}</span>
                 <span className={\`font-medium \${isLight ? 'text-slate-900' : 'text-white'}\`}>{year}</span>
                 <span className={\`\${textSub}\`}>{year + 1}</span>
                 <span className={\`\${textSub} opacity-50\`}>{year + 2}</span>
               </div>
            </div>
            
            <div className="flex justify-end gap-4">
              <button onClick={() => setActiveModal('none')} className="text-sky-500 font-medium hover:text-sky-600">Cancel</button>
              <button onClick={() => {
                if (editBirthday) {
                  const formatted = editBirthday.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                  updateUserProfile({ birthday: formatted });
                } else {
                  updateUserProfile({ birthday: '' });
                }
                setActiveModal('none');
              }} className="text-sky-500 font-medium hover:text-sky-600">Save</button>
            </div>
          </div>
        </div>
      );
    }
  };`;

const regex = /if \(activeModal === 'birthday'\) \{[\s\S]*?\}  \};/g;
code = code.replace(regex, birthdayModalReplacement);

fs.writeFileSync('src/components/Modals/UserProfileModal.tsx', code);
console.log('patched birthday');
