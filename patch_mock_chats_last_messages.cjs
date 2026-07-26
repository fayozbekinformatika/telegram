const fs = require('fs');
const path = 'src/data/initialData.ts';
let content = fs.readFileSync(path, 'utf8');

// I'll do string replacements for each chat id block in initialChats.
content = content.replace(
  /id: 'chat_sleepwalkers',[\s\S]*?folderIds: \['all', 'work'\],/m,
  "id: 'chat_sleepwalkers', name: 'The Sleepwalkers | SAT English', type: 'group', avatar: 'https://ui-avatars.com/api/?name=TE&background=0284c7&color=fff&font-size=0.4', unreadCount: 0, membersCount: 35, description: 'CRM group: Odd 09:00 SAT English\\nDescription', folderIds: ['all', 'work'], lastMessage: { id: 'm8', chatId: 'chat_sleepwalkers', senderId: 'system', senderName: '', text: 'kallmeryan pinned \"9.30 am English Room 10\"', timestamp: '22:22', dateStr: 'Today', isOutgoing: false, isRead: true, isDelivered: true }"
);

content = content.replace(
  /id: 'chat_hitler',[\s\S]*?folderIds: \['all', 'work'\],/m,
  "id: 'chat_hitler', name: 'Hitler Adminstration | even days 9am SAT Math', type: 'group', avatar: 'https://ui-avatars.com/api/?name=HM&background=ec4899&color=fff&font-size=0.4', unreadCount: 0, membersCount: 42, description: 'SAT Math prep group', folderIds: ['all', 'work'], lastMessage: { id: 'm1', chatId: 'chat_hitler', senderId: 'user_deedo', senderName: 'deedo', text: '👍 Sticker', timestamp: '22:11', dateStr: 'Today', isOutgoing: false, isRead: true, isDelivered: true }"
);

content = content.replace(
  /id: 'chat_feruzam',[\s\S]*?folderIds: \['all', 'personal'\],/m,
  "id: 'chat_feruzam', name: 'FERUZAM 😍', type: 'private', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', unreadCount: 0, folderIds: ['all', 'personal']"
);

content = content.replace(
  /id: 'chat_saved',[\s\S]*?folderIds: \['all', 'personal'\],/m,
  "id: 'chat_saved', name: 'Saved Messages', type: 'private', avatar: 'https://ui-avatars.com/api/?name=SM&background=3b82f6&color=fff&font-size=0.4', unreadCount: 0, isPinned: true, description: 'Your cloud storage for notes, links, and forwarded messages.', folderIds: ['all', 'personal'], lastMessage: { id: 'm1', chatId: 'chat_saved', senderId: 'user_me', senderName: 'Me', text: 'Google AI Pro will support and accelerate your learning journey by providing...', timestamp: '16:51', dateStr: 'Today', isOutgoing: true, isRead: true, isDelivered: true }"
);

content = content.replace(
  /id: 'chat_satashkent_prep',[\s\S]*?folderIds: \['all', 'channels'\],/m,
  "id: 'chat_satashkent_prep', name: 'SATashkent | College Prep Community', type: 'channel', avatar: 'https://ui-avatars.com/api/?name=SA&background=ef4444&color=fff&font-size=0.4', unreadCount: 0, membersCount: 15400, description: 'College Prep Community', folderIds: ['all', 'channels'], lastMessage: { id: 'm1', chatId: 'chat_satashkent_prep', senderId: 'system', senderName: 'SATashkent', text: '📣 Offline, Digital SAT Mock Exam in All Regions in Uzbekistan 🚨 ... Take Free ...', timestamp: '14:28', dateStr: 'Today', isOutgoing: false, isRead: true, isDelivered: true }"
);

content = content.replace(
  /id: 'chat_telegram',[\s\S]*?folderIds: \['all', 'channels'\],/m,
  "id: 'chat_telegram', name: 'Telegram', type: 'channel', avatar: 'https://telegram.org/img/t_logo.png', unreadCount: 0, isVerified: true, membersCount: 84500000, folderIds: ['all', 'channels'], lastMessage: { id: 'm1', chatId: 'chat_telegram', senderId: 'system', senderName: 'Telegram', text: 'Video message', mediaType: 'video', timestamp: 'Thu', dateStr: 'Thu', isOutgoing: false, isRead: true, isDelivered: true }"
);

content = content.replace(
  /id: 'chat_tg_tips',[\s\S]*?folderIds: \['all', 'channels'\],/m,
  "id: 'chat_tg_tips', name: 'Telegram Tips', type: 'channel', avatar: 'https://ui-avatars.com/api/?name=TT&background=000&color=fff&font-size=0.4', unreadCount: 0, isVerified: true, membersCount: 8450000, folderIds: ['all', 'channels'], lastMessage: { id: 'm1', chatId: 'chat_tg_tips', senderId: 'system', senderName: 'Telegram Tips', text: '📱 Telegram Communities. Several groups, channels and bots can be linked ...', timestamp: 'Thu', dateStr: 'Thu', isOutgoing: false, isRead: true, isDelivered: true }"
);

content = content.replace(
  /id: 'chat_izzatulloh',[\s\S]*?folderIds: \['all', 'personal'\],/m,
  "id: 'chat_izzatulloh', name: 'Izzatulloh', type: 'private', avatar: 'https://ui-avatars.com/api/?name=Iz&background=000&color=fff&font-size=0.4', unreadCount: 0, folderIds: ['all', 'personal'], lastMessage: { id: 'm1', chatId: 'chat_izzatulloh', senderId: 'user_me', senderName: 'Me', text: 'C4E4B5', timestamp: 'Tue', dateStr: 'Tue', isOutgoing: true, isRead: true, isDelivered: true }"
);

content = content.replace(
  /id: 'chat_kallmeryan',[\s\S]*?folderIds: \['all', 'personal'\],/m,
  "id: 'chat_kallmeryan', name: 'kallmeryan', type: 'private', avatar: 'https://ui-avatars.com/api/?name=K&background=a855f7&color=fff&font-size=0.4', unreadCount: 0, folderIds: ['all', 'personal'], lastMessage: { id: 'm1', chatId: 'chat_kallmeryan', senderId: 'user_me', senderName: 'Me', text: 'ha', timestamp: '19.07.2026', dateStr: '19.07.2026', isOutgoing: true, isRead: true, isDelivered: true }"
);

content = content.replace(
  /id: 'chat_satashkent_bot',[\s\S]*?folderIds: \['all', 'bots'\],/m,
  "id: 'chat_satashkent_bot', name: 'SATashkent Student Assistant', type: 'bot', avatar: 'https://ui-avatars.com/api/?name=SA&background=ef4444&color=fff&font-size=0.4', unreadCount: 0, folderIds: ['all', 'bots'], lastMessage: { id: 'm1', chatId: 'chat_satashkent_bot', senderId: 'bot', senderName: 'SATashkent Student Assistant', text: 'Your Telegram account is not connected to your student profile ... Open', timestamp: '19.07.2026', dateStr: '19.07.2026', isOutgoing: false, isRead: true, isDelivered: true }"
);

fs.writeFileSync(path, content);
