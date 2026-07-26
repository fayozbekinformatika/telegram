const fs = require('fs');
const path = 'src/components/Chat/ChatWindow.tsx';
let content = fs.readFileSync(path, 'utf8');

if (!content.includes('{toastMsg && (')) {
  content = content.replace(
    "      {/* User Profile Modal */}",
    `      {toastMsg && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-50 bg-black/80 backdrop-blur-md text-white text-sm px-4 py-2 rounded-full shadow-lg animate-in fade-in slide-in-from-bottom-2">
          {toastMsg}
        </div>
      )}
      {/* User Profile Modal */}`
  );
}

fs.writeFileSync(path, content);
