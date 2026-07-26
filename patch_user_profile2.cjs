const fs = require('fs');
const path = 'src/components/Modals/UserProfileModal.tsx';
let content = fs.readFileSync(path, 'utf8');

// Update channel modal
content = content.replace(
  /<button onClick=\{\(\) => setActiveModal\('none'\)\} className="text-sky-500 font-medium hover:text-sky-600">Done<\/button>/g,
  `<button onClick={() => {
                updateUserProfile({ personalChannel: 'Started' });
                setActiveModal('none');
              }} className="text-sky-500 font-medium hover:text-sky-600">Done</button>`
);

// Update automation modal
// It doesn't have a save button, let's add one.
const automationModalRegex = /<h2 className="font-medium text-\[17px\]">Chat Automation<\/h2>[\s\S]*?<button onClick=\{\(\) => setActiveModal\('none'\)\} className="p-1 rounded-full hover:bg-black\/10 transition-colors">\s*<X className="w-5 h-5" \/>\s*<\/button>/m;
content = content.replace(automationModalRegex, (match) => {
  return `<h2 className="font-medium text-[17px]">Chat Automation</h2>
              </div>
              <button onClick={() => {
                updateUserProfile({ automationEnabled: true });
                setActiveModal('none');
              }} className="text-sky-500 font-medium hover:text-sky-600">Save</button>`;
});


// Update birthday modal
content = content.replace(
  /if \(activeModal === 'birthday'\) \{[\s\S]*?return \([\s\S]*?<button onClick=\{\(\) => setActiveModal\('none'\)\} className="text-sky-500 font-medium hover:text-sky-600">Save<\/button>/m,
  (match) => {
    return match.replace(
      `<button onClick={() => setActiveModal('none')} className="text-sky-500 font-medium hover:text-sky-600">Save</button>`,
      `<button onClick={() => {
                updateUserProfile({ birthday: 'July 25, 2025' });
                setActiveModal('none');
              }} className="text-sky-500 font-medium hover:text-sky-600">Save</button>`
    );
  }
);


// Update color modal
content = content.replace(
  /APPLY STYLE\s*<\/button>/,
  `APPLY STYLE
              </button>`
).replace(
  /<button className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors" onClick=\{\(\) => setActiveModal\('none'\)}>/,
  `<button className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors" onClick={() => { updateUserProfile({ profileColor: 'Fayozbek' }); setActiveModal('none'); }}>`
);

// Update UI to reflect state
content = content.replace(
  /<span className="text-sky-400">Add<\/span>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<div className=\{`flex items-center px-4 py-3 cursor-pointer hover:bg-black\/5`} onClick=\{\(\) => setActiveModal\('automation'\)}>/m,
  `<span className="text-sky-400">{displayUser.personalChannel || 'Add'}</span>
                </div>
              </div>
              <div className={\`flex items-center px-4 py-3 cursor-pointer hover:bg-black/5\`} onClick={() => setActiveModal('automation')}>`
);

content = content.replace(
  /<span className="text-sky-400">Off<\/span>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<div className=\{`flex items-center px-4 py-3 cursor-pointer hover:bg-black\/5`} onClick=\{\(\) => setActiveModal\('color'\)}>/m,
  `<span className="text-sky-400">{displayUser.automationEnabled ? 'On' : 'Off'}</span>
                </div>
              </div>
              <div className={\`flex items-center px-4 py-3 cursor-pointer hover:bg-black/5\`} onClick={() => setActiveModal('color')}>`
);

content = content.replace(
  /<span className="text-sky-400">Fayozbek<\/span>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<div className=\{`flex items-center px-4 py-3 cursor-pointer hover:bg-black\/5 border-b \$\{borderCol}`} onClick=\{\(\) => setActiveModal\('birthday'\)}>/m,
  `<span className="text-sky-400">{displayUser.profileColor || 'Fayozbek'}</span>
                </div>
              </div>
              <div className={\`flex items-center px-4 py-3 cursor-pointer hover:bg-black/5 border-b \${borderCol}\`} onClick={() => setActiveModal('birthday')}>`
);

content = content.replace(
  /<Gift className=\{`w-5 h-5 mr-4 \$\{textSub}`} \/>[\s\S]*?<div className="flex-1 flex justify-between items-center">[\s\S]*?<span className=\{textSub}>Birthday<\/span>[\s\S]*?<span className="text-sky-400">Add<\/span>/m,
  `<Gift className={\`w-5 h-5 mr-4 \${textSub}\`} />
                <div className="flex-1 flex justify-between items-center">
                  <span className={textSub}>Birthday</span>
                  <span className="text-sky-400">{displayUser.birthday || 'Add'}</span>`
);

fs.writeFileSync(path, content);
