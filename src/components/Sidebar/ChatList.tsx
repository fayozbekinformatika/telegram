import React from 'react';
import { Search, Pin, CheckCheck, Lock, Bot, Radio, Users, Check, Sparkles } from 'lucide-react';
import { useTelegram } from '../../context/TelegramContext';
import { Chat } from '../../types/telegram';

export const ChatList: React.FC = () => {
  const { chats, activeChatId, setActiveChatId, searchQuery, activeFolderId, folders, theme } =
    useTelegram();
  const isLight = theme === 'light';

  const filteredChats = chats.filter((chat) => {
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

  return (
    <div
      className={`flex-1 overflow-y-auto no-scrollbar divide-y ${
        isLight ? 'bg-white divide-slate-100' : 'bg-[#17212b] divide-gray-800/40'
      }`}
    >
      {filteredChats.length === 0 ? (
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
        filteredChats.map((chat) => {
          const isSelected = activeChatId === chat.id;

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
                  src={chat.avatar || 'https://telegram.org/img/t_logo.png'}
                  alt={chat.name}
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
                      {chat.name}
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
                    {chat.lastMessage?.timestamp || '09:00'}
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
                        {chat.lastMessage.isOutgoing && (
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
                      chat.description || 'No messages yet'
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
        })
      )}
    </div>
  );
};
