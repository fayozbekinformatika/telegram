const fs = require('fs');
const path = 'src/components/Modals/UserProfileModal.tsx';
let content = fs.readFileSync(path, 'utf8');

const regex = /if \(activeModal === 'birthday'\) \{[\s\S]*?\}    if/g;
const match = content.match(/if \(activeModal === 'birthday'\) \{[\s\S]*?(?=  \};\n\n    return \()/);

if (match) {
  content = content.replace(
    match[0],
    `if (activeModal === 'birthday') {
      return (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setActiveModal('none')} />
          <div className={\`relative w-full max-w-[300px] rounded-xl shadow-2xl z-10 \${bgModal} p-5 animate-in fade-in zoom-in-95\`}>
            <h3 className="text-[17px] font-medium mb-4">Set your Birthday</h3>
            
            <div className="mb-6">
              <input
                type="date"
                defaultValue={displayUser.birthday ? new Date(displayUser.birthday).toISOString().split('T')[0] : ''}
                className={\`w-full bg-transparent border-b border-sky-500 focus:outline-none pb-1 text-[15px] \${isLight ? 'text-slate-800' : 'text-white'}\`}
                onChange={(e) => {
                   // We'll store it directly to avoid adding a new state, and access it via ID.
                   // A better way is using a ref, but let's just add an ID.
                }}
                id="birthday-input"
              />
            </div>
            
            <div className="flex justify-end gap-4">
              <button onClick={() => setActiveModal('none')} className="text-sky-500 font-medium hover:text-sky-600">Cancel</button>
              <button onClick={() => {
                const dateVal = (document.getElementById('birthday-input') as HTMLInputElement)?.value;
                if (dateVal) {
                  const d = new Date(dateVal);
                  const formatted = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
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
    }`
  );
  fs.writeFileSync(path, content);
  console.log("patched!");
} else {
  console.log("Not found!");
}
