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
  Users,
  Bot,
  Check,
  ChevronDown,
  Info,
  ArrowLeft,
} from 'lucide-react';
import { useTelegram } from '../../context/TelegramContext';
import { MessageItem } from './MessageItem';
import { MessageInput } from './MessageInput';
import { UserProfileModal } from '../Modals/UserProfileModal';
import { Message } from '../../types/telegram';

interface ChatWindowProps {
  onOpenCreatePoll: () => void;
  onOpenMiniApp?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ onOpenCreatePoll, onOpenMiniApp }) => {
  const { chats, activeChatId, setActiveChatId, messages, startCall, theme } = useTelegram();
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const [currentPinnedIndex, setCurrentPinnedIndex] = useState(0);
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isLight = theme === 'light';

  const activeChat = chats.find((c) => c.id === activeChatId);
  const chatMessages = activeChatId ? messages[activeChatId] || [] : [];
  const pinnedMessages = chatMessages.filter((m) => m.isPinned);

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
    <div
      className={`flex-1 flex flex-col relative h-full bg-cover bg-center bg-no-repeat`}
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
        className={`relative z-10 flex items-center justify-between px-3 py-2 sm:px-4 sm:py-2.5 border-b shadow-xs transition-colors ${
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
              src={activeChat.avatar || 'https://telegram.org/img/t_logo.png'}
              alt={activeChat.name}
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
                {activeChat.name}
              </h2>
              {activeChat.isVerified && (
                <span className="bg-blue-600 text-white p-0.5 rounded-full text-[8px] shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
              )}
            </div>
            <p className={`text-[11px] sm:text-xs truncate font-medium ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
              {activeChat.isOnline ? (
                <span className="text-sky-500">online</span>
              ) : (
                'last seen recently'
              )}
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-0.5 sm:gap-1.5 shrink-0">
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
          
          <button
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
                  <Check className="w-5 h-5 opacity-70" /> Select tone
                </button>
                <button className={`w-full flex items-center gap-4 px-4 py-2 text-[14px] transition-colors ${isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-[#202b36] text-gray-200'}`}>
                  <Info className="w-5 h-5 opacity-70" /> View group info
                </button>
                <button onClick={() => { setShowMoreMenu(false); onOpenCreatePoll(); }} className={`w-full flex items-center gap-4 px-4 py-2 text-[14px] transition-colors ${isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-[#202b36] text-gray-200'}`}>
                  <Sparkles className="w-5 h-5 opacity-70" /> Create poll
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Pinned Messages Header Bar */}
      {pinnedMessages.length > 0 && (
        <div
          onClick={handlePinnedClick}
          className={`flex items-center justify-between px-4 py-2 border-b text-xs z-10 backdrop-blur-xs cursor-pointer select-none transition-colors ${
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

      {/* Message Input Bar */}
      <div className="z-10">
        <MessageInput
          chatId={activeChat.id}
          replyToMessage={replyToMessage}
          onCancelReply={() => setReplyToMessage(null)}
          onOpenCreatePoll={onOpenCreatePoll}
        />
      </div>

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        user={activeChat ? ({ id: activeChat.id, name: activeChat.name, phone: "+998 77 400 11 25", username: activeChat.username || "username", avatar: activeChat.avatar, isOnline: true } as any) : null}
      />
    </div>
  );
};
