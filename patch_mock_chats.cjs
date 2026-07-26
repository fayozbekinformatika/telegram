const fs = require('fs');
const path = 'src/data/initialData.ts';
let content = fs.readFileSync(path, 'utf8');

// I will completely replace initialChats array.
const startIdx = content.indexOf('export const initialChats: Chat[] = [');
const endIdx = content.indexOf('export const initialMessages:', startIdx);

const newChats = `export const initialChats: Chat[] = [
  {
    id: 'chat_sleepwalkers',
    name: 'The Sleepwalkers | SAT English',
    type: 'group',
    avatar: 'https://ui-avatars.com/api/?name=TE&background=0284c7&color=fff&font-size=0.4',
    unreadCount: 0,
    membersCount: 35,
    description: 'CRM group: Odd 09:00 SAT English\\nDescription',
    folderIds: ['all', 'work'],
  },
  {
    id: 'chat_hitler',
    name: 'Hitler Adminstration | even days 9am SAT Math',
    type: 'group',
    avatar: 'https://ui-avatars.com/api/?name=HM&background=ec4899&color=fff&font-size=0.4',
    unreadCount: 0,
    membersCount: 42,
    description: 'SAT Math prep group',
    folderIds: ['all', 'work'],
  },
  {
    id: 'chat_feruzam',
    name: 'FERUZAM 😍',
    type: 'private',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    unreadCount: 0,
    folderIds: ['all', 'personal'],
  },
  {
    id: 'chat_saved',
    name: 'Saved Messages',
    type: 'private',
    avatar: 'https://ui-avatars.com/api/?name=SM&background=3b82f6&color=fff&font-size=0.4',
    unreadCount: 0,
    isPinned: true,
    description: 'Your cloud storage for notes, links, and forwarded messages.',
    folderIds: ['all', 'personal'],
  },
  {
    id: 'chat_satashkent_prep',
    name: 'SATashkent | College Prep Community',
    type: 'channel',
    avatar: 'https://ui-avatars.com/api/?name=SA&background=ef4444&color=fff&font-size=0.4',
    unreadCount: 0,
    membersCount: 15400,
    description: 'College Prep Community',
    folderIds: ['all', 'channels'],
  },
  {
    id: 'chat_telegram',
    name: 'Telegram',
    type: 'channel',
    avatar: 'https://telegram.org/img/t_logo.png',
    unreadCount: 0,
    isVerified: true,
    membersCount: 84500000,
    folderIds: ['all', 'channels'],
  },
  {
    id: 'chat_tg_tips',
    name: 'Telegram Tips',
    type: 'channel',
    avatar: 'https://ui-avatars.com/api/?name=TT&background=000&color=fff&font-size=0.4',
    unreadCount: 0,
    isVerified: true,
    membersCount: 8450000,
    folderIds: ['all', 'channels'],
  },
  {
    id: 'chat_izzatulloh',
    name: 'Izzatulloh',
    type: 'private',
    avatar: 'https://ui-avatars.com/api/?name=Iz&background=000&color=fff&font-size=0.4',
    unreadCount: 0,
    folderIds: ['all', 'personal'],
  },
  {
    id: 'chat_kallmeryan',
    name: 'kallmeryan',
    type: 'private',
    avatar: 'https://ui-avatars.com/api/?name=K&background=a855f7&color=fff&font-size=0.4',
    unreadCount: 0,
    folderIds: ['all', 'personal'],
  },
  {
    id: 'chat_satashkent_bot',
    name: 'SATashkent Student Assistant',
    type: 'bot',
    avatar: 'https://ui-avatars.com/api/?name=SA&background=ef4444&color=fff&font-size=0.4',
    unreadCount: 0,
    folderIds: ['all', 'bots'],
  },
];\n\n`;

content = content.substring(0, startIdx) + newChats + content.substring(endIdx);
fs.writeFileSync(path, content);
