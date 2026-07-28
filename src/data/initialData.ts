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
    id: 'chat_saved', name: 'Saved Messages', type: 'private', avatar: 'https://ui-avatars.com/api/?name=SM&background=3b82f6&color=fff&font-size=0.4', unreadCount: 0, isPinned: true, description: 'Your cloud storage for notes, links, and forwarded messages.', folderIds: ['all', 'personal'], lastMessage: { id: 'm1', chatId: 'chat_saved', senderId: 'user_me', senderName: 'Me', text: 'Welcome to your Saved Messages cloud storage!', timestamp: '12:00', dateStr: 'Today', isOutgoing: true, isRead: false, isDelivered: true }
  },
  {
    id: 'chat_telegram', name: 'Telegram', type: 'channel', avatar: 'https://telegram.org/img/t_logo.png', unreadCount: 0, isVerified: true, membersCount: 84500000, memberIds: [], folderIds: ['all', 'channels'], lastMessage: { id: 'm1', chatId: 'chat_telegram', senderId: 'system', senderName: 'Telegram', text: 'Welcome to Telegram Web!', timestamp: '10:00', dateStr: 'Today', isOutgoing: false, isRead: true, isDelivered: true }
  },
  {
    id: 'chat_tg_tips', name: 'Telegram Tips', type: 'channel', avatar: 'https://ui-avatars.com/api/?name=TT&background=000&color=fff&font-size=0.4', unreadCount: 0, isVerified: true, membersCount: 8450000, memberIds: [], folderIds: ['all', 'channels'], lastMessage: { id: 'm1', chatId: 'chat_tg_tips', senderId: 'system', senderName: 'Telegram Tips', text: '📱 Telegram Tips & Features guide.', timestamp: '10:05', dateStr: 'Today', isOutgoing: false, isRead: true, isDelivered: true }
  }
];

export const initialMessages: Record<string, Message[]> = {
  chat_saved: [
    { id: 'm1', chatId: 'chat_saved', senderId: 'user_me', senderName: 'Me', text: 'Welcome to your Saved Messages cloud storage!', timestamp: '12:00', dateStr: 'Today', isOutgoing: true, isRead: false, isDelivered: true },
  ],
  chat_telegram: [
    { id: 'm1', chatId: 'chat_telegram', senderId: 'system', senderName: 'Telegram', text: 'Welcome to Telegram Web!', timestamp: '10:00', dateStr: 'Today', isOutgoing: false, isRead: true, isDelivered: true },
  ],
  chat_tg_tips: [
    { id: 'm1', chatId: 'chat_tg_tips', senderId: 'system', senderName: 'Telegram Tips', text: '📱 Telegram Tips & Features guide.', timestamp: '10:05', dateStr: 'Today', isOutgoing: false, isRead: true, isDelivered: true },
  ],
};

