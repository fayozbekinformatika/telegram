import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Chat, Message, Story, ChatFolder, ThemeMode, Reaction, Poll } from '../types/telegram';
import { initialChats, initialMessages, initialStories, initialFolders } from '../data/initialData';
import { useAuth } from './AuthContext';
import confetti from 'canvas-confetti';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firebase-errors';

interface TelegramContextType {
  chats: Chat[];
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
  messages: Record<string, Message[]>;
  sendMessage: (chatId: string, text: string, mediaType?: Message['mediaType'], mediaUrl?: string, poll?: Poll, replyToId?: string) => void;
  addReaction: (chatId: string, messageId: string, emoji: string) => void;
  votePoll: (chatId: string, messageId: string, optionId: string) => void;
  deleteMessage: (chatId: string, messageId: string, forEveryone?: boolean) => void;
  pinMessage: (chatId: string, messageId: string) => void;
  markChatAsRead: (chatId: string) => void;
  createNewChat: (name: string, type: Chat['type'], username?: string, description?: string, avatar?: string) => Chat;
  clearHistory: (chatId: string) => void;
  leaveChat: (chatId: string) => void;
  joinChat: (chatId: string) => void;
  toggleMute: (chatId: string) => void;
  folders: ChatFolder[];
  activeFolderId: string;
  setActiveFolderId: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchInChatMode: boolean;
  setSearchInChatMode: (val: boolean) => void;
  stories: Story[];
  addStory: (mediaUrl: string, caption?: string) => void;
  activeStoryIndex: number | null;
  setActiveStoryIndex: (index: number | null) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  chatWallpaper: string;
  setChatWallpaper: (wallpaper: string) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  activeCall: { isVideo: boolean; chatName: string; avatar?: string } | null;
  startCall: (chatName: string, avatar?: string, isVideo?: boolean) => void;
  endCall: () => void;
  rewriteMessageWithAI: (text: string, style: string) => Promise<string>;
  globalUsers: Record<string, User>;
  startChatWithUser: (user: User) => void;
}

const REMOVED_CHAT_IDS = new Set([
  "chat_sleepwalkers",
  "chat_hitler",
  "chat_satashkent_prep",
  "chat_satashkent_bot",
  "chat_feruzam",
  "chat_izzatulloh",
  "chat_kallmeryan"
]);

const TelegramContext = createContext<TelegramContextType | undefined>(undefined);

export const TelegramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  const [chats, setChats] = useState<Chat[]>(() => {
    const saved = localStorage.getItem('tg_chats');
    const rawChats: Chat[] = saved ? JSON.parse(saved) : initialChats;
    const filteredChats = rawChats.filter(c => !REMOVED_CHAT_IDS.has(c.id));
    return filteredChats.map(c => {
      if ((c.type === 'group' || c.type === 'channel') && !c.memberIds) {
        return { ...c, memberIds: [] };
      }
      return c;
    });
  });
  const [activeChatId, setActiveChatIdState] = useState<string | null>('chat_saved');
  
  const setActiveChatId = (id: string | null) => {
    setActiveChatIdState(id);
    if (id) {
      setChats(prev => prev.map(c => c.id === id ? { ...c, unreadCount: 0 } : c));
    }
  };
  const [messages, setMessages] = useState<Record<string, Message[]>>(() => {
    const saved = localStorage.getItem('tg_messages');
    const msgs: Record<string, Message[]> = saved ? JSON.parse(saved) : initialMessages;
    REMOVED_CHAT_IDS.forEach(id => delete msgs[id]);
    return msgs;
  });
  const [stories, setStories] = useState<Story[]>(initialStories);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [folders] = useState<ChatFolder[]>(initialFolders);
  const [activeFolderId, setActiveFolderId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchInChatMode, setSearchInChatMode] = useState<boolean>(false);
  const [theme, setTheme] = useState<ThemeMode>(() => (localStorage.getItem('tg_theme') as ThemeMode) || 'night');
  const [chatWallpaper, setChatWallpaper] = useState<string>(() => localStorage.getItem('tg_wallpaper') || 'classic');
  const [fontSize, setFontSize] = useState<number>(15);
  const [activeCall, setActiveCall] = useState<{ isVideo: boolean; chatName: string; avatar?: string } | null>(null);
  const [globalUsers, setGlobalUsers] = useState<Record<string, User>>({});

  const isInitiated = useRef(false);
  const lastMessagesStr = useRef("");
  const lastChatsStr = useRef("");

  useEffect(() => {
    let unsubMessages = () => {};
    let unsubChats = () => {};
    let unsubUsers = () => {};

    if (user && isFirebaseConfigured() && db) {
      // Save current user to global users collection
      setDoc(doc(db, 'telegram_clone', 'users'), { [user.id]: user }, { merge: true }).catch(err => console.error(err));

      unsubUsers = onSnapshot(doc(db, 'telegram_clone', 'users'), (docSnap) => {
        if (docSnap.exists()) {
          setGlobalUsers(docSnap.data() as Record<string, User>);
        }
      }, (error) => handleFirestoreError(error, OperationType.GET, "telegram_clone/users"));

      let messagesLoaded = false;
      unsubMessages = onSnapshot(doc(db, 'telegram_clone', 'messages'), (docSnap) => {
        if (docSnap.exists()) {
           const data = docSnap.data() as Record<string, Message[]>;
           REMOVED_CHAT_IDS.forEach(id => delete data[id]);
           const str = JSON.stringify(data);
           if (lastMessagesStr.current !== str) {
             lastMessagesStr.current = str;
             setMessages(data);
           }
           messagesLoaded = true;
           isInitiated.current = true;
        }
      }, (error) => handleFirestoreError(error, OperationType.GET, "telegram_clone/messages"));

      unsubChats = onSnapshot(doc(db, 'telegram_clone', 'chats'), (docSnap) => {
        if (docSnap.exists()) {
           const data = docSnap.data().chats as Chat[];
           if (Array.isArray(data)) {
             const normalized = data.filter(c => !REMOVED_CHAT_IDS.has(c.id)).map(c => {
               if (c.type === 'group' || c.type === 'channel') {
                 if (!c.memberIds || !Array.isArray(c.memberIds)) {
                   return { ...c, memberIds: [] };
                 }
               }
               return c;
             });
             const str = JSON.stringify(normalized);
             if (lastChatsStr.current !== str) {
               lastChatsStr.current = str;
               setChats(normalized);
             }
           }
        }
      }, (error) => handleFirestoreError(error, OperationType.GET, "telegram_clone/chats"));

      setTimeout(() => {
        if (!messagesLoaded) isInitiated.current = true;
      }, 2000);
      return () => { unsubMessages(); unsubChats(); unsubUsers(); };
    } else {
      isInitiated.current = true;
      return () => {};
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('tg_chats', JSON.stringify(chats));
    localStorage.setItem('tg_messages', JSON.stringify(messages));
    localStorage.setItem('tg_theme', theme);
    localStorage.setItem('tg_wallpaper', chatWallpaper);
    if (user && isFirebaseConfigured() && db && isInitiated.current) {
      const cleanChats = JSON.parse(JSON.stringify(chats));
      const cleanMessages = JSON.parse(JSON.stringify(messages));
      const cleanUser = JSON.parse(JSON.stringify(user));

      const currentChatsStr = JSON.stringify(cleanChats);
      const currentMessagesStr = JSON.stringify(cleanMessages);

      if (lastChatsStr.current !== currentChatsStr) {
        lastChatsStr.current = currentChatsStr;
        setDoc(doc(db, 'telegram_clone', 'chats'), { chats: cleanChats }).catch(err => console.error(err));
      }
      
      if (lastMessagesStr.current !== currentMessagesStr) {
        lastMessagesStr.current = currentMessagesStr;
        setDoc(doc(db, 'telegram_clone', 'messages'), cleanMessages).catch(err => console.error(err));
      }

      setDoc(doc(db, 'telegram_clone', 'users'), { [user.id]: cleanUser }, { merge: true }).catch(err => console.error(err));
    }
  }, [chats, messages, theme, chatWallpaper, user]);

  const startChatWithUser = (targetUser: User) => {
    const currentUserId = user?.id || 'user_me';
    const chatId = `private_${currentUserId}_${targetUser.id}`;
    
    const existing = chats.find(c => 
      c.id === chatId || 
      c.id === `private_${targetUser.id}_${currentUserId}` ||
      (c.type === 'private' && (
        (c.participantIds && c.participantIds.includes(currentUserId) && c.participantIds.includes(targetUser.id)) ||
        (c.memberIds && c.memberIds.includes(currentUserId) && c.memberIds.includes(targetUser.id)) ||
        (c.username && targetUser.username && c.username.toLowerCase() === targetUser.username.toLowerCase()) ||
        c.id === targetUser.id
      ))
    );
    
    if (existing) {
      setActiveChatId(existing.id);
      setSearchQuery('');
      return;
    }

    const newChat: Chat = {
      id: chatId,
      name: targetUser.name,
      type: 'private',
      avatar: targetUser.avatar,
      username: targetUser.username,
      unreadCount: 0,
      description: targetUser.bio || 'Say hi!',
      participantIds: [currentUserId, targetUser.id],
      memberIds: [currentUserId, targetUser.id],
      folderIds: ['all', 'personal']
    };

    setChats(prev => [newChat, ...prev]);
    setMessages(prev => ({ ...prev, [chatId]: prev[chatId] || [] }));
    setActiveChatId(chatId);
    setSearchQuery('');
  };

  const sendMessage = (chatId: string, text: string, mediaType?: Message['mediaType'], mediaUrl?: string, poll?: Poll, replyToId?: string) => {
    const currentUserId = user?.id || 'user_me';
    let targetChat = chats.find(c => c.id === chatId);

    if (!targetChat) {
      let targetUser = globalUsers[chatId];
      if (!targetUser) {
        targetUser = Object.values(globalUsers).find(u => chatId.includes(u.id));
      }
      const chatName = targetUser ? targetUser.name : 'User';
      const avatar = targetUser ? targetUser.avatar : `https://api.dicebear.com/7.x/identicon/svg?seed=${chatId}`;
      const username = targetUser ? targetUser.username : undefined;

      targetChat = {
        id: chatId,
        name: chatName,
        type: 'private',
        avatar,
        username,
        unreadCount: 0,
        participantIds: [currentUserId, chatId],
        memberIds: [currentUserId, chatId],
        folderIds: ['all', 'personal']
      };
    }

    if (targetChat && targetChat.type === 'channel') {
      const myIds = [currentUserId, 'user_me'];
      const isOwnerOrAdmin = Boolean(
        (targetChat.creatorId && myIds.includes(targetChat.creatorId)) ||
        (targetChat.adminIds && myIds.some(id => targetChat.adminIds?.includes(id)))
      );
      if (!isOwnerOrAdmin) {
        return; // Only channel creator can post
      }
    }

    const newMsg: Message = {
      id: `m_${Date.now()}`,
      chatId,
      senderId: currentUserId,
      senderName: user?.name || 'You',
      senderAvatar: user?.avatar,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dateStr: 'Today',
      isOutgoing: true,
      isRead: false,
      isDelivered: true,
      mediaType,
      mediaUrl,
      poll,
      replyToMessageId: replyToId
    };

    setMessages(prev => ({ ...prev, [chatId]: [...(prev[chatId] || []), newMsg] }));

    setChats(prev => {
      const exists = prev.some(c => c.id === chatId);
      if (!exists && targetChat) {
        return [{ ...targetChat, lastMessage: newMsg }, ...prev];
      }
      const updated = prev.map(c => c.id === chatId ? { ...c, lastMessage: newMsg } : c);
      const chatIndex = updated.findIndex(c => c.id === chatId);
      if (chatIndex > 0) {
        const [moved] = updated.splice(chatIndex, 1);
        return [moved, ...updated];
      }
      return updated;
    });
  };

  const addReaction = (chatId: string, messageId: string, emoji: string) => {
    if (['🔥', '🎉', '❤️', '🤩', '🚀'].includes(emoji)) {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
    }
    setMessages(prev => {
      const chatMsgs = prev[chatId] || [];
      return {
        ...prev,
        [chatId]: chatMsgs.map(m => {
          if (m.id === messageId) {
            const userId = user?.id || 'me';
            let newReactions = [...(m.reactions || [])];
            
            const existingReactionIndex = newReactions.findIndex(r => r.emoji === emoji);

            if (existingReactionIndex !== -1 && newReactions[existingReactionIndex].users?.includes(userId)) {
              newReactions[existingReactionIndex] = {
                ...newReactions[existingReactionIndex],
                count: newReactions[existingReactionIndex].count - 1,
                users: newReactions[existingReactionIndex].users.filter(id => id !== userId)
              };
              if (newReactions[existingReactionIndex].count <= 0) {
                newReactions.splice(existingReactionIndex, 1);
              }
            } else {
              if (existingReactionIndex !== -1) {
                newReactions[existingReactionIndex] = {
                  ...newReactions[existingReactionIndex],
                  count: newReactions[existingReactionIndex].count + 1,
                  users: [...(newReactions[existingReactionIndex].users || []), userId]
                };
              } else {
                newReactions.push({ emoji, count: 1, users: [userId] });
              }
            }
            return { ...m, reactions: newReactions };
          }
          return m;
        })
      };
    });
  };

  const votePoll = (chatId: string, messageId: string, optionId: string) => {
    setMessages(prev => {
      const chatMsgs = prev[chatId] || [];
      return {
        ...prev,
        [chatId]: chatMsgs.map(m => {
          if (m.id === messageId && m.poll) {
            const alreadyVoted = m.poll.options.some(o => o.voters?.includes(user?.id || 'me'));
            if (alreadyVoted && !m.poll.multipleAnswers) return m;
            return {
              ...m,
              poll: {
                ...m.poll,
                totalVoters: (m.poll.totalVoters || 0) + 1,
                options: m.poll.options.map(o => o.id === optionId ? { ...o, votes: o.votes + 1, voters: [...(o.voters || []), user?.id || 'me'] } : o)
              }
            };
          }
          return m;
        })
      };
    });
  };

  const deleteMessage = (chatId: string, messageId: string, forEveryone?: boolean) => {
    const currentUserId = user?.id || 'user_me';
    const myIds = [currentUserId, 'user_me'];
    setMessages(prev => {
      const chatMsgs = prev[chatId] || [];
      const msgToDelete = chatMsgs.find(m => m.id === messageId);
      if (msgToDelete && !myIds.includes(msgToDelete.senderId)) {
        return prev; // Disallow deleting messages from other users
      }
      return { ...prev, [chatId]: chatMsgs.filter(m => m.id !== messageId) };
    });
  };

  const pinMessage = (chatId: string, messageId: string) => {
    setMessages(prev => ({ ...prev, [chatId]: (prev[chatId] || []).map(m => m.id === messageId ? { ...m, isPinned: !m.isPinned } : m) }));
  };

  const markChatAsRead = (chatId: string) => {
    setMessages(prev => {
      const chatMsgs = prev[chatId];
      if (!chatMsgs) return prev;
      
      let hasChanges = false;
      const updatedMsgs = chatMsgs.map(m => {
        if (!m.isRead && m.senderId !== user?.id) {
          hasChanges = true;
          return { ...m, isRead: true };
        }
        return m;
      });

      if (!hasChanges) return prev;
      return { ...prev, [chatId]: updatedMsgs };
    });
    setChats(prev => {
      const chat = prev.find(c => c.id === chatId);
      if (chat && chat.unreadCount === 0) return prev;
      return prev.map(c => c.id === chatId ? { ...c, unreadCount: 0 } : c);
    });
  };

  const clearHistory = (chatId: string) => {
    setMessages(prev => ({ ...prev, [chatId]: [] }));
  };

  const toggleMute = (chatId: string) => {
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, isMuted: !c.isMuted } : c));
  };

  const joinChat = (chatId: string) => {
    const primaryUserId = user?.id || 'user_me';
    const myIds = [user?.id, 'user_me'].filter(Boolean) as string[];

    let targetType: Chat['type'] = 'group';

    setChats(prev => prev.map(c => {
      const isMatch = c.id === chatId || (c.username && c.username.toLowerCase() === chatId.toLowerCase());
      if (isMatch) {
        targetType = c.type;
        const currentMembers = c.memberIds || [];
        const wasMember = myIds.some(id => currentMembers.includes(id));
        const cleanMembers = currentMembers.filter(id => !myIds.includes(id));
        cleanMembers.push(primaryUserId);
        const newCount = wasMember ? (c.membersCount || cleanMembers.length) : ((c.membersCount || currentMembers.length) + 1);
        return {
          ...c,
          memberIds: cleanMembers,
          membersCount: newCount,
        };
      }
      return c;
    }));

    const now = new Date();
    const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const joinSystemMsg: Message = {
      id: `m_join_${Date.now()}`,
      chatId,
      senderId: 'system',
      senderName: '',
      text: targetType === 'channel' ? 'You subscribed to this channel' : 'You joined the group',
      timestamp,
      dateStr: 'Today',
      isOutgoing: false,
      isRead: true,
      isDelivered: true,
    };

    setMessages(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), joinSystemMsg],
    }));

    setActiveChatIdState(chatId);
  };

  const leaveChat = (chatId: string) => {
    const currentUserId = user?.id;
    const myIds = [currentUserId, 'user_me'].filter(Boolean) as string[];

    let targetType: Chat['type'] = 'group';

    setChats(prev => prev.map(c => {
      const isMatch = c.id === chatId || (c.username && c.username.toLowerCase() === chatId.toLowerCase());
      if (isMatch && (c.type === 'group' || c.type === 'channel')) {
        targetType = c.type;
        const currentMembers = c.memberIds || [];
        const newMembers = currentMembers.filter(id => !myIds.includes(id));
        return {
          ...c,
          memberIds: newMembers,
          membersCount: Math.max(0, (c.membersCount || 1) - 1),
        };
      }
      return c;
    }));

    const now = new Date();
    const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const leaveSystemMsg: Message = {
      id: `m_leave_${Date.now()}`,
      chatId,
      senderId: 'system',
      senderName: '',
      text: targetType === 'channel' ? 'You unsubscribed from this channel' : 'You left the group',
      timestamp,
      dateStr: 'Today',
      isOutgoing: false,
      isRead: true,
      isDelivered: true,
    };

    setMessages(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), leaveSystemMsg],
    }));
  };

  const createNewChat = (name: string, type: Chat['type'], username?: string, description?: string, avatar?: string): Chat => {
    const creatorId = user?.id || 'user_me';
    const newChat: Chat = {
      id: `chat_${Date.now()}`, name, type,
      avatar: avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${name}`,
      username: username || name.toLowerCase().replace(/\s+/g, '_'),
      unreadCount: 0, membersCount: type === 'group' || type === 'channel' ? 1 : undefined,
      memberIds: type === 'group' || type === 'channel' ? [creatorId] : undefined,
      creatorId,
      adminIds: [creatorId],
      description, folderIds: ['all']
    };
    setChats(prev => [newChat, ...prev]);
    setMessages(prev => ({ ...prev, [newChat.id]: [] }));
    setActiveChatId(newChat.id);
    return newChat;
  };

  const addStory = (mediaUrl: string, caption?: string) => {
    setStories(prev => [{
      id: `story_${Date.now()}`, userId: user?.id || 'user_me', userName: user?.name || 'You',
      userAvatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      mediaUrl, mediaType: 'image', caption, timestamp: 'Just now', isUnread: false, likesCount: 0, viewsCount: 1
    }, ...prev]);
  };

  const startCall = (chatName: string, avatar?: string, isVideo?: boolean) => {
    setActiveCall({ chatName, avatar, isVideo: !!isVideo });
  };
  const endCall = () => setActiveCall(null);

  const rewriteMessageWithAI = async (text: string, style: string): Promise<string> => {
    try {
      const res = await fetch('/api/ai/rewrite', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, style })
      });
      const data = await res.json();
      return data.rewrittenText || text;
    } catch (err) {
      console.error(err);
      return text;
    }
  };

  return (
    <TelegramContext.Provider value={{
      chats, activeChatId, setActiveChatId, messages, sendMessage, addReaction, votePoll, deleteMessage, pinMessage, markChatAsRead, createNewChat, clearHistory, leaveChat, joinChat, toggleMute,
      folders, activeFolderId, setActiveFolderId, searchQuery, setSearchQuery, searchInChatMode, setSearchInChatMode,
      stories, addStory, activeStoryIndex, setActiveStoryIndex, theme, setTheme, chatWallpaper, setChatWallpaper, fontSize, setFontSize,
      activeCall, startCall, endCall, rewriteMessageWithAI, globalUsers, startChatWithUser
    }}>
      {children}
    </TelegramContext.Provider>
  );
};

export const useTelegram = () => {
  const ctx = useContext(TelegramContext);
  if (!ctx) throw new Error('Missing TelegramProvider');
  return ctx;
};
