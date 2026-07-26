const fs = require('fs');
const path = 'src/components/Modals/UserProfileModal.tsx';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('const fileInputRef')) {
  content = content.replace(
    "const [activeModal, setActiveModal] = useState<'none' | 'name' | 'username' | 'channel' | 'automation' | 'color' | 'birthday'>('none');",
    "const [activeModal, setActiveModal] = useState<'none' | 'name' | 'username' | 'channel' | 'automation' | 'color' | 'birthday'>('none');\n  const [activeColor, setActiveColor] = useState(displayUser?.profileColor || 'bg-blue-500');\n  const fileInputRef = React.useRef<HTMLInputElement>(null);\n\n  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {\n    const file = e.target.files?.[0];\n    if (file) {\n      const reader = new FileReader();\n      reader.onload = (event) => {\n        const url = event.target?.result as string;\n        updateUserProfile({ avatar: url });\n      };\n      reader.readAsDataURL(file);\n    }\n  };"
  );
}

// Fix color selection
content = content.replace(
  /\{colors\.map\(\(c, i\) => \(\s*<div key=\{i\} className=\{\`w-8 h-8 rounded-full \$\{c\} cursor-pointer hover:scale-110 transition-transform\`\} \/>\s*\)\)\}/,
  `{colors.map((c, i) => (
                  <div key={i} onClick={() => setActiveColor(c)} className={\`w-8 h-8 rounded-full \${c} cursor-pointer hover:scale-110 transition-transform \${activeColor === c ? 'ring-2 ring-sky-500 ring-offset-2 ring-offset-transparent' : ''}\`} />
                ))}`
);

content = content.replace(
  /updateUserProfile\(\{ profileColor: 'Fayozbek' \}\)/g,
  "updateUserProfile({ profileColor: activeColor })"
);

// Fix avatar upload click
content = content.replace(
  /<div className="absolute bottom-0 right-0 bg-blue-500 p-1\.5 rounded-full border-2 border-\[\#17212b\]">/,
  '<div onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-blue-500 p-1.5 rounded-full border-2 border-[#17212b] cursor-pointer hover:bg-blue-600 transition-colors">'
);

// Add the hidden file input near the modal root
if (!content.includes('type="file"')) {
  content = content.replace(
    /return \(\s*<div className="fixed inset-0 z-50 flex items-center justify-center p-4">/,
    `return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} accept="image/*" className="hidden" />`
  );
}

fs.writeFileSync(path, content);
