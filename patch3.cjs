const fs = require('fs');
const path = 'src/components/Chat/MessageItem.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldStr = `isOutgoing
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-md'`;

const newStr = `isOutgoing
                    ? (isLight ? 'bg-[#eeffde] text-slate-900 rounded-br-none shadow-sm' : 'bg-[#2b5278] text-white rounded-br-none shadow-sm')`;

content = content.replace(oldStr, newStr);

// Let's also fix the incoming bubble roundness
const oldIncoming = `isLight
                    ? 'bg-white text-slate-800 rounded-tl-none shadow-xs border border-slate-200'
                    : 'bg-[#182533] text-gray-100 rounded-bl-xs border border-gray-700/40 shadow-sm'`;

const newIncoming = `isLight
                    ? 'bg-white text-slate-800 rounded-bl-none shadow-sm border border-slate-200'
                    : 'bg-[#182533] text-gray-100 rounded-bl-none border border-gray-700/40 shadow-sm'`;
content = content.replace(oldIncoming, newIncoming);

fs.writeFileSync(path, content);
