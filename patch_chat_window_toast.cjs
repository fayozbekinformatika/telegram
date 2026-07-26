const fs = require('fs');
const path = 'src/components/Chat/ChatWindow.tsx';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('const [toastMsg, setToastMsg]')) {
  content = content.replace(
    "const [showMoreMenu, setShowMoreMenu] = useState(false);",
    "const [showMoreMenu, setShowMoreMenu] = useState(false);\n  const [toastMsg, setToastMsg] = useState('');\n  const showToast = (msg: string) => { setToastMsg(msg); setTimeout(() => setToastMsg(''), 3000); };"
  );
  
  content = content.replace(/alert\('(.+?)'\)/g, "showToast('$1')");
  
  // Also replace alert in 'Select tone'
  content = content.replace(
    /<button onClick=\{.+?\} className=\{\`w-full flex items-center gap-4 px-4 py-2 text-\[14px\] transition-colors \$\{isLight \? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-\[\#202b36\] text-gray-200'\}\`\}>\s*<svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15\.536 8\.464a5 5 0 010 7\.072m2\.828-9\.9a9 9 0 010 12\.728M5\.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1\.586l4\.707-4\.707C10\.923 3\.663 12 4\.109 12 5v14c0 \.891-1\.077 1\.337-1\.707 \.707L5\.586 15z"><\/path><\/svg> Select tone\s*<\/button>/,
    `<button onClick={() => { setShowMoreMenu(false); showToast('Tone selected successfully!'); }} className={\`w-full flex items-center gap-4 px-4 py-2 text-[14px] transition-colors \${isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-[#202b36] text-gray-200'}\`}>
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707 .707L5.586 15z"></path></svg> Select tone
                </button>`
  );

  // Add Toast rendering at the end of the return statement before closing div
  content = content.replace(
    /(\s*)(<\/div>\s*)$/,
    `$1  {toastMsg && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-50 bg-black/80 backdrop-blur-md text-white text-sm px-4 py-2 rounded-full shadow-lg animate-in fade-in slide-in-from-bottom-2">
          {toastMsg}
        </div>
      )}$1$2`
  );
}

fs.writeFileSync(path, content);
