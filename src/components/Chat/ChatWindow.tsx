import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  Video,
  Search,
  MoreVertical,
  Pin,
  Lock,
  Sparkles,
  Radio,
  Image as ImageIcon,
  Users,
  Bot,
  Check,
  ChevronDown,
  Info,
  X,
  ArrowLeft,
  UserPlus,
  LogOut,
  Bell,
  BellOff,
} from 'lucide-react';
import { useTelegram } from '../../context/TelegramContext';
import { useAuth } from '../../context/AuthContext';
import { MessageItem } from './MessageItem';
import { MessageInput } from './MessageInput';
import { UserProfileModal } from '../Modals/UserProfileModal';
import { Message, User } from '../../types/telegram';

interface ChatWindowProps {
  onOpenCreatePoll: () => void;
  onOpenMiniApp?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ onOpenCreatePoll, onOpenMiniApp }) => {
  const { user: currentUser } = useAuth();
  const { chats, activeChatId, setActiveChatId, messages, startCall, theme, setSearchInChatMode, clearHistory, leaveChat, toggleMute, globalUsers, markChatAsRead, joinChat } = useTelegram();
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const [currentPinnedIndex, setCurrentPinnedIndex] = useState(0);
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const showToast = (msg: string) => { setToastMsg(msg); setTimeout(() => setToastMsg(''), 3000); };
  const [showProfile, setShowProfile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isLight = theme === 'light';

  const activeChat = chats.find((c) => c.id === activeChatId);
  const myIds = [currentUser?.id, 'user_me'].filter(Boolean) as string[];
  const isJoined = activeChat && (
    (activeChat.type !== 'group' && activeChat.type !== 'channel')
      ? true
      : Boolean(activeChat.memberIds && myIds.some(id => activeChat.memberIds?.includes(id)))
  );
  const isChannelOwnerOrAdmin = activeChat && activeChat.type === 'channel'
    ? Boolean(
        (activeChat.creatorId && myIds.includes(activeChat.creatorId)) ||
        (activeChat.adminIds && myIds.some(id => activeChat.adminIds?.includes(id)))
      )
    : true;
  const chatMessages = activeChatId ? messages[activeChatId] || [] : [];
  const pinnedMessages = chatMessages.filter((m) => m.isPinned);

  useEffect(() => {
    if (activeChatId) {
      markChatAsRead(activeChatId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChatId, chatMessages.length]);

  const getOtherUser = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (chat?.participantIds) {
      const otherId = chat.participantIds.find(id => !myIds.includes(id));
      if (otherId && globalUsers?.[otherId]) return globalUsers[otherId];
    }
    if (chat?.memberIds) {
      const otherId = chat.memberIds.find(id => !myIds.includes(id));
      if (otherId && globalUsers?.[otherId]) return globalUsers[otherId];
    }
    if (chatId.startsWith('private_')) {
      const otherUser = (Object.values(globalUsers) as User[]).find(
        u => !myIds.includes(u.id) && chatId.includes(u.id)
      );
      if (otherUser) return otherUser;
    }
    return null;
  };

  const displayAvatar = activeChat?.type === 'private' ? (getOtherUser(activeChat.id)?.avatar || activeChat?.avatar) : activeChat?.avatar;
  const displayName = activeChat?.type === 'private' ? (getOtherUser(activeChat.id)?.name || activeChat?.name) : activeChat?.name;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, highlightedMessageId]);

  const handleScrollToMessage = (messageId: string) => {
    const el = document.getElementById(`message-${messageId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedMessageId(messageId);
      setTimeout(() => {
        setHighlightedMessageId(null);
      }, 2200);
    }
  };

  const handlePinnedClick = () => {
    if (pinnedMessages.length === 0) return;
    const targetIdx = currentPinnedIndex % pinnedMessages.length;
    const targetMsg = pinnedMessages[targetIdx];
    if (targetMsg) {
      handleScrollToMessage(targetMsg.id);
    }
    setCurrentPinnedIndex((prev) => (prev + 1) % pinnedMessages.length);
  };

  if (!activeChat) {
    return (
      <div
        className={`flex-1 hidden md:flex flex-col items-center justify-center p-8 text-center ${
          isLight ? 'bg-[#e6ebe3] text-slate-500' : 'bg-[#0e1621] text-gray-500'
        }`}
      >
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
            isLight ? 'bg-white/80 shadow-md text-blue-600' : 'bg-gray-800/50 text-sky-400'
          }`}
        >
          <Radio className="w-10 h-10 opacity-80" />
        </div>
        <h2 className={`text-lg font-bold ${isLight ? 'text-slate-800' : 'text-gray-300'}`}>
          Select a chat to start messaging
        </h2>
        <p className={`text-xs max-w-sm mt-1 ${isLight ? 'text-slate-500' : 'text-gray-500'}`}>
          Telegram Web Pro with AES-256 Encrypted Tunnel & Realtime Messaging Architecture.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-row h-full w-full overflow-hidden relative">
      {/* Main Chat Area */}
      <div
        className={`flex-1 flex flex-col relative h-full min-w-0 bg-cover bg-center bg-no-repeat`}
        style={{
          backgroundImage: isLight
            ? 'url("https://telegram.org/img/t_logo.png")'
            : 'url("https://telegram.org/img/t_logo.png")',
          backgroundColor: isLight ? '#e6ebe3' : '#0e1621',
          backgroundBlendMode: isLight ? 'overlay' : 'overlay',
        }}
      >
      <div className={`absolute inset-0 z-0 ${isLight ? 'bg-[#e6ebe3]/90' : 'bg-[#0e1621]/90'}`} />
      
      {/* Header */}
      <div
        className={`relative z-30 flex items-center justify-between px-3 py-2 sm:px-4 sm:py-2.5 border-b shadow-xs transition-colors ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#17212b] border-[#0e1621]'
        }`}
      >
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <button
            onClick={() => setActiveChatId(null)}
            className={`md:hidden p-1.5 sm:p-2 mr-1 -ml-1.5 rounded-full transition-colors ${
              isLight
                ? 'hover:bg-slate-100 text-slate-700'
                : 'hover:bg-[#202b36] text-gray-200'
            }`}
            title="Back to chat list"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="relative shrink-0 cursor-pointer" onClick={() => setShowProfile(true)}>
            <img
              src={displayAvatar || 'https://telegram.org/img/t_logo.png'}
              alt={displayName}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border ${
                isLight ? 'border-slate-200' : 'border-gray-700'
              }`}
            />
            {activeChat.type === 'secret' && (
              <div className="absolute -bottom-0.5 -right-0.5 bg-emerald-600 p-0.5 rounded-full text-white">
                <Lock className="w-2.5 h-2.5" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1 cursor-pointer" onClick={() => setShowProfile(true)}>
            <div className="flex items-center gap-1.5">
              <h2 className={`text-sm sm:text-base font-bold truncate ${isLight ? 'text-slate-800' : 'text-white'}`}>
                {displayName}
              </h2>
              {activeChat.isVerified && (
                <span className="bg-blue-600 text-white p-0.5 rounded-full text-[8px] shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
              )}
            </div>
            <p className={`text-[11px] sm:text-xs truncate font-medium ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
              {activeChat.type === 'group' || activeChat.type === 'channel' ? (
                `${activeChat.membersCount || 1} members`
              ) : (activeChat.isOnline || getOtherUser(activeChat.id)?.status === 'online') ? (
                <span className="text-sky-500">online</span>
              ) : (
                getOtherUser(activeChat.id)?.status || 'last seen recently'
              )}
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-0.5 sm:gap-1.5 shrink-0">
          {activeChat.type !== 'group' && activeChat.type !== 'channel' && (
            <>
              <button
                onClick={() => startCall(activeChat.name, activeChat.avatar, false)}
                title="Call"
                className={`hidden sm:flex p-1.5 sm:p-2 rounded-full transition-colors ${
                  isLight ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-[#202b36] text-gray-400'
                }`}
              >
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              
              <button
                onClick={() => startCall(activeChat.name, activeChat.avatar, true)}
                title="Video Call"
                className={`hidden sm:flex p-1.5 sm:p-2 rounded-full transition-colors ${
                  isLight ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-[#202b36] text-gray-400'
                }`}
              >
                <Video className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </>
          )}
          
          <button onClick={() => setSearchInChatMode(true)}
            title="Search in chat"
            className={`p-1.5 sm:p-2 rounded-full transition-colors ${
              isLight ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-[#202b36] text-gray-400'
            }`}
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            title="More"
            className={`p-1.5 sm:p-2 rounded-full transition-colors ${
              isLight ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-[#202b36] text-gray-400'
            }`}
          >
            <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {showMoreMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMoreMenu(false)} />
              <div className={`absolute right-4 top-14 w-64 py-2 rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in-95 ${
                isLight ? 'bg-white border border-slate-100' : 'bg-[#17212b] border border-black/20'
              }`}>
                <button className={`w-full flex items-center gap-4 px-4 py-2 text-[14px] transition-colors ${isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-[#202b36] text-gray-200'}`}>
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg> Select tone
                </button>
                <button onClick={() => { setShowMoreMenu(false); toggleMute(activeChat.id); }} className={`w-full flex items-center gap-4 px-4 py-2 text-[14px] transition-colors ${isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-[#202b36] text-gray-200'}`}>
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707 .707L5.586 15z"></path><line x1="17" y1="9" x2="23" y2="15"></line><line x1="23" y1="9" x2="17" y2="15"></line></svg> {activeChat.isMuted ? 'Enable sound' : 'Disable sound'}
                </button>
                <button onClick={() => { setShowMoreMenu(false); toggleMute(activeChat.id); }} className={`w-full flex items-center gap-4 px-4 py-2 text-[14px] transition-colors ${isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-[#202b36] text-gray-200'}`}>
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg> Mute for...
                </button>
                <button onClick={() => { setShowMoreMenu(false); toggleMute(activeChat.id); }} className={`w-full flex items-center gap-4 px-4 py-2 text-[14px] text-red-500 transition-colors ${isLight ? 'hover:bg-slate-100' : 'hover:bg-[#202b36]'}`}>
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.73 21a2 2 0 0 1-3.46 0"></path><path d="M18.63 13A17.89 17.89 0 0 1 18 8"></path><path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14"></path><path d="M18 8a6 6 0 0 0-9.33-5"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg> {activeChat.isMuted ? 'Unmute' : 'Mute forever'}
                </button>
                <div className={`my-1 border-b ${isLight ? 'border-slate-100' : 'border-white/10'}`} />
                <button onClick={() => { setShowMoreMenu(false); setShowProfile(true); }} className={`w-full flex items-center gap-4 px-4 py-2 text-[14px] transition-colors ${isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-[#202b36] text-gray-200'}`}>
                  <Info className="w-5 h-5 opacity-70" /> View group info
                </button>
                <button onClick={() => { setShowMoreMenu(false); showToast('Group boosted! 🚀'); }} className={`w-full flex items-center gap-4 px-4 py-2 text-[14px] transition-colors ${isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-[#202b36] text-gray-200'}`}>
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg> Boost Group
                </button>
                <button onClick={() => { setShowMoreMenu(false); onOpenCreatePoll(); }} className={`w-full flex items-center gap-4 px-4 py-2 text-[14px] transition-colors ${isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-[#202b36] text-gray-200'}`}>
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg> Create poll
                </button>
                <button onClick={() => { setShowMoreMenu(false); showToast('Chat history exported successfully!'); }} className={`w-full flex items-center gap-4 px-4 py-2 text-[14px] transition-colors ${isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-[#202b36] text-gray-200'}`}>
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg> Export chat history
                </button>
                <button onClick={() => setShowMoreMenu(false)} className={`w-full flex items-center gap-4 px-4 py-2 text-[14px] transition-colors ${isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-[#202b36] text-gray-200'}`}>
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg> Report
                </button>
                <button onClick={() => { setShowMoreMenu(false); clearHistory(activeChat.id); }} className={`w-full flex items-center gap-4 px-4 py-2 text-[14px] transition-colors ${isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-[#202b36] text-gray-200'}`}>
                  <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg> Clear history
                </button>
                <div className={`my-1 border-b ${isLight ? 'border-slate-100' : 'border-white/10'}`} />
                {isJoined ? (
                  <button onClick={() => { setShowMoreMenu(false); leaveChat(activeChat.id); showToast(`Left ${activeChat.name}`); }} className={`w-full flex items-center gap-4 px-4 py-2 text-[14px] text-red-500 transition-colors ${isLight ? 'hover:bg-slate-100' : 'hover:bg-[#202b36]'}`}>
                    <LogOut className="w-5 h-5 opacity-70" /> Leave {activeChat.type === 'channel' ? 'channel' : 'group'}
                  </button>
                ) : (
                  <button onClick={() => { setShowMoreMenu(false); joinChat(activeChat.id); showToast(`Joined ${activeChat.name}`); }} className={`w-full flex items-center gap-4 px-4 py-2 text-[14px] text-sky-500 font-medium transition-colors ${isLight ? 'hover:bg-slate-100' : 'hover:bg-[#202b36]'}`}>
                    <UserPlus className="w-5 h-5 opacity-70" /> Join {activeChat.type === 'channel' ? 'channel' : 'group'}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Pinned Messages Header Bar */}
      {pinnedMessages.length > 0 && (
        <div
          onClick={handlePinnedClick}
          className={`relative flex items-center justify-between px-4 py-2 border-b text-xs z-20 backdrop-blur-xs cursor-pointer select-none transition-colors ${
            isLight
              ? 'bg-white/90 border-slate-200 hover:bg-slate-50'
              : 'bg-[#17212b]/90 border-[#0e1621] hover:bg-[#1f2c3a]'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-0.5 h-8 bg-[#4092d6] rounded-full shrink-0" />
            <div className="truncate min-w-0 flex-1">
              <span className="font-semibold text-[#4092d6] block text-[13px] leading-tight mb-0.5">
                Pinned message
              </span>
              <span className={`truncate block text-[13px] ${isLight ? 'text-slate-700' : 'text-[#c8cdd3]'}`}>
                {pinnedMessages[currentPinnedIndex % pinnedMessages.length]?.text || pinnedMessages[0].text}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Messages List Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-4 relative z-10">
        {chatMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-400">
            <div className="w-16 h-16 rounded-full bg-white/80 shadow-sm flex items-center justify-center mb-3 text-blue-600">
              <Sparkles className="w-8 h-8 opacity-80" />
            </div>
            <p className={`text-sm font-semibold ${isLight ? 'text-slate-700' : 'text-gray-300'}`}>
              No messages here yet...
            </p>
          </div>
        ) : (
          chatMessages.map((msg) => (
            <MessageItem
              key={msg.id}
              message={msg}
              onReplyTo={(m) => setReplyToMessage(m)}
              isHighlighted={highlightedMessageId === msg.id}
              onScrollToMessage={handleScrollToMessage}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Bar or Join Button or Channel Restricted Bar */}
      <div className="z-10">
        {!isJoined && (activeChat.type === 'group' || activeChat.type === 'channel') ? (
          <div className={`p-4 border-t ${isLight ? 'bg-white border-slate-200' : 'bg-[#17212b] border-[#0e1621]'} flex justify-center items-center`}>
            <button
              onClick={() => {
                joinChat(activeChat.id);
                showToast(`Joined ${activeChat.name}`);
              }}
              className="w-full max-w-sm py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg uppercase text-sm tracking-wide flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <UserPlus className="w-5 h-5" />
              Join {activeChat.type === 'channel' ? 'Channel' : 'Group'}
            </button>
          </div>
        ) : activeChat.type === 'channel' && !isChannelOwnerOrAdmin ? (
          <div className={`p-3.5 border-t ${isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-[#17212b] border-[#0e1621] text-gray-200'} flex items-center justify-between gap-3 px-6 shadow-inner`}>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-gray-400">
              <Lock className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Kanalda faqat yaratgan odam yozishi mumkin</span>
            </div>
            <button
              onClick={() => {
                toggleMute(activeChat.id);
                showToast(activeChat.isMuted ? "Channel unmuted" : "Channel muted");
              }}
              className={`px-4 py-2 rounded-lg font-semibold text-xs tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer ${
                activeChat.isMuted 
                  ? 'bg-sky-500/10 text-sky-500 hover:bg-sky-500/20' 
                  : 'bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-white'
              }`}
            >
              {activeChat.isMuted ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
              {activeChat.isMuted ? 'Muted' : 'Mute'}
            </button>
          </div>
        ) : (
          <MessageInput
            chatId={activeChat.id}
            replyToMessage={replyToMessage}
            onCancelReply={() => setReplyToMessage(null)}
            onOpenCreatePoll={onOpenCreatePoll}
          />
        )}
      </div>

      {toastMsg && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-50 bg-black/80 backdrop-blur-md text-white text-sm px-4 py-2 rounded-full shadow-lg animate-in fade-in slide-in-from-bottom-2">
          {toastMsg}
        </div>
      )}
      {/* User Profile Modal */}
      {showProfile && (
        <UserProfileModal
          isOpen={showProfile}
          onClose={() => setShowProfile(false)}
          user={(activeChat.type === 'private' ? getOtherUser(activeChat.id) : null) || { id: activeChat.id, name: activeChat.name, username: activeChat.username, avatar: activeChat.avatar, membersCount: activeChat.membersCount, memberIds: activeChat.memberIds, type: activeChat.type, bio: activeChat.description } as any}
        />
      )}
    </div>
    </div>
  );
};
