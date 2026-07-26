const fs = require('fs');
const path = 'src/components/Modals/ContactsModal.tsx';
let content = fs.readFileSync(path, 'utf8');

// Remove vars from their current place
const vars = `  const bgModal = isLight ? 'bg-white text-slate-800' : 'bg-[#17212b] text-white';
  const textSub = isLight ? 'text-slate-500' : 'text-gray-400';
  const borderCol = isLight ? 'border-slate-100' : 'border-black/20';
  const inputBg = isLight ? 'bg-slate-100' : 'bg-[#242f3d]';
  const inputBorder = isLight ? 'border-transparent' : 'border-[#17212b]';
`;
content = content.replace(vars, "");

// Add them before if (isAdding)
content = content.replace(
  "  if (isAdding) {",
  vars + "\n  if (isAdding) {"
);

fs.writeFileSync(path, content);
