import React, { createContext, useContext, useState, useEffect } from 'react';
import { Chat, Message, Story, ChatFolder, ThemeMode, Reaction, Poll } from '../types/telegram';
import { initialChats, initialMessages, initialStories, initialFolders } from '../data/initialData';
import { useAuth } from './AuthContext';
import confetti from 'canvas-confetti';

interface TelegramContextType {
  chats: Chat[];
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
  messages: Record<string, Message[]>;
  sendMessage: (
    chatId: string,
    text: string,
    mediaType?: Message['mediaType'],
    mediaUrl?: string,
    poll?: Poll,
    replyToId?: string
  ) => void;
  addReaction: (chatId: string, messageId: string, emoji: string) => void;
  votePoll: (chatId: string, messageId: string, optionId: string) => void;
  deleteMessage: (chatId: string, messageId: string, forEveryone?: boolean) => void;
  pinMessage: (chatId: string, messageId: string) => void;
  createNewChat: (name: string, type: Chat['type'], username?: string, description?: string) => Chat;
  
  // Folders & Search
  folders: ChatFolder[];
  activeFolderId: string;
  setActiveFolderId: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Stories
  stories: Story[];
  addStory: (mediaUrl: string, caption?: string) => void;
  activeStoryIndex: number | null;
  setActiveStoryIndex: (index: number | null) => void;

  // Themes
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  chatWallpaper: string;
  setChatWallpaper: (wallpaper: string) => void;
  fontSize: number;
  setFontSize: (size: number) => void;

  // Active Call Mode
  activeCall: { isVideo: boolean; chatName: string; avatar?: string } | null;
  startCall: (chatName: string, avatar?: string, isVideo?: boolean) => void;
  endCall: () => void;

  // AI Assistant Rewrite Trigger
  rewriteMessageWithAI: (text: string, style: string) => Promise<string>;
}

const TelegramContext = createContext<TelegramContextType | undefined>(undefined);

export const TelegramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  const [chats, setChats] = useState<Chat[]>(() => {
    const saved = localStorage.getItem('tg_chats');
    return saved ? JSON.parse(saved) : initialChats;
  });

  const [activeChatId, setActiveChatId] = useState<string | null>('chat_ai_bot');
  const [messages, setMessages] = useState<Record<string, Message[]>>(() => {
    const saved = localStorage.getItem('tg_messages');
    return saved ? JSON.parse(saved) : initialMessages;
  });

  const [stories, setStories] = useState<Story[]>(initialStories);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);

  const [folders] = useState<ChatFolder[]>(initialFolders);
  const [activeFolderId, setActiveFolderId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('tg_theme') as ThemeMode) || 'light';
  });

  const [chatWallpaper, setChatWallpaper] = useState<string>(() => {
    return localStorage.getItem('tg_wallpaper') || 'classic';
  });

  const [fontSize, setFontSize] = useState<number>(15);
  const [activeCall, setActiveCall] = useState<{ isVideo: boolean; chatName: string; avatar?: string } | null>(null);

  // Sync storage
  useEffect(() => {
    localStorage.setItem('tg_chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem('tg_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('tg_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('tg_wallpaper', chatWallpaper);
  }, [chatWallpaper]);

  const startCall = (chatName: string, avatar?: string, isVideo: boolean = false) => {
    setActiveCall({ chatName, avatar, isVideo });
  };

  const endCall = () => {
    setActiveCall(null);
  };

  const sendMessage = async (
    chatId: string,
    text: string,
    mediaType?: Message['mediaType'],
    mediaUrl?: string,
    poll?: Poll,
    replyToId?: string
  ) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let replyText = '';
    let replySender = '';
    if (replyToId && messages[chatId]) {
      const parentMsg = messages[chatId].find((m) => m.id === replyToId);
      if (parentMsg) {
        replyText = parentMsg.text.substring(0, 50);
        replySender = parentMsg.senderName;
      }
    }

    const newMsg: Message = {
      id: `m_${Date.now()}`,
      chatId,
      senderId: user?.id || 'user_me',
      senderName: user?.name || 'You',
      senderAvatar: user?.avatar,
      text,
      timestamp: timeStr,
      dateStr: 'Today',
      isOutgoing: true,
      isRead: false,
      isDelivered: true,
      mediaType,
      mediaUrl,
      poll,
      replyToMessageId: replyToId,
      replyToText: replyText,
      replyToSenderName: replySender,
    };

    setMessages((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMsg],
    }));

    // Update chat last message
    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId
          ? {
              ...c,
              lastMessage: newMsg,
              unreadCount: 0,
            }
          : c
      )
    );

    // Update message read status after short delay (Telegram 2 ticks / galochka simulation)
    setTimeout(() => {
      setMessages((prev) => {
        const chatMsgs = prev[chatId];
        if (!chatMsgs) return prev;
        return {
          ...prev,
          [chatId]: chatMsgs.map((m) => (m.id === newMsg.id ? { ...m, isRead: true } : m)),
        };
      });
      setChats((prev) =>
        prev.map((c) =>
          c.id === chatId && c.lastMessage?.id === newMsg.id
            ? { ...c, lastMessage: { ...c.lastMessage, isRead: true } }
            : c
        )
      );
    }, 1200);

    // AI Bot auto-response handling
    if (chatId === 'chat_ai_bot' && text.trim()) {
      try {
        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: text }),
        });
        
        let aiText = 'Assalomu alaykum! Men Telegram AI Botiman. Savolingiz uchun rahmat!';
        if (response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            aiText = data.text || aiText;
          } else {
            aiText = await response.text();
          }
        } else {
          console.warn('AI Bot response non-OK status:', response.status);
        }
        
        const aiTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const aiMsg: Message = {
          id: `m_ai_resp_${Date.now()}`,
          chatId: 'chat_ai_bot',
          senderId: 'bot_ai',
          senderName: 'Gemini AI Assistant Bot',
          senderAvatar: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=300&q=80',
          text: aiText,
          timestamp: aiTime,
          dateStr: 'Today',
          isOutgoing: false,
          isRead: true,
          isDelivered: true,
          reactions: [{ emoji: '⚡', count: 1, users: [] }],
        };

        setTimeout(() => {
          setMessages((prev) => ({
            ...prev,
            chat_ai_bot: [...(prev.chat_ai_bot || []), aiMsg],
          }));
          setChats((prev) =>
            prev.map((c) =>
              c.id === 'chat_ai_bot'
                ? { ...c, lastMessage: aiMsg }
                : c
            )
          );
        }, 600);
      } catch (err) {
        console.error('AI Bot error handled gracefully:', err);
      }
    }

    // Support & Feature Bot handling
    if (chatId === 'chat_support_bot' && text.trim()) {
      const supTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const botReplyMsg: Message = {
        id: `m_sup_resp_${Date.now()}`,
        chatId: 'chat_support_bot',
        senderId: 'bot_support',
        senderName: 'Telegram Bug & Feature Bot',
        senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80',
        text: `✅ **Rahmat! Sizning taklif/xatoligingiz qabul qilindi!**\n\n📌 **Yuborilgan matn:** "${text}"\n\n⚡ Admin ko'rib chiqib tasdiqlagach, tizim (sayt) avtomatik ravishda yangilanadi!`,
        timestamp: supTime,
        dateStr: 'Today',
        isOutgoing: false,
        isRead: true,
        isDelivered: true,
      };

      const adminNotificationMsg: Message = {
        id: `m_admin_notif_${Date.now()}`,
        chatId: 'saved_messages',
        senderId: 'bot_support',
        senderName: '🛠️ Admin Bot (Auto-Deploy Control)',
        senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80',
        text: `📩 **YANGI TAKLIF / BUG REPORT KELDI:**\n\n👤 **Foydalanuvchi:** @${user?.username || 'fayozchek'}\n💬 **Tafsilot:** "${text}"\n\n⚙️ **ADMIN HARAKATI:** Siz ushbu taklifni ma'qullasangiz, "Tasdiqlash & Saytni Yangilash" buyrug'i beriladi va ilovangiz yangi versiyaga yangilanadi!`,
        timestamp: supTime,
        dateStr: 'Today',
        isOutgoing: false,
        isRead: false,
        isDelivered: true,
      };

      setTimeout(() => {
        setMessages((prev) => ({
          ...prev,
          chat_support_bot: [...(prev.chat_support_bot || []), botReplyMsg],
          saved_messages: [...(prev.saved_messages || []), adminNotificationMsg],
        }));

        setChats((prev) =>
          prev.map((c) => {
            if (c.id === 'chat_support_bot') return { ...c, lastMessage: botReplyMsg };
            if (c.id === 'saved_messages') return { ...c, lastMessage: adminNotificationMsg, unreadCount: (c.unreadCount || 0) + 1 };
            return c;
          })
        );

        confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
      }, 700);
    }
  };

  const addReaction = (chatId: string, messageId: string, emoji: string) => {
    // Trigger particle confetti on screen if high-energy emoji
    if (['🔥', '🎉', '❤️', '🤩', '🚀'].includes(emoji)) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
      });
    }

    setMessages((prev) => {
      const chatMsgs = prev[chatId] || [];
      const updated = chatMsgs.map((msg) => {
        if (msg.id !== messageId) return msg;

        const currentReactions = msg.reactions ? [...msg.reactions] : [];
        const existing = currentReactions.find((r) => r.emoji === emoji);

        if (existing) {
          const userId = user?.id || 'user_me';
          const hasVoted = existing.users.includes(userId);
          if (hasVoted) {
            existing.count = Math.max(0, existing.count - 1);
            existing.users = existing.users.filter((id) => id !== userId);
          } else {
            existing.count += 1;
            existing.users.push(userId);
          }
        } else {
          currentReactions.push({
            emoji,
            count: 1,
            users: [user?.id || 'user_me'],
          });
        }

        return { ...msg, reactions: currentReactions.filter((r) => r.count > 0) };
      });
      return { ...prev, [chatId]: updated };
    });
  };

  const votePoll = (chatId: string, messageId: string, optionId: string) => {
    setMessages((prev) => {
      const chatMsgs = prev[chatId] || [];
      const updated = chatMsgs.map((msg) => {
        if (msg.id !== messageId || !msg.poll) return msg;

        const userId = user?.id || 'user_me';
        const newOptions = msg.poll.options.map((opt) => {
          if (opt.id === optionId) {
            const hasVoted = opt.voters.includes(userId);
            return {
              ...opt,
              votes: hasVoted ? opt.votes - 1 : opt.votes + 1,
              voters: hasVoted ? opt.voters.filter((id) => id !== userId) : [...opt.voters, userId],
            };
          } else if (!msg.poll?.allowsMultiple) {
            // Remove from other options if single vote poll
            return {
              ...opt,
              votes: opt.voters.includes(userId) ? opt.votes - 1 : opt.votes,
              voters: opt.voters.filter((id) => id !== userId),
            };
          }
          return opt;
        });

        return { ...msg, poll: { ...msg.poll, options: newOptions } };
      });
      return { ...prev, [chatId]: updated };
    });
  };

  const deleteMessage = (chatId: string, messageId: string) => {
    setMessages((prev) => ({
      ...prev,
      [chatId]: (prev[chatId] || []).filter((m) => m.id !== messageId),
    }));
  };

  const pinMessage = (chatId: string, messageId: string) => {
    setMessages((prev) => ({
      ...prev,
      [chatId]: (prev[chatId] || []).map((m) => (m.id === messageId ? { ...m, isPinned: !m.isPinned } : m)),
    }));
  };

  const createNewChat = (name: string, type: Chat['type'], username?: string, description?: string): Chat => {
    const newChat: Chat = {
      id: `chat_${Date.now()}`,
      name,
      type,
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${name}`,
      username: username || name.toLowerCase().replace(/\s+/g, '_'),
      unreadCount: 0,
      description,
      folderIds: ['all'],
    };

    setChats((prev) => [newChat, ...prev]);
    setMessages((prev) => ({ ...prev, [newChat.id]: [] }));
    setActiveChatId(newChat.id);
    return newChat;
  };

  const addStory = (mediaUrl: string, caption?: string) => {
    const newStory: Story = {
      id: `story_${Date.now()}`,
      userId: user?.id || 'user_me',
      userName: user?.name || 'You',
      userAvatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      mediaUrl,
      mediaType: 'image',
      caption,
      timestamp: 'Just now',
      isUnread: false,
      likesCount: 0,
      viewsCount: 1,
    };
    setStories((prev) => [newStory, ...prev]);
  };

  const rewriteMessageWithAI = async (text: string, style: string): Promise<string> => {
    try {
      const res = await fetch('/api/ai/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, style }),
      });
      const data = await res.json();
      return data.rewrittenText || text;
    } catch (err) {
      console.error('AI Rewrite error:', err);
      return text;
    }
  };

  return (
    <TelegramContext.Provider
      value={{
        chats,
        activeChatId,
        setActiveChatId,
        messages,
        sendMessage,
        addReaction,
        votePoll,
        deleteMessage,
        pinMessage,
        createNewChat,
        folders,
        activeFolderId,
        setActiveFolderId,
        searchQuery,
        setSearchQuery,
        stories,
        addStory,
        activeStoryIndex,
        setActiveStoryIndex,
        theme,
        setTheme,
        chatWallpaper,
        setChatWallpaper,
        fontSize,
        setFontSize,
        activeCall,
        startCall,
        endCall,
        rewriteMessageWithAI,
      }}
    >
      {children}
    </TelegramContext.Provider>
  );
};

export const useTelegram = () => {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error('useTelegram must be used within a TelegramProvider');
  }
  return context;
};
