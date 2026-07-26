const fs = require('fs');
const path = 'src/context/TelegramContext.tsx';
let content = fs.readFileSync(path, 'utf8');

const missingPart = `    // AI Bot Simulation
    if (chatId === 'chat_ai_bot' && text.trim()) {
      try {
        const aiTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const aiMsg: Message = {
          id: \`m_ai_\${Date.now()}\`,
          chatId: 'chat_ai_bot',
          senderId: 'bot',
          senderName: 'AI Bot',
          senderAvatar: 'https://ui-avatars.com/api/?name=AI&background=6366f1&color=fff&font-size=0.4',
          text: 'AI response to: ' + text,
          timestamp: aiTime,
          dateStr: 'Today',
          isOutgoing: false,
          isRead: true,
          isDelivered: true,
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
        id: \`m_sup_resp_\${Date.now()}\`,
        chatId: 'chat_support_bot',
        senderId: 'bot_support',
        senderName: 'Telegram Bug & Feature Bot',
        senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80',
        text: \`✅ **Rahmat! Sizning taklif/xatoligingiz qabul qilindi!**\\n\\n📌 **Yuborilgan matn:** "\${text}"\\n\\n⚡ Admin ko'rib chiqib tasdiqlagach, tizim (sayt) avtomatik ravishda yangilanadi!\`,
        timestamp: supTime,
        dateStr: 'Today',
        isOutgoing: false,
        isRead: true,
        isDelivered: true,
      };

      const adminNotificationMsg: Message = {
        id: \`m_admin_notif_\${Date.now()}\`,
        chatId: 'saved_messages',
        senderId: 'bot_support',
        senderName: 'System',
        text: \`🚀 **Yangi taklif / xatolik kelib tushdi!**\\n\\n👤 **Foydalanuvchi:** \${user?.name || 'Noma\\'lum'} (@\${user?.username || 'user'})\\n💬 **Matn:** "\${text}"\\n⏱ **Vaqt:** \${supTime}\`,
        timestamp: supTime,
        dateStr: 'Today',
        isOutgoing: false,
        isRead: true,
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
      return {
        ...prev,
        [chatId]: chatMsgs.map((m) => {
          if (m.id === messageId) {
            const reactions = m.reactions || [];
            const existing = reactions.find((r) => r.emoji === emoji);
            if (existing) {
              return {
                ...m,
                reactions: reactions.map((r) =>
                  r.emoji === emoji ? { ...r, count: r.count + 1 } : r
                ),
              };
            }
            return {
              ...m,
              reactions: [...reactions, { emoji, count: 1, users: [user?.id || 'me'] }],
            };
          }
          return m;
        }),
      };
    });
  };

  const votePoll = (chatId: string, messageId: string, optionId: string) => {
    setMessages((prev) => {
      const chatMsgs = prev[chatId] || [];
      return {
        ...prev,
        [chatId]: chatMsgs.map((m) => {
          if (m.id === messageId && m.poll) {
            const alreadyVoted = m.poll.options.some((o) => o.voters?.includes(user?.id || 'me'));
            if (alreadyVoted && !m.poll.multipleAnswers) return m;

            return {
              ...m,
              poll: {
                ...m.poll,
                totalVoters: (m.poll.totalVoters || 0) + 1,
                options: m.poll.options.map((o) =>
                  o.id === optionId
                    ? { ...o, votes: o.votes + 1, voters: [...(o.voters || []), user?.id || 'me'] }
                    : o
                ),
              },
            };
          }
          return m;
        }),
      };
    });
  };

  const deleteMessage = (chatId: string, messageId: string, forEveryone?: boolean) => {
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

  const clearHistory = (chatId: string) => {
    setMessages((prev) => ({ ...prev, [chatId]: [] }));
  };

  const leaveChat = (chatId: string) => {
    setChats((prev) => prev.filter((c) => c.id !== chatId));
    setMessages((prev) => {
      const newMsgs = { ...prev };
      delete newMsgs[chatId];
      return newMsgs;
    });
    if (activeChatId === chatId) setActiveChatId(null);
  };

  const createNewChat = (name: string, type: Chat['type'], username?: string, description?: string): Chat => {
    const newChat: Chat = {
      id: \`chat_\${Date.now()}\`,
      name,
      type,
      avatar: \`https://api.dicebear.com/7.x/identicon/svg?seed=\${name}\`,
      username: username || name.toLowerCase().replace(/\\s+/g, '_'),
      unreadCount: 0,
      membersCount: type === 'group' || type === 'channel' ? 1 : undefined,
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
      id: \`story_\${Date.now()}\`,
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
      console.error('Failed to rewrite message:', err);
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
        clearHistory,
        leaveChat,
        folders,
        activeFolderId,
        setActiveFolderId,
        searchQuery,
        setSearchQuery,
        searchInChatMode,
        setSearchInChatMode,
        stories,
        addStory,
        activeStoryIndex,
        setActiveStoryIndex,
        theme,
        setTheme,
        chatWallpaper,
        setChatWallpaper,
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
`;

content = content + "\n" + missingPart;
fs.writeFileSync(path, content);
