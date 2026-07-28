import React, { useState } from 'react';
import { ArrowLeft, Camera, Settings, Users, Link as LinkIcon, Key, Smile, Shield, Check, User, X } from 'lucide-react';
import { Chat } from '../../types/telegram';
import { useTelegram } from '../../context/TelegramContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface EditGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  chat: Chat;
}

type PageType = 'main' | 'type' | 'history' | 'topics';

export const EditGroupModal: React.FC<EditGroupModalProps> = ({ isOpen, onClose, chat }) => {
  const { theme, updateChat } = useTelegram();
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [currentPage, setCurrentPage] = useState<PageType>('main');
  
  const [groupName, setGroupName] = useState(chat.name);
  const [description, setDescription] = useState(chat.description || '');
  const [isPublic, setIsPublic] = useState(chat.isPublic || false);
  const getBaseLink = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/?join=`;
    }
    return 'https://app.com/?join=';
  };
  const [inviteLink, setInviteLink] = useState(chat.inviteLink || (chat.username ? `${getBaseLink()}${chat.username}` : `${getBaseLink()}${chat.id}`));
  const [restrictSavingContent, setRestrictSavingContent] = useState(chat.restrictSavingContent || false);
  const [historyVisible, setHistoryVisible] = useState(chat.chatHistoryVisible ?? true);
  const [topicsEnabled, setTopicsEnabled] = useState(chat.topicsEnabled || false);

  if (!isOpen) return null;

  const isLight = theme === 'light';
  const bgMain = isLight ? 'bg-white' : 'bg-[#1c242f]';
  const textMain = isLight ? 'text-slate-800' : 'text-gray-100';
  const textSub = isLight ? 'text-slate-500' : 'text-gray-400';
  const bgHover = isLight ? 'hover:bg-slate-50' : 'hover:bg-[#202b36]';

  const handleSave = () => {
    updateChat(chat.id, {
      name: groupName,
      description,
      isPublic,
      inviteLink,
      restrictSavingContent,
      chatHistoryVisible: historyVisible,
      topicsEnabled,
    });
    showToast('Group settings updated');
    onClose();
  };

  const renderMain = () => (
    <div className="flex flex-col h-full overflow-y-auto overflow-x-hidden p-4">
      <div className="flex gap-4 items-start mb-6">
        <div className="relative cursor-pointer group">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-sky-500 flex items-center justify-center">
            {chat.avatar ? (
              <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-2xl font-medium">{chat.name.charAt(0)}</span>
            )}
          </div>
          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <div className="flex-1 space-y-3">
          <div className="relative">
             <label className="text-xs text-sky-500 absolute -top-2 left-2 bg-transparent z-10 px-1">Group name</label>
             <input
               type="text"
               value={groupName}
               onChange={(e) => setGroupName(e.target.value)}
               className={`w-full p-2 pt-3 bg-transparent border-b ${isLight ? 'border-sky-500 text-slate-800' : 'border-sky-500 text-white'} focus:outline-none`}
             />
             <Smile className={`absolute right-2 top-3 w-5 h-5 ${textSub}`} />
          </div>
          <div className="relative">
             <input
               type="text"
               value={description}
               onChange={(e) => setDescription(e.target.value)}
               placeholder="Description (optional)"
               className={`w-full p-2 bg-transparent border-b ${isLight ? 'border-slate-300 text-slate-800' : 'border-gray-700 text-white'} focus:outline-none focus:border-sky-500`}
             />
          </div>
        </div>
      </div>

      <div className={`flex flex-col rounded-xl overflow-hidden mb-3 ${isLight ? 'bg-slate-50' : 'bg-[#202b36]'}`}>
        <button onClick={() => setCurrentPage('type')} className={`flex items-center justify-between p-3 ${bgHover}`}>
          <div className="flex items-center gap-4">
            <Shield className={`w-5 h-5 ${textSub}`} />
            <span className={textMain}>Group type</span>
          </div>
          <span className="text-sky-500">{isPublic ? 'Public' : 'Private'}</span>
        </button>
        <button onClick={() => setCurrentPage('history')} className={`flex items-center justify-between p-3 ${bgHover}`}>
          <div className="flex items-center gap-4">
            <Settings className={`w-5 h-5 ${textSub}`} />
            <span className={textMain}>Chat history for new members</span>
          </div>
          <span className="text-sky-500">{historyVisible ? 'Visible' : 'Hidden'}</span>
        </button>
        <button onClick={() => setCurrentPage('topics')} className={`flex items-center justify-between p-3 ${bgHover}`}>
          <div className="flex items-center gap-4">
            <Settings className={`w-5 h-5 ${textSub}`} />
            <span className={textMain}>Topics</span>
          </div>
          <span className="text-sky-500">{topicsEnabled ? 'On' : 'Off'}</span>
        </button>
      </div>

      <div className={`flex flex-col rounded-xl overflow-hidden mb-3 ${isLight ? 'bg-slate-50' : 'bg-[#202b36]'}`}>
        <button className={`flex items-center justify-between p-3 ${bgHover}`}>
          <div className="flex items-center gap-4">
            <Smile className={`w-5 h-5 ${textSub}`} />
            <span className={textMain}>Reactions</span>
          </div>
          <span className="text-sky-500">All</span>
        </button>
        <button className={`flex items-center justify-between p-3 ${bgHover}`}>
          <div className="flex items-center gap-4">
            <Key className={`w-5 h-5 ${textSub}`} />
            <span className={textMain}>Permissions</span>
          </div>
          <span className="text-sky-500">14/15</span>
        </button>
        <button className={`flex items-center justify-between p-3 ${bgHover}`}>
          <div className="flex items-center gap-4">
            <LinkIcon className={`w-5 h-5 ${textSub}`} />
            <span className={textMain}>Invite links</span>
          </div>
          <span className="text-sky-500">1</span>
        </button>
        <button className={`flex items-center justify-between p-3 ${bgHover}`}>
          <div className="flex items-center gap-4">
            <Shield className={`w-5 h-5 ${textSub}`} />
            <span className={textMain}>Administrators</span>
          </div>
          <span className="text-sky-500">{chat.adminIds?.length || 1}</span>
        </button>
        <button className={`flex items-center justify-between p-3 ${bgHover}`}>
          <div className="flex items-center gap-4">
            <Users className={`w-5 h-5 ${textSub}`} />
            <span className={textMain}>Members</span>
          </div>
          <span className="text-sky-500">{chat.memberIds?.length || 1}</span>
        </button>
      </div>
    </div>
  );

  const renderType = () => (
    <div className="flex flex-col h-full p-4 overflow-y-auto">
      <h3 className={`text-sm font-medium mb-2 ${textSub}`}>Group type</h3>
      
      <div className={`flex flex-col rounded-xl overflow-hidden mb-4 p-2 ${isLight ? 'bg-slate-50' : 'bg-[#202b36]'}`}>
        <label className="flex gap-3 items-start p-2 cursor-pointer">
          <input 
            type="radio" 
            checked={isPublic} 
            onChange={() => setIsPublic(true)}
            className="mt-1 w-5 h-5 accent-sky-500" 
          />
          <div className="flex flex-col">
            <span className={textMain}>Public Group</span>
            <span className={`text-sm ${textSub}`}>Anyone can find the group in search and join, chat history is available to everybody</span>
          </div>
        </label>
        
        <label className="flex gap-3 items-start p-2 cursor-pointer">
          <input 
            type="radio" 
            checked={!isPublic} 
            onChange={() => setIsPublic(false)}
            className="mt-1 w-5 h-5 accent-sky-500" 
          />
          <div className="flex flex-col">
            <span className={textMain}>Private Group</span>
            <span className={`text-sm ${textSub}`}>People can only join if they are added or have an invite link</span>
          </div>
        </label>
      </div>

      {!isPublic && (
        <div className="mb-4">
          <h3 className={`text-sm font-medium mb-2 ${textSub}`}>Primary link</h3>
          <div className={`rounded-xl p-4 ${isLight ? 'bg-slate-50' : 'bg-[#202b36]'}`}>
             <div className="flex items-center justify-between mb-3">
               <span className={textMain}>{inviteLink}</span>
               <button className={textSub}><Settings className="w-5 h-5" /></button>
             </div>
             <div className="flex gap-2">
               <button onClick={() => { navigator.clipboard.writeText(inviteLink); showToast('Copied to clipboard'); }} className="flex-1 bg-sky-500 text-white p-2 rounded-lg font-medium">Copy Link</button>
               <button className="flex-1 bg-sky-500 text-white p-2 rounded-lg font-medium">Share Link</button>
             </div>
          </div>
          <p className={`text-xs mt-2 text-center ${textSub}`}>Anyone who has Telegram installed will be able to join your group by following this link.</p>
        </div>
      )}

      {isPublic && (
        <div className="mb-4">
           <h3 className={`text-sm font-medium mb-2 ${textSub}`}>Link</h3>
           <div className={`rounded-xl p-3 ${isLight ? 'bg-slate-50' : 'bg-[#202b36]'}`}>
             <div className="flex items-center">
               <span className={textMain}>{getBaseLink()}</span>
               <input 
                 type="text" 
                 value={inviteLink.replace(getBaseLink(), '')} 
                 onChange={(e) => setInviteLink(getBaseLink() + e.target.value)}
                 className={`flex-1 bg-transparent border-none outline-none ${textMain}`}
                 placeholder="link"
               />
             </div>
           </div>
           <p className={`text-xs mt-2 ${textSub}`}>You can use a-z, 0-9 and underscores. Minimum length is 5 characters.</p>
        </div>
      )}

      <h3 className={`text-sm font-medium mb-2 mt-4 ${textSub}`}>Content protection</h3>
      <div className={`rounded-xl p-3 flex flex-col gap-2 ${isLight ? 'bg-slate-50' : 'bg-[#202b36]'}`}>
        <div className="flex items-center justify-between">
          <span className={textMain}>Restrict saving content</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={restrictSavingContent} onChange={(e) => setRestrictSavingContent(e.target.checked)} />
            <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-500"></div>
          </label>
        </div>
        <p className={`text-xs ${textSub}`}>Members won't be able to copy, save or forward content from this group.</p>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="flex flex-col h-full p-4">
      <div className={`flex flex-col rounded-xl overflow-hidden p-2 ${isLight ? 'bg-slate-50' : 'bg-[#202b36]'}`}>
        <label className="flex gap-3 items-start p-2 cursor-pointer">
          <input 
            type="radio" 
            checked={historyVisible} 
            onChange={() => setHistoryVisible(true)}
            className="mt-1 w-5 h-5 accent-sky-500" 
          />
          <div className="flex flex-col">
            <span className={textMain}>Visible</span>
            <span className={`text-sm ${textSub}`}>New members will see messages that were sent before they joined.</span>
          </div>
        </label>
        
        <label className="flex gap-3 items-start p-2 cursor-pointer">
          <input 
            type="radio" 
            checked={!historyVisible} 
            onChange={() => setHistoryVisible(false)}
            className="mt-1 w-5 h-5 accent-sky-500" 
          />
          <div className="flex flex-col">
            <span className={textMain}>Hidden</span>
            <span className={`text-sm ${textSub}`}>New members won't see more than 100 previous messages.</span>
          </div>
        </label>
      </div>
    </div>
  );

  const renderTopics = () => (
    <div className="flex flex-col h-full p-4">
      <div className="flex justify-center mb-6 mt-4">
        <div className="w-20 h-20 rounded-full bg-sky-500/20 flex items-center justify-center text-4xl">
           💬
        </div>
      </div>
      <p className={`text-center text-sm mb-6 ${textSub}`}>The group chat will be divided into topics created by admins or users.</p>
      
      <div className={`rounded-xl p-3 flex items-center justify-between mb-4 ${isLight ? 'bg-slate-50' : 'bg-[#202b36]'}`}>
        <span className={textMain}>Enable Topics</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" checked={topicsEnabled} onChange={(e) => setTopicsEnabled(e.target.checked)} />
          <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-500"></div>
        </label>
      </div>
    </div>
  );

  const titles = {
    main: 'Edit group',
    type: 'Group type',
    history: 'Chat history for new members',
    topics: 'Topics'
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`w-full max-w-sm rounded-xl overflow-hidden shadow-2xl flex flex-col ${bgMain} max-h-[85vh]`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 ${isLight ? 'bg-slate-50' : 'bg-[#202b36]'}`}>
          <div className="flex items-center gap-4">
            {currentPage !== 'main' && (
              <button onClick={() => setCurrentPage('main')} className={`${textMain} hover:opacity-70 transition-opacity`}>
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className={`font-semibold text-lg ${textMain}`}>{titles[currentPage]}</h2>
          </div>
          {currentPage === 'main' && (
            <button onClick={onClose} className={`p-1 rounded-full ${bgHover} ${textSub}`}>
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {currentPage === 'main' && renderMain()}
          {currentPage === 'type' && renderType()}
          {currentPage === 'history' && renderHistory()}
          {currentPage === 'topics' && renderTopics()}
        </div>

        {/* Footer */}
        <div className={`p-4 flex justify-end gap-6 border-t ${isLight ? 'border-slate-200' : 'border-gray-800'}`}>
           <button onClick={currentPage === 'main' ? onClose : () => setCurrentPage('main')} className="font-medium text-sky-500 hover:text-sky-600">Cancel</button>
           <button onClick={currentPage === 'main' ? handleSave : () => setCurrentPage('main')} className="font-medium text-sky-500 hover:text-sky-600">Save</button>
        </div>
      </div>
    </div>
  );
};
