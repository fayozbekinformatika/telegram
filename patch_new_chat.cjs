const fs = require('fs');
let code = fs.readFileSync('src/components/Modals/NewChatModal.tsx', 'utf-8');

// Add useRef
if (!code.includes('useRef')) {
  code = code.replace("import React, { useState }", "import React, { useState, useRef }");
}

// Add state and ref
code = code.replace(
  "const [showPhotoMenu, setShowPhotoMenu] = useState(false);",
  `const [showPhotoMenu, setShowPhotoMenu] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setAvatarPreview(url);
        setShowPhotoMenu(false);
      };
      reader.readAsDataURL(file);
    }
  };`
);

// Include avatar in createNewChat
code = code.replace(
  "createNewChat(name.trim(), type as ChatType, '', description.trim());",
  "createNewChat(name.trim(), type as ChatType, avatarPreview, description.trim());"
);

// Reset avatar preview on close
code = code.replace(
  "setShowPhotoMenu(false);\n    onClose();",
  "setShowPhotoMenu(false);\n    setAvatarPreview('');\n    onClose();"
);

code = code.replace(
  "setShowPhotoMenu(false);\n    onClose();",
  "setShowPhotoMenu(false);\n    setAvatarPreview('');\n    onClose();"
);

// Add file input and replace Camera button
const newButton = `
            <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} accept="image/*" className="hidden" />
            <button 
              onClick={() => setShowPhotoMenu(!showPhotoMenu)}
              className="w-14 h-14 rounded-full bg-sky-500 hover:bg-sky-400 flex items-center justify-center transition-colors text-white overflow-hidden relative"
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="Group Avatar" className="w-full h-full object-cover" />
              ) : (
                <Camera className="w-6 h-6" />
              )}
            </button>
`;

code = code.replace(
  /<button\s*onClick=\{\(\) => setShowPhotoMenu\(!showPhotoMenu\)\}\s*className="w-14 h-14 rounded-full bg-sky-500 hover:bg-sky-400 flex items-center justify-center transition-colors text-white"\s*>\s*<Camera className="w-6 h-6" \/>\s*<\/button>/m,
  newButton
);

// Wire up the File dropdown option to trigger file input
code = code.replace(
  /<button onClick=\{\(e\) => showToast\(e\.currentTarget\.textContent \|\| "Coming soon"\)\} className=\{\`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-black\/10 transition-colors\`\}>\s*<ImageIcon className="w-5 h-5 text-gray-400" \/>\s*<span>File<\/span>\s*<\/button>/m,
  `<button onClick={() => { fileInputRef.current?.click(); }} className={\`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-black/10 transition-colors\`}>
                  <ImageIcon className="w-5 h-5 text-gray-400" />
                  <span>File</span>
                </button>`
);

fs.writeFileSync('src/components/Modals/NewChatModal.tsx', code);
console.log('patched newchat');
