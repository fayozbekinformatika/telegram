const fs = require('fs');
const path = 'src/components/Modals/UserProfileModal.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Update the activeModal union type
content = content.replace(
  /const \[activeModal, setActiveModal\] = useState\<'none' \| 'name' \| 'username' \| 'channel' \| 'automation' \| 'color' \| 'birthday'\>\('none'\);/,
  "const [activeModal, setActiveModal] = useState<'none' | 'name' | 'username' | 'channel' | 'automation' | 'color' | 'birthday' | 'bio'>('none');\n  const [editBio, setEditBio] = useState(displayUser?.bio || '');"
);

// 2. Add the 'bio' modal logic
const bioModalCode = `
    if (activeModal === 'bio') {
      return (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setActiveModal('none')} />
          <div className={\`relative w-full max-w-[300px] rounded-xl shadow-2xl z-10 \${bgModal} p-5 animate-in fade-in zoom-in-95\`}>
            <h3 className="text-[17px] font-medium mb-4">Bio</h3>
            <div className="relative mb-4">
              <textarea value={editBio} onChange={(e) => setEditBio(e.target.value)} maxLength={70} className={\`w-full bg-transparent border-b border-sky-500 focus:outline-none pb-1 text-[15px] resize-none \${isLight ? 'text-slate-800' : 'text-white'}\`} rows={3} placeholder="Any details such as age, occupation or city." />
              <div className="absolute bottom-2 right-2 text-xs text-slate-400">{editBio.length}/70</div>
            </div>
            <p className={\`text-[13px] leading-tight mb-6 \${textSub}\`}>Any details such as age, occupation or city.<br/>Example: 23 y.o. designer from San Francisco</p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setActiveModal('none')} className="text-sky-500 font-medium hover:text-sky-600">Cancel</button>
              <button onClick={() => {
                updateUserProfile({ bio: editBio });
                setActiveModal('none');
              }} className="text-sky-500 font-medium hover:text-sky-600">Save</button>
            </div>
          </div>
        </div>
      );
    }
`;

content = content.replace(
  /if \(activeModal === 'name'\) \{/,
  bioModalCode.trim() + '\n    if (activeModal === \'name\') {'
);

// 3. Make the Bio section clickable
content = content.replace(
  /\{\/\* Bio \*\/\}\s*<div className=\{\`px-4 py-3 border-b border-t \$\{borderCol\}\`\}\>\s*<div className="flex justify-between items-center mb-1"\>\s*<span className=\{textSub\}\>Bio<\/span>\s*<span className=\{textSub\}\>70<\/span>\s*<\/div>\s*<p className=\{\`text-xs \$\{textSub\} leading-tight\`\}\>\s*Any details such as age, occupation or city\.\s*<br \/>Example: 23 y\.o\. designer from San Francisco\s*<\/p>\s*<\/div>/m,
  `{/* Bio */}
            <div className={\`px-4 py-3 border-b border-t \${borderCol} cursor-pointer hover:bg-black/5\`} onClick={() => setActiveModal('bio')}>
              <div className="flex justify-between items-center mb-1">
                <span className={textSub}>Bio</span>
                <span className={textSub}>{displayUser.bio ? 70 - displayUser.bio.length : 70}</span>
              </div>
              <p className={\`text-[15px] leading-tight \${isLight ? 'text-slate-800' : 'text-white'} mb-1\`}>
                {displayUser.bio || 'Add a few words about yourself'}
              </p>
              <p className={\`text-xs \${textSub} leading-tight\`}>
                Any details such as age, occupation or city.
              </p>
            </div>`
);

content = content.replace(
  /<div className="flex flex-col py-2">\s*<span className=\{\`text-\[15px\] font-medium \$\{isLight \? 'text-slate-800' : 'text-gray-100'\}\`\}>\s*fayozchekyusubhonov@gmail\.com\s*<\/span>\s*<span className=\{\`text-\[13px\] \$\{textSub\}\`\}>\s*Google \(Email\)\s*<\/span>\s*<\/div>/,
  `<div className="flex flex-col py-2">
            <span className={\`text-[15px] font-medium \${isLight ? 'text-slate-800' : 'text-gray-100'}\`}>
              {displayUser.bio || 'Bio'}
            </span>
            <span className={\`text-[13px] \${textSub}\`}>
              Bio
            </span>
          </div>
          <div className="flex flex-col py-2">
            <span className={\`text-[15px] font-medium \${isLight ? 'text-slate-800' : 'text-gray-100'}\`}>
              fayozchekyusubhonov@gmail.com
            </span>
            <span className={\`text-[13px] \${textSub}\`}>
              Google (Email)
            </span>
          </div>`
);

fs.writeFileSync(path, content);
