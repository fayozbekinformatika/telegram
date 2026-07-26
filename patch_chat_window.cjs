const fs = require('fs');
const path = 'src/components/Chat/ChatWindow.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace useTelegram to extract toggleMute
content = content.replace(
  "const { chats, activeChatId, setActiveChatId, messages, startCall, theme, setSearchInChatMode, clearHistory, leaveChat } = useTelegram();",
  "const { chats, activeChatId, setActiveChatId, messages, startCall, theme, setSearchInChatMode, clearHistory, leaveChat, toggleMute } = useTelegram();"
);

// Mute forever
content = content.replace(
  /<button className=\{\`w-full flex items-center gap-4 px-4 py-2 text-\[14px\] text-red-500 transition-colors \$\{isLight \? 'hover:bg-slate-100' : 'hover:bg-\[\#202b36\]'\}\`\}>\s*<svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13\.73 21a2 2 0 0 1-3\.46 0"><\/path><path d="M18\.63 13A17\.89 17\.89 0 0 1 18 8"><\/path><path d="M6\.26 6\.26A5\.86 5\.86 0 0 0 6 8c0 7-3 9-3 9h14"><\/path><path d="M18 8a6 6 0 0 0-9\.33-5"><\/path><line x1="1" y1="1" x2="23" y2="23"><\/line><\/svg> Mute forever\s*<\/button>/,
  `<button onClick={() => { setShowMoreMenu(false); toggleMute(activeChat.id); }} className={\`w-full flex items-center gap-4 px-4 py-2 text-[14px] text-red-500 transition-colors \${isLight ? 'hover:bg-slate-100' : 'hover:bg-[#202b36]'}\`}>
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.73 21a2 2 0 0 1-3.46 0"></path><path d="M18.63 13A17.89 17.89 0 0 1 18 8"></path><path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14"></path><path d="M18 8a6 6 0 0 0-9.33-5"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg> Mute forever
                </button>`
);

content = content.replace(
  /<button className=\{\`w-full flex items-center gap-4 px-4 py-2 text-\[14px\] transition-colors \$\{isLight \? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-\[\#202b36\] text-gray-200'\}\`\}>\s*<svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5\.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1\.586l4\.707-4\.707C10\.923 3\.663 12 4\.109 12 5v14c0 \.891-1\.077 1\.337-1\.707 \.707L5\.586 15z"><\/path><line x1="17" y1="9" x2="23" y2="15"><\/line><line x1="23" y1="9" x2="17" y2="15"><\/line><\/svg> Disable sound\s*<\/button>/,
  `<button onClick={() => { setShowMoreMenu(false); toggleMute(activeChat.id); }} className={\`w-full flex items-center gap-4 px-4 py-2 text-[14px] transition-colors \${isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-[#202b36] text-gray-200'}\`}>
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707 .707L5.586 15z"></path><line x1="17" y1="9" x2="23" y2="15"></line><line x1="23" y1="9" x2="17" y2="15"></line></svg> Disable sound
                </button>`
);

content = content.replace(
  /Mute forever/g,
  "{activeChat.isMuted ? 'Unmute' : 'Mute forever'}"
);
content = content.replace(
  /Disable sound/g,
  "{activeChat.isMuted ? 'Enable sound' : 'Disable sound'}"
);

fs.writeFileSync(path, content);
