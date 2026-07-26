const fs = require('fs');
const path = 'src/components/Chat/MessageItem.tsx';
let content = fs.readFileSync(path, 'utf8');

const target = `<svg className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="3"
                    strokeDasharray="301.59"
                    strokeDashoffset={301.59 - (301.59 * videoProgress)}
                    strokeLinecap="round"
                  />
                </svg>`;

content = content.replace(target, '');
fs.writeFileSync(path, content);
