const fs = require('fs');
const path = 'src/components/Chat/ChatWindow.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  /<button className=\{\`w-full flex items-center gap-4 px-4 py-2 text-\[14px\] transition-colors \$\{isLight \? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-\[\#202b36\] text-gray-200'\}\`\}>\s*<svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 \.891-1.077 1.337-1.707\.707L5.586 15z"><\/path><line x1="17" y1="9" x2="23" y2="15"><\/line><line x1="23" y1="9" x2="17" y2="15"><\/line><\/svg> \{activeChat\.isMuted \? 'Enable sound' : 'Disable sound'\}\s*<\/button>/,
  `<button onClick={() => { setShowMoreMenu(false); toggleMute(activeChat.id); }} className={\`w-full flex items-center gap-4 px-4 py-2 text-[14px] transition-colors \${isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-[#202b36] text-gray-200'}\`}>
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707 .707L5.586 15z"></path><line x1="17" y1="9" x2="23" y2="15"></line><line x1="23" y1="9" x2="17" y2="15"></line></svg> {activeChat.isMuted ? 'Enable sound' : 'Disable sound'}
                </button>`
);

content = content.replace(
  /<button onClick=\{.+?\} className=\{\`w-full flex items-center gap-4 px-4 py-2 text-\[14px\] transition-colors \$\{isLight \? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-\[\#202b36\] text-gray-200'\}\`\}>\s*<svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"><\/path><\/svg> Mute for...\s*<\/button>/,
  `<button onClick={() => { setShowMoreMenu(false); toggleMute(activeChat.id); }} className={\`w-full flex items-center gap-4 px-4 py-2 text-[14px] transition-colors \${isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-[#202b36] text-gray-200'}\`}>
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg> Mute for...
                </button>`
);

// Report and Export
content = content.replace(
  /<button onClick=\{.+?\} className=\{\`w-full flex items-center gap-4 px-4 py-2 text-\[14px\] transition-colors \$\{isLight \? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-\[\#202b36\] text-gray-200'\}\`\}>\s*<svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"><\/path><\/svg> Export chat history\s*<\/button>/,
  `<button onClick={() => { setShowMoreMenu(false); alert('Chat history exported successfully!'); }} className={\`w-full flex items-center gap-4 px-4 py-2 text-[14px] transition-colors \${isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-[#202b36] text-gray-200'}\`}>
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg> Export chat history
                </button>`
);

content = content.replace(
  /<button onClick=\{.+?\} className=\{\`w-full flex items-center gap-4 px-4 py-2 text-\[14px\] text-red-500 transition-colors \$\{isLight \? 'hover:bg-slate-100' : 'hover:bg-\[\#202b36\]'\}\`\}>\s*<svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h\.01m-6\.938 4h13\.856c1\.54 0 2\.502-1\.667 1\.732-3L13\.732 4c-\.77-1\.333-2\.694-1\.333-3\.464 0L3\.34 16c-\.77 1\.333\.192 3 1\.732 3z"><\/path><\/svg> Report\s*<\/button>/,
  `<button onClick={() => { setShowMoreMenu(false); alert('Report submitted successfully!'); }} className={\`w-full flex items-center gap-4 px-4 py-2 text-[14px] text-red-500 transition-colors \${isLight ? 'hover:bg-slate-100' : 'hover:bg-[#202b36]'}\`}>
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg> Report
                </button>`
);

content = content.replace(
  /<button onClick=\{.+?\} className=\{\`w-full flex items-center gap-4 px-4 py-2 text-\[14px\] transition-colors \$\{isLight \? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-\[\#202b36\] text-gray-200'\}\`\}>\s*<svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"><\/path><\/svg> Boost Group\s*<\/button>/,
  `<button onClick={() => { setShowMoreMenu(false); alert('Group boosted! 🚀'); }} className={\`w-full flex items-center gap-4 px-4 py-2 text-[14px] transition-colors \${isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-[#202b36] text-gray-200'}\`}>
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg> Boost Group
                </button>`
);


fs.writeFileSync(path, content);
