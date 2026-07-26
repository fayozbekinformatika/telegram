const fs = require('fs');
const path = 'src/components/Chat/ChatWindow.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldMenu = `<button className={\`w-full flex items-center gap-4 px-4 py-2 text-[14px] transition-colors \${isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-[#202b36] text-gray-200'}\`}>
                  <Check className="w-5 h-5 opacity-70" /> Select tone
                </button>
                <button className={\`w-full flex items-center gap-4 px-4 py-2 text-[14px] transition-colors \${isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-[#202b36] text-gray-200'}\`}>
                  <Info className="w-5 h-5 opacity-70" /> View group info
                </button>
                <button onClick={() => { setShowMoreMenu(false); onOpenCreatePoll(); }} className={\`w-full flex items-center gap-4 px-4 py-2 text-[14px] transition-colors \${isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-[#202b36] text-gray-200'}\`}>
                  <Sparkles className="w-5 h-5 opacity-70" /> Create poll
                </button>`;

const newMenu = `<button className={\`w-full flex items-center gap-4 px-4 py-2 text-[14px] transition-colors \${isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-[#202b36] text-gray-200'}\`}>
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg> Select tone
                </button>
                <button className={\`w-full flex items-center gap-4 px-4 py-2 text-[14px] transition-colors \${isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-[#202b36] text-gray-200'}\`}>
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path><line x1="17" y1="9" x2="23" y2="15"></line><line x1="23" y1="9" x2="17" y2="15"></line></svg> Disable sound
                </button>
                <button className={\`w-full flex items-center gap-4 px-4 py-2 text-[14px] transition-colors \${isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-[#202b36] text-gray-200'}\`}>
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg> Mute for...
                </button>
                <button className={\`w-full flex items-center gap-4 px-4 py-2 text-[14px] text-red-500 transition-colors \${isLight ? 'hover:bg-slate-100' : 'hover:bg-[#202b36]'}\`}>
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.73 21a2 2 0 0 1-3.46 0"></path><path d="M18.63 13A17.89 17.89 0 0 1 18 8"></path><path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14"></path><path d="M18 8a6 6 0 0 0-9.33-5"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg> Mute forever
                </button>
                <div className={\`my-1 border-b \${isLight ? 'border-slate-100' : 'border-white/10'}\`} />
                <button onClick={() => { setShowMoreMenu(false); setShowProfile(true); }} className={\`w-full flex items-center gap-4 px-4 py-2 text-[14px] transition-colors \${isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-[#202b36] text-gray-200'}\`}>
                  <Info className="w-5 h-5 opacity-70" /> View group info
                </button>
                <button className={\`w-full flex items-center gap-4 px-4 py-2 text-[14px] transition-colors \${isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-[#202b36] text-gray-200'}\`}>
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg> Boost Group
                </button>
                <button onClick={() => { setShowMoreMenu(false); onOpenCreatePoll(); }} className={\`w-full flex items-center gap-4 px-4 py-2 text-[14px] transition-colors \${isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-[#202b36] text-gray-200'}\`}>
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg> Create poll
                </button>
                <button className={\`w-full flex items-center gap-4 px-4 py-2 text-[14px] transition-colors \${isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-[#202b36] text-gray-200'}\`}>
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg> Export chat history
                </button>
                <button className={\`w-full flex items-center gap-4 px-4 py-2 text-[14px] transition-colors \${isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-[#202b36] text-gray-200'}\`}>
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg> Report
                </button>
                <button className={\`w-full flex items-center gap-4 px-4 py-2 text-[14px] transition-colors \${isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-[#202b36] text-gray-200'}\`}>
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg> Clear history
                </button>
                <div className={\`my-1 border-b \${isLight ? 'border-slate-100' : 'border-white/10'}\`} />
                <button onClick={() => setShowMoreMenu(false)} className={\`w-full flex items-center gap-4 px-4 py-2 text-[14px] text-red-500 transition-colors \${isLight ? 'hover:bg-slate-100' : 'hover:bg-[#202b36]'}\`}>
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg> Leave group
                </button>`;

content = content.replace(oldMenu, newMenu);
fs.writeFileSync(path, content);
