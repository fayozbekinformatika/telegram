import { Chat, Message, Story, ChatFolder, StickerPack, User } from '../types/telegram';

export const currentUserDefault: User = {
  id: 'user_me',
  name: 'Fayozchek Yusubhonov',
  email: 'fayozchekyusubhonov@gmail.com',
  username: 'fayozchek',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  bio: 'Building future technology with AI Studio & Telegram Web 🚀',
  
  isVerified: true,
  isPremium: true,
  status: 'online',
  profileColor: 'from-blue-600 to-indigo-600',
  emojiStatus: '⚡',
};

export const initialFolders: ChatFolder[] = [
  { id: 'all', name: 'All Chats', icon: '💬' },
  { id: 'personal', name: 'Personal', icon: '👤', chatTypes: ['private', 'secret'] },
  { id: 'work', name: 'Work', icon: '💼', chatTypes: ['group'] },
  { id: 'channels', name: 'Channels', icon: '📢', chatTypes: ['channel'] },
  { id: 'bots', name: 'Bots & AI', icon: '🤖', chatTypes: ['bot'] },
  { id: 'unread', name: 'Unread', icon: '🔔' },
];

export const initialStories: Story[] = [
  {
    id: 'story_1',
    userId: 'user_tg_news',
    userName: 'Telegram News',
    userAvatar: 'https://telegram.org/img/t_logo.png',
    mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image',
    caption: '🎉 Telegram Web 2026 Update is here with AI, Encrypted Calls & Custom Themes!',
    timestamp: '10 mins ago',
    isUnread: true,
    likesCount: 1420,
    viewsCount: 18900,
  },
  {
    id: 'story_2',
    userId: 'user_ai_bot',
    userName: 'Gemini AI Bot',
    userAvatar: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=300&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image',
    caption: '✨ Try the new AI Text Rewrite and Live Translation directly in Telegram chat!',
    timestamp: '1 hour ago',
    isUnread: true,
    likesCount: 890,
    viewsCount: 9400,
  },
  {
    id: 'story_3',
    userId: 'user_durov',
    userName: 'Pavel Durov',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image',
    caption: 'Focus on privacy, freedom, and ultra-fast speed. Thank you 1 Billion users! 🌍',
    timestamp: '3 hours ago',
    isUnread: false,
    likesCount: 45200,
    viewsCount: 320000,
  },
];

export const initialChats: Chat[] = [
  {
    id: 'chat_sleepwalkers', name: 'The Sleepwalkers | SAT English', type: 'group', avatar: 'https://ui-avatars.com/api/?name=TE&background=0284c7&color=fff&font-size=0.4', unreadCount: 0, membersCount: 35, description: 'CRM group: Odd 09:00 SAT English\nDescription', folderIds: ['all', 'work'], lastMessage: { id: 'm8', chatId: 'chat_sleepwalkers', senderId: 'system', senderName: '', text: 'kallmeryan pinned "9.30 am English Room 10"', timestamp: '22:22', dateStr: 'Today', isOutgoing: false, isRead: true, isDelivered: true }
  },
  {
    id: 'chat_hitler', name: 'Hitler Adminstration | even days 9am SAT Math', type: 'group', avatar: 'https://ui-avatars.com/api/?name=HM&background=ec4899&color=fff&font-size=0.4', unreadCount: 0, membersCount: 42, description: 'SAT Math prep group', folderIds: ['all', 'work'], lastMessage: { id: 'm1', chatId: 'chat_hitler', senderId: 'user_deedo', senderName: 'deedo', text: '👍 Sticker', timestamp: '22:11', dateStr: 'Today', isOutgoing: false, isRead: true, isDelivered: true }
  },
  {
    id: 'chat_feruzam', name: 'FERUZAM 😍', type: 'private', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', unreadCount: 0, folderIds: ['all', 'personal']
  },
  {
    id: 'chat_saved', name: 'Saved Messages', type: 'private', avatar: 'https://ui-avatars.com/api/?name=SM&background=3b82f6&color=fff&font-size=0.4', unreadCount: 0, isPinned: true, description: 'Your cloud storage for notes, links, and forwarded messages.', folderIds: ['all', 'personal'], lastMessage: { id: 'm1', chatId: 'chat_saved', senderId: 'user_me', senderName: 'Me', text: 'Google AI Pro will support and accelerate your learning journey by providing...', timestamp: '16:51', dateStr: 'Today', isOutgoing: true, isRead: false, isDelivered: true }
  },
  {
    id: 'chat_satashkent_prep', name: 'SATashkent | College Prep Community', type: 'channel', avatar: 'https://ui-avatars.com/api/?name=SA&background=ef4444&color=fff&font-size=0.4', unreadCount: 0, membersCount: 15400, description: 'College Prep Community', folderIds: ['all', 'channels'], lastMessage: { id: 'm1', chatId: 'chat_satashkent_prep', senderId: 'system', senderName: 'SATashkent', text: '📣 Offline, Digital SAT Mock Exam in All Regions in Uzbekistan 🚨 ... Take Free ...', timestamp: '14:28', dateStr: 'Today', isOutgoing: false, isRead: true, isDelivered: true }
  },
  {
    id: 'chat_telegram', name: 'Telegram', type: 'channel', avatar: 'https://telegram.org/img/t_logo.png', unreadCount: 0, isVerified: true, membersCount: 84500000, folderIds: ['all', 'channels'], lastMessage: { id: 'm1', chatId: 'chat_telegram', senderId: 'system', senderName: 'Telegram', text: 'Video message', mediaType: 'video', timestamp: 'Thu', dateStr: 'Thu', isOutgoing: false, isRead: true, isDelivered: true }
  },
  {
    id: 'chat_tg_tips', name: 'Telegram Tips', type: 'channel', avatar: 'https://ui-avatars.com/api/?name=TT&background=000&color=fff&font-size=0.4', unreadCount: 0, isVerified: true, membersCount: 8450000, folderIds: ['all', 'channels'], lastMessage: { id: 'm1', chatId: 'chat_tg_tips', senderId: 'system', senderName: 'Telegram Tips', text: '📱 Telegram Communities. Several groups, channels and bots can be linked ...', timestamp: 'Thu', dateStr: 'Thu', isOutgoing: false, isRead: true, isDelivered: true }
  },
  {
    id: 'chat_izzatulloh', name: 'Izzatulloh', type: 'private', avatar: 'https://ui-avatars.com/api/?name=Iz&background=000&color=fff&font-size=0.4', unreadCount: 0, folderIds: ['all', 'personal'], lastMessage: { id: 'm1', chatId: 'chat_izzatulloh', senderId: 'user_me', senderName: 'Me', text: 'C4E4B5', timestamp: 'Tue', dateStr: 'Tue', isOutgoing: true, isRead: false, isDelivered: true }
  },
  {
    id: 'chat_kallmeryan', name: 'kallmeryan', type: 'private', avatar: 'https://ui-avatars.com/api/?name=K&background=a855f7&color=fff&font-size=0.4', unreadCount: 0, folderIds: ['all', 'personal'], lastMessage: { id: 'm1', chatId: 'chat_kallmeryan', senderId: 'user_me', senderName: 'Me', text: 'ha', timestamp: '19.07.2026', dateStr: '19.07.2026', isOutgoing: true, isRead: false, isDelivered: true }
  },
  {
    id: 'chat_satashkent_bot', name: 'SATashkent Student Assistant', type: 'bot', avatar: 'https://ui-avatars.com/api/?name=SA&background=ef4444&color=fff&font-size=0.4', unreadCount: 0, folderIds: ['all', 'bots'], lastMessage: { id: 'm1', chatId: 'chat_satashkent_bot', senderId: 'bot', senderName: 'SATashkent Student Assistant', text: 'Your Telegram account is not connected to your student profile ... Open', timestamp: '19.07.2026', dateStr: '19.07.2026', isOutgoing: false, isRead: true, isDelivered: true }
  },
];

export const initialMessages: Record<string, Message[]> = {
  chat_sleepwalkers: [
    { id: 'm1', chatId: 'chat_sleepwalkers', senderId: 'user_tg_tips', senderName: 'Sayida 🐚 ➡️ SATashkent Student Assistant', text: 'Good evening, everyone. This is an exam invit...\nEmm which one I should enter first?', timestamp: '22:13', dateStr: 'Today', isOutgoing: false, isRead: true, isDelivered: true, replyToMessageId: 'm0' },
    { id: 'm2', chatId: 'chat_sleepwalkers', senderId: 'user_me', senderName: 'S', text: 'My math and english test kinda at the same time', timestamp: '22:14', dateStr: 'Today', isOutgoing: true, isRead: false, isDelivered: true },
    { id: 'm3', chatId: 'chat_sleepwalkers', senderId: 'user_soliyev', senderName: 'Soliyev Javlon', text: 'енглищ ат 9;30\n🙏🏼🙏🏼', timestamp: '22:16', dateStr: 'Today', isOutgoing: false, isRead: true, isDelivered: true, replyToSenderName: 'Sayida 🐚' },
    { id: 'm4', chatId: 'chat_sleepwalkers', senderId: 'user_other', senderName: 'Unknown', text: 'анд зериз но маз егзам завтра', timestamp: '22:17', dateStr: 'Today', isOutgoing: false, isRead: true, isDelivered: true },
    { id: 'm5', chatId: 'chat_sleepwalkers', senderId: 'user_sayida', senderName: 'Sayida 🐚', text: 'Thanks\n⚡️🎊', timestamp: '22:18', dateStr: 'Today', isOutgoing: false, isRead: true, isDelivered: true, replyToSenderName: 'Soliyev Javlon' },
    { id: 'm6', chatId: 'chat_sleepwalkers', senderId: 'user_me', senderName: 'S', text: 'Gosh can\'t they write it more obvious', timestamp: '22:19', dateStr: 'Today', isOutgoing: true, isRead: false, isDelivered: true, replyToSenderName: 'Soliyev Javlon' },
    { id: 'm7', chatId: 'chat_sleepwalkers', senderId: 'user_kallmeryan', senderName: 'kallmeryan', text: '9.30 am English Room 10', timestamp: '22:21', dateStr: 'Today', isOutgoing: false, isRead: true, isDelivered: true, reactions: [{ emoji: '🐰', count: 5, users: [] }] },
    { id: 'm8', chatId: 'chat_sleepwalkers', senderId: 'system', senderName: '', text: 'kallmeryan pinned "9.30 am English Room 10"', timestamp: '22:22', dateStr: 'Today', isOutgoing: false, isRead: true, isDelivered: true, isPinned: false },
  ],
  chat_hitler: [
    { id: 'm1', chatId: 'chat_hitler', senderId: 'user_deedo', senderName: 'deedo', text: '👍 Sticker', timestamp: '22:11', dateStr: 'Today', isOutgoing: false, isRead: true, isDelivered: true },
  ],
  chat_feruzam: [
    { id: 'm1', chatId: 'chat_feruzam', senderId: 'user_me', senderName: '', text: '', timestamp: '', dateStr: '', isOutgoing: true, isRead: false, isDelivered: true }
  ],
  chat_saved: [
    { id: 'm1', chatId: 'chat_saved', senderId: 'user_me', senderName: 'Me', text: 'Google AI Pro will support and accelerate your learning journey by providing...', timestamp: '16:51', dateStr: 'Today', isOutgoing: true, isRead: false, isDelivered: true },
  ],
  chat_satashkent_prep: [
    { id: 'm1', chatId: 'chat_satashkent_prep', senderId: 'system', senderName: 'SATashkent', text: '📣 Offline, Digital SAT Mock Exam in All Regions in Uzbekistan 🚨 ... Take Free ...', timestamp: '14:28', dateStr: 'Today', isOutgoing: false, isRead: true, isDelivered: true },
  ],
  chat_telegram: [
    { id: 'm1', chatId: 'chat_telegram', senderId: 'system', senderName: 'Telegram', text: 'Video message', mediaType: 'video', timestamp: 'Thu', dateStr: 'Thu', isOutgoing: false, isRead: true, isDelivered: true },
  ],
  chat_tg_tips: [
    { id: 'm1', chatId: 'chat_tg_tips', senderId: 'system', senderName: 'Telegram Tips', text: '📱 Telegram Communities. Several groups, channels and bots can be linked ...', timestamp: 'Thu', dateStr: 'Thu', isOutgoing: false, isRead: true, isDelivered: true },
  ],
  chat_izzatulloh: [
    { id: 'm1', chatId: 'chat_izzatulloh', senderId: 'user_me', senderName: 'Me', text: 'C4E4B5', timestamp: 'Tue', dateStr: 'Tue', isOutgoing: true, isRead: false, isDelivered: true },
  ],
  chat_kallmeryan: [
    { id: 'm1', chatId: 'chat_kallmeryan', senderId: 'user_me', senderName: 'Me', text: 'ha', timestamp: '19.07.2026', dateStr: '19.07.2026', isOutgoing: true, isRead: false, isDelivered: true },
  ],
  chat_satashkent_bot: [
    { id: 'm1', chatId: 'chat_satashkent_bot', senderId: 'bot', senderName: 'SATashkent Student Assistant', text: 'Your Telegram account is not connected to your student profile ... Open', timestamp: '19.07.2026', dateStr: '19.07.2026', isOutgoing: false, isRead: true, isDelivered: true },
  ],
};

