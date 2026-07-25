const fs = require('fs');
const path = 'src/components/Chat/ChatWindow.tsx';
let content = fs.readFileSync(path, 'utf8');

const strToReplace = `      <MessageInput
        chatId={activeChat.id}
        replyToMessage={replyToMessage}
        onCancelReply={() => setReplyToMessage(null)}
        onOpenCreatePoll={onOpenCreatePoll}
      />
    </div>`;

const newContent = `      <MessageInput
        chatId={activeChat.id}
        replyToMessage={replyToMessage}
        onCancelReply={() => setReplyToMessage(null)}
        onOpenCreatePoll={onOpenCreatePoll}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        user={activeChat ? ({ id: activeChat.id, name: activeChat.name, phone: "+998 77 400 11 25", username: activeChat.username || "username", avatar: activeChat.avatar, isOnline: true } as any) : null}
      />
    </div>`;

content = content.replace(strToReplace, newContent);
fs.writeFileSync(path, content);
