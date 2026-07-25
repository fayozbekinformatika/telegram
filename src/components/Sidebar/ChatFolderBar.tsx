import React from 'react';
import { useTelegram } from '../../context/TelegramContext';

export const ChatFolderBar: React.FC = () => {
  const { folders, activeFolderId, setActiveFolderId, chats, theme } = useTelegram();
  const isLight = theme === 'light';

  const getFolderUnreadCount = (folderId: string) => {
    if (folderId === 'all') {
      return chats.reduce((acc, c) => acc + c.unreadCount, 0);
    }
    const folder = folders.find((f) => f.id === folderId);
    if (!folder) return 0;
    return chats
      .filter((c) => {
        if (folder.chatTypes) return folder.chatTypes.includes(c.type);
        return c.folderIds?.includes(folderId);
      })
      .reduce((acc, c) => acc + c.unreadCount, 0);
  };

  return (
    <div
      className={`flex items-center px-1 overflow-x-auto no-scrollbar border-b ${
        isLight ? 'bg-white border-slate-200' : 'bg-[#17212b] border-[#0e1621]'
      }`}
    >
      {folders.map((folder) => {
        const isActive = activeFolderId === folder.id;
        const unread = getFolderUnreadCount(folder.id);

        return (
          <button
            key={folder.id}
            id={`folder-tab-${folder.id}`}
            onClick={() => setActiveFolderId(folder.id)}
            className={`relative flex items-center gap-1.5 px-4 py-3 text-[13px] font-semibold whitespace-nowrap transition-colors ${
              isActive
                ? isLight
                  ? 'text-blue-500'
                  : 'text-[#4092d6]'
                : isLight
                ? 'text-slate-500 hover:text-slate-700'
                : 'text-[#7e8c9a] hover:text-[#c8cdd3]'
            }`}
          >
            <span>{folder.name}</span>
            {unread > 0 && (
              <span
                className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isActive
                    ? isLight
                      ? 'bg-blue-500 text-white'
                      : 'bg-[#4092d6] text-white'
                    : isLight
                    ? 'bg-slate-200 text-slate-500'
                    : 'bg-[#202b36] text-[#7e8c9a]'
                }`}
              >
                {unread}
              </span>
            )}
            
            {/* Active Tab Indicator */}
            {isActive && (
              <div
                className={`absolute bottom-0 left-0 right-0 h-[3px] rounded-t-full ${
                  isLight ? 'bg-blue-500' : 'bg-[#4092d6]'
                }`}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
