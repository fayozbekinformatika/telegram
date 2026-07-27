import React from 'react';
import { Search, Pin, CheckCheck, Lock, Bot, Radio, Users, Check, Sparkles } from 'lucide-react';
import { useTelegram } from '../../context/TelegramContext';
import { useAuth } from '../../context/AuthContext';
import { Chat } from '../../types/telegram';

export const ChatList: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { chats, activeChatId, setActiveChatId, searchQuery, activeFolderId, folders, theme, globalUsers, startChatWithUser, joinChat, setSearchQuery } =
    useTelegram();
  const isLight = theme === 'light';

  const myIds = React.useMemo(() => [currentUser?.id, 'user_me'].filter(Boolean) as string[], [currentUser]);

  const filteredChats = chats.filter((chat) => {
    if (chat.type === 'private') {
      const ids = chat.id.replace('private_', '').split('_');
      if (ids.length === 2) {
        return false; // Legacy format
      }
      if (!currentUser || !ids.includes(currentUser.id)) {
        return false; // Only show private chats where current user is a participant
      }
    } else if (chat.type === 'group' || chat.type === 'channel') {
      if (chat.memberIds && !myIds.some(id => chat.memberIds?.includes(id))) {
        return false;
      }
    }

    // Search query filter
    const matchesSearch =
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.description?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Folder filter
    if (activeFolderId === 'all') return !chat.isArchived;
    if (activeFolderId === 'unread') return chat.unreadCount > 0 && !chat.isArchived;

    const folder = folders.find((f) => f.id === activeFolderId);
    if (!folder) return true;

    if (folder.chatTypes) {
      return folder.chatTypes.includes(chat.type) && !chat.isArchived;
    }
    return chat.folderIds?.includes(activeFolderId) && !chat.isArchived;
  });

  const getChatIcon = (chat: Chat) => {
    if (chat.type === 'bot') return <Bot className="w-3.5 h-3.5 text-blue-500 inline ml-1" />;
    if (chat.type === 'channel') return <Radio className="w-3.5 h-3.5 text-blue-500 inline ml-1" />;
    if (chat.type === 'group') return <Users className="w-3.5 h-3.5 text-emerald-500 inline ml-1" />;
    if (chat.type === 'secret') return <Lock className="w-3.5 h-3.5 text-emerald-500 inline ml-1" />;
    return null;
  };

  const searchGlobalUsers = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    return Object.values(globalUsers).filter(u => {
      if (u.id === currentUser?.id) return false;
      const sortedIds = currentUser ? [currentUser.id, u.id].sort().join('_') : '';
      if (chats.some(c => c.id === `private_${sortedIds}`)) return false;
      const term = searchQuery.toLowerCase();
      return u.name.toLowerCase().includes(term) || u.username?.toLowerCase().includes(term);
    });
  }, [searchQuery, globalUsers, chats, currentUser]);

  const searchGlobalGroups = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    return chats.filter(chat => {
      if (chat.type !== 'group' && chat.type !== 'channel') return false;
      if (chat.memberIds && myIds.some(id => chat.memberIds?.includes(id))) return false;
      const term = searchQuery.toLowerCase();
      return chat.name.toLowerCase().includes(term) || chat.username?.toLowerCase().includes(term);
    });
  }, [searchQuery, chats, myIds]);

  const getOtherUser = (chatId: string) => {
    if (chatId.startsWith('private_')) {
      const ids = chatId.replace('private_', '').split('_');
      const otherId = ids.find(id => id !== currentUser?.id) || ids[0];
      return globalUsers?.[otherId];
    }
    return null;
  };

  return (
    <div
      className={`flex-1 overflow-y-auto no-scrollbar divide-y ${
        isLight ? 'bg-white divide-slate-100' : 'bg-[#17212b] divide-gray-800/40'
      }`}
    >
      {filteredChats.length === 0 && searchGlobalUsers.length === 0 ? (
        <div
          className={`flex flex-col items-center justify-center p-8 text-center ${
            isLight ? 'text-slate-400' : 'text-gray-500'
          }`}
        >
          <Search className="w-10 h-10 mb-2 stroke-1 opacity-50" />
          <p className="text-sm font-medium">No chats found</p>
          <p className="text-xs opacity-75 mt-1">Try searching for contacts, channels or bots</p>
        </div>
      ) : (
        <>
        {filteredChats.map((chat) => {
          const isSelected = activeChatId === chat.id;
          const otherUser = getOtherUser(chat.id);
          const displayAvatar = chat.type === 'private' ? (otherUser?.avatar || chat.avatar) : chat.avatar;
          const displayName = chat.type === 'private' ? (otherUser?.name || chat.name) : chat.name;

          return (
            <div
              key={chat.id}
              id={`chat-item-${chat.id}`}
              onClick={() => setActiveChatId(chat.id)}
              className={`flex items-center gap-3 px-3.5 py-3 cursor-pointer transition-all relative ${
                isSelected
                  ? isLight
                    ? 'bg-blue-50 border-r-4 border-blue-600 text-slate-800 font-medium'
                    : 'bg-[#2b5278] text-white'
                  : isLight
                  ? 'hover:bg-slate-50 border-r-4 border-transparent text-slate-700'
                  : 'hover:bg-[#202b36] text-gray-200'
              }`}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <img
                  src={displayAvatar || 'https://telegram.org/img/t_logo.png'}
                  alt={displayName}
                  className={`w-12 h-12 rounded-full object-cover border ${
                    isLight ? 'border-slate-200' : 'border-gray-700/50'
                  }`}
                />
                {chat.type === 'secret' && (
                  <div className="absolute -bottom-0.5 -right-0.5 bg-emerald-600 p-0.5 rounded-full text-white">
                    <Lock className="w-2.5 h-2.5" />
                  </div>
                )}
              </div>

              {/* Chat Content Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-1 min-w-0">
                    <h3
                      className={`text-sm font-semibold truncate ${
                        isSelected
                          ? isLight
                            ? 'text-blue-900'
                            : 'text-white'
                          : isLight
                          ? 'text-slate-800'
                          : 'text-gray-100'
                      }`}
                    >
                      {displayName}
                    </h3>
                    {chat.isVerified && (
                      <span className="bg-blue-600 text-white p-0.5 rounded-full text-[9px] shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                    {getChatIcon(chat)}
                  </div>

                  <span
                    className={`text-[10px] shrink-0 font-medium ${
                      isSelected
                        ? isLight
                          ? 'text-blue-600 font-semibold'
                          : 'text-blue-200'
                        : isLight
                        ? 'text-slate-400'
                        : 'text-gray-400'
                    }`}
                  >
                    {chat.lastMessage?.timestamp || ''}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <p
                    className={`text-xs truncate ${
                      isSelected
                        ? isLight
                          ? 'text-blue-600 font-medium'
                          : 'text-blue-100'
                        : isLight
                        ? 'text-slate-500'
                        : 'text-gray-400'
                    }`}
                  >
                    {chat.lastMessage ? (
                      <>
                        {(chat.lastMessage.senderId === currentUser?.id || (chat.lastMessage.isOutgoing && chat.lastMessage.senderId === 'user_me')) && (
                          <span
                            className={`inline-flex items-center mr-1 ${
                              isLight ? 'text-white' : 'text-sky-400'
                            }`}
                          >
                            {chat.lastMessage.isRead ? (
                              <CheckCheck className="w-3.5 h-3.5" />
                            ) : (
                              <Check className="w-3.5 h-3.5" />
                            )}
                          </span>
                        )}
                        {chat.lastMessage.text || (chat.lastMessage.mediaType ? `[${chat.lastMessage.mediaType}]` : '')}
                      </>
                    ) : (
                      chat.description || ''
                    )}
                  </p>

                  <div className="flex items-center gap-1 shrink-0">
                    {chat.isPinned && (
                      <Pin
                        className={`w-3.5 h-3.5 ${
                          isSelected
                            ? isLight
                              ? 'text-blue-600'
                              : 'text-blue-200'
                            : isLight
                            ? 'text-slate-400'
                            : 'text-gray-500'
                        }`}
                      />
                    )}
                    {chat.unreadCount > 0 && (
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                          chat.isMuted
                            ? isLight
                              ? 'bg-slate-200 text-slate-600'
                              : 'bg-gray-700 text-gray-300'
                            : 'bg-blue-600 text-white shadow-xs'
                        }`}
                      >
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {(searchGlobalUsers.length > 0 || searchGlobalGroups.length > 0) && (
          <div className="pt-2">
            <div className={`px-4 py-1 text-xs font-semibold ${isLight ? 'text-slate-500 bg-slate-50' : 'text-gray-400 bg-[#121a22]'}`}>
              Global Search
            </div>
            {searchGlobalGroups.map(chat => (
              <div
                key={chat.id}
                onClick={() => {
                  setActiveChatId(chat.id);
                  setSearchQuery('');
                }}
                className={`flex items-center justify-between gap-3 px-3.5 py-3 cursor-pointer transition-all relative ${
                  isLight ? 'hover:bg-slate-50 border-r-4 border-transparent text-slate-700' : 'hover:bg-[#202b36] text-gray-200'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="relative shrink-0">
                    <img src={chat.avatar || 'https://telegram.org/img/t_logo.png'} alt={chat.name} className={`w-12 h-12 rounded-full object-cover border ${isLight ? 'border-slate-200' : 'border-gray-700/50'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h3 className={`text-sm font-semibold truncate ${isLight ? 'text-slate-800' : 'text-gray-100'}`}>
                        {chat.name}
                        {getChatIcon(chat)}
                      </h3>
                    </div>
                    <p className={`text-xs truncate ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                      {chat.membersCount || 1} members
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    joinChat(chat.id);
                    setActiveChatId(chat.id);
                    setSearchQuery('');
                  }}
                  className="px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white font-medium text-xs rounded-full transition-all shrink-0 active:scale-95 shadow-xs cursor-pointer"
                >
                  Join
                </button>
              </div>
            ))}
            {searchGlobalUsers.map(user => (
              <div
                key={user.id}
                onClick={() => startChatWithUser(user)}
                className={`flex items-center gap-3 px-3.5 py-3 cursor-pointer transition-all relative ${
                  isLight ? 'hover:bg-slate-50 border-r-4 border-transparent text-slate-700' : 'hover:bg-[#202b36] text-gray-200'
                }`}
              >
                <div className="relative shrink-0">
                  <img src={user.avatar || 'https://telegram.org/img/t_logo.png'} alt={user.name} className={`w-12 h-12 rounded-full object-cover border ${isLight ? 'border-slate-200' : 'border-gray-700/50'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h3 className={`text-sm font-semibold truncate ${isLight ? 'text-slate-800' : 'text-gray-100'}`}>
                      {user.name}
                    </h3>
                  </div>
                  <p className={`text-xs truncate ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                    @{user.username || 'user'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        </>
      )}
    </div>
  );
};
