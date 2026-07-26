const fs = require('fs');
const path = 'src/data/initialData.ts';
let content = fs.readFileSync(path, 'utf8');

const startIdx = content.indexOf('export const initialMessages: Record<string, Message[]> = {');
const endIdx = content.indexOf('export const initialStickerPacks:', startIdx);

const newMessages = `export const initialMessages: Record<string, Message[]> = {
  chat_sleepwalkers: [
    { id: 'm1', chatId: 'chat_sleepwalkers', senderId: 'user_tg_tips', senderName: 'Sayida 🐚 ➡️ SATashkent Student Assistant', text: 'Good evening, everyone. This is an exam invit...\\nEmm which one I should enter first?', timestamp: '22:13', dateStr: 'Today', isOutgoing: false, isRead: true, isDelivered: true, replyToMessageId: 'm0' },
    { id: 'm2', chatId: 'chat_sleepwalkers', senderId: 'user_me', senderName: 'S', text: 'My math and english test kinda at the same time', timestamp: '22:14', dateStr: 'Today', isOutgoing: true, isRead: true, isDelivered: true },
    { id: 'm3', chatId: 'chat_sleepwalkers', senderId: 'user_soliyev', senderName: 'Soliyev Javlon', text: 'енглищ ат 9;30\\n🙏🏼🙏🏼', timestamp: '22:16', dateStr: 'Today', isOutgoing: false, isRead: true, isDelivered: true, replyToSenderName: 'Sayida 🐚' },
    { id: 'm4', chatId: 'chat_sleepwalkers', senderId: 'user_other', senderName: 'Unknown', text: 'анд зериз но маз егзам завтра', timestamp: '22:17', dateStr: 'Today', isOutgoing: false, isRead: true, isDelivered: true },
    { id: 'm5', chatId: 'chat_sleepwalkers', senderId: 'user_sayida', senderName: 'Sayida 🐚', text: 'Thanks\\n⚡️🎊', timestamp: '22:18', dateStr: 'Today', isOutgoing: false, isRead: true, isDelivered: true, replyToSenderName: 'Soliyev Javlon' },
    { id: 'm6', chatId: 'chat_sleepwalkers', senderId: 'user_me', senderName: 'S', text: 'Gosh can\\'t they write it more obvious', timestamp: '22:19', dateStr: 'Today', isOutgoing: true, isRead: true, isDelivered: true, replyToSenderName: 'Soliyev Javlon' },
    { id: 'm7', chatId: 'chat_sleepwalkers', senderId: 'user_kallmeryan', senderName: 'kallmeryan', text: '9.30 am English Room 10', timestamp: '22:21', dateStr: 'Today', isOutgoing: false, isRead: true, isDelivered: true, reactions: [{ emoji: '🐰', count: 5, users: [] }] },
    { id: 'm8', chatId: 'chat_sleepwalkers', senderId: 'system', senderName: '', text: 'kallmeryan pinned "9.30 am English Room 10"', timestamp: '22:22', dateStr: 'Today', isOutgoing: false, isRead: true, isDelivered: true, isPinned: false },
  ],
  chat_hitler: [
    { id: 'm1', chatId: 'chat_hitler', senderId: 'user_deedo', senderName: 'deedo', text: '👍 Sticker', timestamp: '22:11', dateStr: 'Today', isOutgoing: false, isRead: true, isDelivered: true },
  ],
  chat_feruzam: [
    { id: 'm1', chatId: 'chat_feruzam', senderId: 'user_me', senderName: '', text: '', timestamp: '', dateStr: '', isOutgoing: true, isRead: true, isDelivered: true }
  ],
  chat_saved: [
    { id: 'm1', chatId: 'chat_saved', senderId: 'user_me', senderName: 'Me', text: 'Google AI Pro will support and accelerate your learning journey by providing...', timestamp: '16:51', dateStr: 'Today', isOutgoing: true, isRead: true, isDelivered: true },
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
    { id: 'm1', chatId: 'chat_izzatulloh', senderId: 'user_me', senderName: 'Me', text: 'C4E4B5', timestamp: 'Tue', dateStr: 'Tue', isOutgoing: true, isRead: true, isDelivered: true },
  ],
  chat_kallmeryan: [
    { id: 'm1', chatId: 'chat_kallmeryan', senderId: 'user_me', senderName: 'Me', text: 'ha', timestamp: '19.07.2026', dateStr: '19.07.2026', isOutgoing: true, isRead: true, isDelivered: true },
  ],
  chat_satashkent_bot: [
    { id: 'm1', chatId: 'chat_satashkent_bot', senderId: 'bot', senderName: 'SATashkent Student Assistant', text: 'Your Telegram account is not connected to your student profile ... Open', timestamp: '19.07.2026', dateStr: '19.07.2026', isOutgoing: false, isRead: true, isDelivered: true },
  ],
};\n\n`;

content = content.substring(0, startIdx) + newMessages + content.substring(endIdx);
fs.writeFileSync(path, content);
