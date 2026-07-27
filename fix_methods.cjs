const fs = require('fs');

const replacement = `      setTimeout(() => {
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
            // If clicking the same reaction emoji that is already active, toggle it off (remove it)
            if (existing) {
              return {
                ...m,
                reactions: [],
              };
            }
            // Otherwise, replace existing reactions so there is strictly 1 active reaction on the message
            return {
              ...m,
              reactions: [{ emoji, count: 1, users: [user?.id || 'me'] }],
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
              }
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

  const toggleMute = (chatId: string) => {
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, isMuted: !c.isMuted } : c))
    );
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

  const createNewChat = (name: string, type: Chat['type'], username?: string, description?: string, avatar?: string): Chat => {
    const newChat: Chat = {
      id: \`chat_\${Date.now()}\`,
      name,
      type,
      avatar: avatar || \`https://api.dicebear.com/7.x/identicon/svg?seed=\${name}\`,
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
  };`;

const content = fs.readFileSync('src/context/TelegramContext.tsx', 'utf8');
const lines = content.split('\\n');
const newLines = [...lines.slice(0, 281), replacement, ...lines.slice(449)];
fs.writeFileSync('src/context/TelegramContext.tsx', newLines.join('\\n'));
