export type UserStatus = 'online' | 'offline' | 'recently' | 'typing...';

export interface User {
  id: string;
  name: string;
  email?: string;
  username?: string;
  avatar?: string;
  bio?: string;
  phoneNumber?: string;
  isVerified?: boolean;
  isBot?: boolean;
  isPremium?: boolean;
  status?: UserStatus;
  lastSeen?: string;
  profileColor?: string;
  nameColor?: string;
  birthday?: string;
  personalChannel?: string;
  automationEnabled?: boolean;
  emojiStatus?: string;
}

export type ChatType = 'private' | 'group' | 'channel' | 'bot' | 'secret';

export interface Reaction {
  emoji: string;
  count: number;
  users: string[]; // user IDs
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  voters: string[];
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  isAnonymous: boolean;
  allowsMultiple: boolean;
  isQuiz?: boolean;
  correctOptionId?: string;
  explanation?: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
  dateStr: string;
  isOutgoing: boolean;
  isRead: boolean;
  isDelivered: boolean;
  isEdited?: boolean;
  isPinned?: boolean;
  replyToMessageId?: string;
  replyToText?: string;
  replyToSenderName?: string;
  mediaType?: 'image' | 'video' | 'voice' | 'video_note' | 'file' | 'poll' | 'sticker' | 'gif';
  mediaUrl?: string;
  mediaFileName?: string;
  mediaFileSize?: string;
  mediaDuration?: number; // for audio/video in seconds
  reactions?: Reaction[];
  poll?: Poll;
  stickerUrl?: string;
  spoiler?: boolean;
  viewsCount?: number;
  effectEmoji?: string;
}

export interface Chat {
  id: string;
  name: string;
  type: ChatType;
  avatar?: string;
  username?: string;
  unreadCount: number;
  isPinned?: boolean;
  isMuted?: boolean;
  isArchived?: boolean;
  folderIds?: string[];
  lastMessage?: Message;
  membersCount?: number;
  description?: string;
  pinnedMessageIds?: string[];
  isVerified?: boolean;
  secretChatKey?: string;
}

export interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption?: string;
  timestamp: string;
  isUnread?: boolean;
  likesCount?: number;
  viewsCount?: number;
}

export interface ChatFolder {
  id: string;
  name: string;
  icon?: string;
  chatIds?: string[];
  chatTypes?: ChatType[];
}

export interface StickerPack {
  id: string;
  name: string;
  thumbnail: string;
  stickers: { id: string; url: string; emoji: string }[];
}

export type ThemeMode = 'dark' | 'night' | 'light' | 'green';
