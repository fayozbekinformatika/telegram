const fs = require('fs');
const path = 'src/components/Chat/ChatWindow.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add to destructuring
content = content.replace(
  "const { chats, activeChatId, setActiveChatId, messages, startCall, theme, setSearchInChatMode } = useTelegram();",
  "const { chats, activeChatId, setActiveChatId, messages, startCall, theme, setSearchInChatMode, clearHistory, leaveChat } = useTelegram();"
);

// Update menu buttons
content = content.replace(
  /<button className=\{\`w-full flex items-center gap-4 px-4 py-2 text-\[14px\] transition-colors \$\{isLight \? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-\[\#202b36\] text-gray-200'\}\`\}>\s*<svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15\.536 8\.464a5 5 0 010 7\.072m2\.828-9\.9a9 9 0 010 12\.728M5\.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1\.586l4\.707-4\.707C10\.923 3\.663 12 4\.109 12 5v14c0 \.891-1\.077 1\.337-1\.707 \.707L5\.586 15z"><\/path><\/svg> Select tone\s*<\/button>/m,
  `<button onClick={() => setShowMoreMenu(false)} className={\`w-full flex items-center gap-4 px-4 py-2 text-[14px] transition-colors \${isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-[#202b36] text-gray-200'}\`}>
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707 .707L5.586 15z"></path></svg> Select tone
                </button>`
);

content = content.replace(
  /<button className=\{\`w-full flex items-center gap-4 px-4 py-2 text-\[14px\] transition-colors \$\{isLight \? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-\[\#202b36\] text-gray-200'\}\`\}>\s*<svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5\.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1\.586l4\.707-4\.707C10\.923 3\.663 12 4\.109 12 5v14c0 \.891-1\.077 1\.337-1\.707 \.707L5\.586 15z"><\/path><line x1="17" y1="9" x2="23" y2="15"><\/line><line x1="23" y1="9" x2="17" y2="15"><\/line><\/svg> Disable sound\s*<\/button>/m,
  `<button onClick={() => setShowMoreMenu(false)} className={\`w-full flex items-center gap-4 px-4 py-2 text-[14px] transition-colors \${isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-[#202b36] text-gray-200'}\`}>
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707 .707L5.586 15z"></path><line x1="17" y1="9" x2="23" y2="15"></line><line x1="23" y1="9" x2="17" y2="15"></line></svg> Disable sound
                </button>`
);

content = content.replace(
  /<button className=\{\`w-full flex items-center gap-4 px-4 py-2 text-\[14px\] transition-colors \$\{isLight \? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-\[\#202b36\] text-gray-200'\}\`\}>\s*<svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1\.405-1\.405A2\.032 2\.032 0 0118 14\.158V11a6\.002 6\.002 0 00-4-5\.659V5a2 2 0 10-4 0v\.341C7\.67 6\.165 6 8\.388 6 11v3\.159c0 \.538-\.214 1\.055-\.595 1\.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"><\/path><\/svg> Mute for\.\.\.\s*<\/button>/m,
  `<button onClick={() => setShowMoreMenu(false)} className={\`w-full flex items-center gap-4 px-4 py-2 text-[14px] transition-colors \${isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-[#202b36] text-gray-200'}\`}>
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg> Mute for...
                </button>`
);

content = content.replace(
  /<button className=\{\`w-full flex items-center gap-4 px-4 py-2 text-\[14px\] text-red-500 transition-colors \$\{isLight \? 'hover:bg-slate-100' : 'hover:bg-\[\#202b36\]'\}\`\}>\s*<svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M18\.364 18\.364A9 9 0 005\.636 5\.636m12\.728 12\.728A9 9 0 015\.636 5\.636m12\.728 12\.728L5\.636 5\.636"><\/path><\/svg> Mute forever\s*<\/button>/m,
  `<button onClick={() => setShowMoreMenu(false)} className={\`w-full flex items-center gap-4 px-4 py-2 text-[14px] text-red-500 transition-colors \${isLight ? 'hover:bg-slate-100' : 'hover:bg-[#202b36]'}\`}>
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg> Mute forever
                </button>`
);

content = content.replace(
  /<button className=\{\`w-full flex items-center gap-4 px-4 py-2 text-\[14px\] transition-colors \$\{isLight \? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-\[\#202b36\] text-gray-200'\}\`\}>\s*<svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h\.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"><\/path><\/svg> View group info\s*<\/button>/m,
  `<button onClick={() => { setShowMoreMenu(false); setShowProfile(true); }} className={\`w-full flex items-center gap-4 px-4 py-2 text-[14px] transition-colors \${isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-[#202b36] text-gray-200'}\`}>
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> View {activeChat.type === 'group' || activeChat.type === 'channel' ? 'group' : 'profile'} info
                </button>`
);

content = content.replace(
  /<button className=\{\`w-full flex items-center gap-4 px-4 py-2 text-\[14px\] transition-colors \$\{isLight \? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-\[\#202b36\] text-gray-200'\}\`\}>\s*<svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"><\/path><\/svg> Boost Group\s*<\/button>/m,
  `<button onClick={() => setShowMoreMenu(false)} className={\`w-full flex items-center gap-4 px-4 py-2 text-[14px] transition-colors \${isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-[#202b36] text-gray-200'}\`}>
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg> Boost Group
                </button>`
);

content = content.replace(
  /<button\s*onClick=\{onOpenCreatePoll\}\s*className=\{\`w-full flex items-center gap-4 px-4 py-2 text-\[14px\] transition-colors \$\{isLight \? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-\[\#202b36\] text-gray-200'\}\`\}\s*>\s*<svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"><\/path><\/svg> Create poll\s*<\/button>/m,
  `<button
                  onClick={() => { setShowMoreMenu(false); onOpenCreatePoll(); }}
                  className={\`w-full flex items-center gap-4 px-4 py-2 text-[14px] transition-colors \${isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-[#202b36] text-gray-200'}\`}
                >
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg> Create poll
                </button>`
);

content = content.replace(
  /<button className=\{\`w-full flex items-center gap-4 px-4 py-2 text-\[14px\] transition-colors \$\{isLight \? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-\[\#202b36\] text-gray-200'\}\`\}>\s*<svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"><\/path><\/svg> Export chat history\s*<\/button>/m,
  `<button onClick={() => setShowMoreMenu(false)} className={\`w-full flex items-center gap-4 px-4 py-2 text-[14px] transition-colors \${isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-[#202b36] text-gray-200'}\`}>
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg> Export chat history
                </button>`
);

content = content.replace(
  /<button className=\{\`w-full flex items-center gap-4 px-4 py-2 text-\[14px\] transition-colors \$\{isLight \? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-\[\#202b36\] text-gray-200'\}\`\}>\s*<svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h\.01m-6\.938 4h13\.856c1\.54 0 2\.502-1\.667 1\.732-3L13\.732 4c-\.77-1\.333-2\.694-1\.333-3\.464 0L3\.34 16c-\.77 1\.333\.192 3 1\.732 3z"><\/path><\/svg> Report\s*<\/button>/m,
  `<button onClick={() => setShowMoreMenu(false)} className={\`w-full flex items-center gap-4 px-4 py-2 text-[14px] transition-colors \${isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-[#202b36] text-gray-200'}\`}>
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg> Report
                </button>`
);

content = content.replace(
  /<button className=\{\`w-full flex items-center gap-4 px-4 py-2 text-\[14px\] transition-colors \$\{isLight \? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-\[\#202b36\] text-gray-200'\}\`\}>\s*<svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-\.867 12\.142A2 2 0 0116\.138 21H7\.862a2 2 0 01-1\.995-1\.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"><\/path><\/svg> Clear history\s*<\/button>/m,
  `<button onClick={() => { setShowMoreMenu(false); clearHistory(activeChat.id); }} className={\`w-full flex items-center gap-4 px-4 py-2 text-[14px] transition-colors \${isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-[#202b36] text-gray-200'}\`}>
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg> Clear history
                </button>`
);

content = content.replace(
  /<button onClick=\{\(\) => setShowMoreMenu\(false\)\} className=\{\`w-full flex items-center gap-4 px-4 py-2 text-\[14px\] text-red-500 transition-colors \$\{isLight \? 'hover:bg-slate-100' : 'hover:bg-\[\#202b36\]'\}\`\}>\s*<svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"><\/path><\/svg> Leave group\s*<\/button>/m,
  `<button onClick={() => { setShowMoreMenu(false); leaveChat(activeChat.id); }} className={\`w-full flex items-center gap-4 px-4 py-2 text-[14px] text-red-500 transition-colors \${isLight ? 'hover:bg-slate-100' : 'hover:bg-[#202b36]'}\`}>
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg> Leave {activeChat.type === 'group' || activeChat.type === 'channel' ? 'group' : 'chat'}
                </button>`
);

fs.writeFileSync(path, content);
