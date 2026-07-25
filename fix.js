const fs = require('fs');
const path = 'src/components/Chat/ChatWindow.tsx';
let content = fs.readFileSync(path, 'utf8');

const strToReplace = `      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        user={{ id: "1", name: "Fayozbek Yusubjonov", phone: "+998 77 400 11 25", username: "fayozchek", avatar: activeChat.avatar, isOnline: true } as any}
      />
    </div>`;

content = content.replaceAll(strToReplace, '    </div>');
fs.writeFileSync(path, content);
