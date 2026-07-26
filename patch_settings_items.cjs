const fs = require('fs');
const path = 'src/components/Settings/SettingsModal.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  /<div className="flex items-center px-5 py-3 hover:bg-black\/5 cursor-pointer transition-colors">/g,
  '<div onClick={(e) => showToast(e.currentTarget.textContent || "Feature coming soon")} className="flex items-center px-5 py-3 hover:bg-black/5 cursor-pointer transition-colors">'
);

content = content.replace(
  '<button className="p-2 hover:bg-black/10 rounded-full transition-colors self-start">',
  '<button onClick={() => showToast("Scan QR Code")} className="p-2 hover:bg-black/10 rounded-full transition-colors self-start">'
);

fs.writeFileSync(path, content);
