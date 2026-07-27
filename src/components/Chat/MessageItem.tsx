import React, { useState } from 'react';
import {
  Check,
  CheckCheck,
  Play,
  Pause,
  Copy,
  Pin,
  Trash2,
  Reply,
  Eye,
  Smile,
  MoreVertical,
  Volume2,
  Maximize2,
  X,
} from 'lucide-react';
import { Message } from '../../types/telegram';
import { useTelegram } from '../../context/TelegramContext';
import { useAuth } from '../../context/AuthContext';

interface MessageItemProps {
  message: Message;
  onReplyTo: (msg: Message) => void;
  isHighlighted?: boolean;
  onScrollToMessage?: (messageId: string) => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  onReplyTo,
  isHighlighted,
  onScrollToMessage,
}) => {
  const { addReaction, votePoll, deleteMessage, pinMessage, activeChatId, theme, globalUsers } = useTelegram();
  const { user } = useAuth();
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [voicePlaybackSpeed, setVoicePlaybackSpeed] = useState<number>(1);
  const [showSpoiler, setShowSpoiler] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showQuickReactions, setShowQuickReactions] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [showImageLightbox, setShowImageLightbox] = useState(false);

  const isOutgoing = message.senderId === user?.id || (message.senderId === 'user_me');
  const isLight = theme === 'light';

  const handleCopyCode = (codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const toggleVoiceSpeed = () => {
    if (voicePlaybackSpeed === 1) setVoicePlaybackSpeed(1.5);
    else if (voicePlaybackSpeed === 1.5) setVoicePlaybackSpeed(2);
    else setVoicePlaybackSpeed(1);
  };

  // Process markdown formatting like **bold**, `code`, ```code```, ||spoiler||
  const renderFormattedText = (text: string) => {
    if (!text) return null;

    // Check code blocks ```code```
    if (text.startsWith('```') && text.endsWith('```')) {
      const codeContent = text.slice(3, -3).trim();
      return (
        <div className="my-1 rounded-xl bg-slate-900 p-3 border border-slate-800 font-mono text-xs text-sky-300 relative group">
          <button
            onClick={() => handleCopyCode(codeContent)}
            className="absolute top-2 right-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-lg text-[10px] font-sans flex items-center gap-1 opacity-80 group-hover:opacity-100"
          >
            <Copy className="w-3 h-3" />
            {copiedCode ? 'Copied!' : 'Copy Code'}
          </button>
          <pre className="overflow-x-auto whitespace-pre-wrap">{codeContent}</pre>
        </div>
      );
    }

    // Spoiler text ||text||
    if (text.includes('||')) {
      const parts = text.split('||');
      return (
        <span>
          {parts.map((part, index) => {
            if (index % 2 === 1) {
              return (
                <span
                  key={index}
                  onClick={() => setShowSpoiler(!showSpoiler)}
                  className={`cursor-pointer px-1 py-0.5 rounded transition-all ${
                    showSpoiler
                      ? 'bg-blue-100 text-slate-800'
                      : 'bg-slate-400 text-transparent select-none blur-[3px] hover:blur-xs'
                  }`}
                >
                  {part}
                </span>
              );
            }
            return part;
          })}
        </span>
      );
    }

    return <span className="whitespace-pre-wrap leading-relaxed">{text}</span>;
  };

  return (
    <div
      id={`message-${message.id}`}
      className={`flex flex-col my-1 px-1 sm:px-2 group relative transition-all duration-300 rounded-2xl ${
        isOutgoing ? 'items-end' : 'items-start'
      } ${
        isHighlighted
          ? isLight
            ? 'bg-blue-100/80 shadow-md scale-[1.01]'
            : 'bg-blue-900/40 shadow-md scale-[1.01]'
          : ''
      }`}
    >
      {/* Quick Reaction Hover Menu */}
      {showQuickReactions && (
        <div
          className={`absolute -top-9 z-20 flex items-center gap-1 p-1 rounded-full border shadow-lg animate-in fade-in zoom-in-90 duration-150 ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#17212b] border-gray-700'
          }`}
        >
          {['👍', '❤️', '🔥', '😂', '🤩', '🚀', '💯'].map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                if (activeChatId) addReaction(activeChatId, message.id, emoji);
                setShowQuickReactions(false);
              }}
              className="text-lg hover:scale-130 transition-transform p-1 rounded-full hover:bg-slate-100 dark:hover:bg-gray-800"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Message Bubble Container */}
      <div className="flex items-end gap-1.5 sm:gap-2 max-w-[90%] sm:max-w-[80%] md:max-w-[70%]">
        {!isOutgoing && (
          <img
            src={globalUsers?.[message.senderId]?.avatar || message.senderAvatar || 'https://telegram.org/img/t_logo.png'}
            alt={message.senderName}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover shrink-0 mb-1 border ${
              isLight ? 'border-slate-200' : 'border-gray-700'
            }`}
          />
        )}

        <div
          className={`relative text-xs sm:text-sm break-words ${
            message.mediaType === 'video_note' || message.mediaType === 'image' || message.mediaType === 'sticker'
              ? 'p-0 bg-transparent border-0 shadow-none'
              : `p-3 sm:p-4 rounded-2xl ${
                  isOutgoing
                    ? (isLight ? 'bg-[#eeffde] text-slate-900 rounded-br-none shadow-sm' : 'bg-[#2b5278] text-white rounded-br-none shadow-sm')
                    : isLight
                    ? 'bg-white text-slate-800 rounded-bl-none shadow-sm border border-slate-200'
                    : 'bg-[#182533] text-gray-100 rounded-bl-none border border-gray-700/40 shadow-sm'
                }`
          }`}
        >
          {/* Reply To Parent Header */}
          {message.replyToText && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                if (message.replyToMessageId) {
                  if (onScrollToMessage) {
                    onScrollToMessage(message.replyToMessageId);
                  } else {
                    const el = document.getElementById(`message-${message.replyToMessageId}`);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }
                }
              }}
              className={`mb-2 p-2 rounded-lg text-xs border-l-2 cursor-pointer transition-all hover:opacity-90 active:scale-[0.98] select-none ${
                isOutgoing
                  ? 'bg-black/20 border-white/80 text-white hover:bg-black/30'
                  : isLight
                  ? 'bg-slate-100 border-blue-600 text-slate-700 hover:bg-slate-200/80'
                  : 'bg-black/20 border-sky-400 text-gray-300 hover:bg-black/40'
              }`}
              title="Biriktirilgan xabarga o'tish"
            >
              <span className="font-semibold block">{message.replyToSenderName}</span>
              <span className="truncate block opacity-90">{message.replyToText}</span>
            </div>
          )}

          {/* Sender Name in Groups */}
          {!isOutgoing && message.mediaType !== 'video_note' && (
            <span
              className={`text-xs font-semibold block mb-1 ${
                isLight ? 'text-blue-600' : 'text-sky-400'
              }`}
            >
              {message.senderName}
            </span>
          )}

          {/* Sticker Attachment */}
          {message.mediaType === 'sticker' && message.mediaUrl && (
            <div className="my-1 flex justify-center">
              <img
                src={message.mediaUrl}
                alt="Sticker"
                className="w-32 h-32 object-contain hover:scale-105 transition-transform"
              />
            </div>
          )}

          {/* GIF Attachment */}
          {message.mediaType === 'gif' && message.mediaUrl && (
            <div className="my-1 rounded-xl overflow-hidden max-h-80 relative group shadow-sm">
              <img
                src={message.mediaUrl}
                alt="GIF"
                className="w-full h-full object-cover rounded-xl"
              />
              <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                GIF
              </span>
            </div>
          )}

          {/* Media Image Attachment */}
          {message.mediaType === 'image' && message.mediaUrl && (
            <div className="my-1 flex flex-col items-end">
              <div
                onClick={() => setShowImageLightbox(true)}
                className="relative rounded-2xl overflow-hidden max-h-80 cursor-pointer group shadow-md border border-white/10"
              >
                <img
                  src={message.mediaUrl}
                  alt="Attached"
                  className="w-full h-full object-cover rounded-2xl transition-transform duration-200 group-hover:scale-[1.01]"
                />
                {/* Timestamp Floating Badge over image */}
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-md border border-white/10 flex items-center gap-1 shadow-md">
                  <span>{message.timestamp}</span>
                  {isOutgoing && (
                    message.isRead ? (
                      <CheckCheck className="w-3.5 h-3.5 text-sky-300 stroke-[2.5]" />
                    ) : (
                      <Check className="w-3.5 h-3.5 opacity-80" />
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Circular Video Note ("Кружочек") - No background box, standalone circle */}
          {message.mediaType === 'video_note' && (
            <div className="my-1 flex flex-col items-center group">
              <div
                onClick={() => setShowVideoModal(true)}
                className="relative w-52 h-52 sm:w-60 sm:h-60 rounded-full overflow-hidden border-2 border-white/90 shadow-2xl cursor-pointer bg-black transition-transform hover:scale-[1.02] active:scale-98 ring-4 ring-black/10"
              >
                <video
                  src={message.mediaUrl || 'https://assets.mixkit.co/videos/preview/mixkit-womans-feet-splashing-in-the-water-41221-large.mp4'}
                  autoPlay
                  loop
                  muted={true}
                  playsInline
                  className="w-full h-full object-cover rounded-full"
                  onTimeUpdate={(e) => {
                    const target = e.target as HTMLVideoElement;
                    if (target.duration) {
                      setVideoProgress(target.currentTime / target.duration);
                    }
                  }}
                />
                

                {/* Duration Badge */}
                <div className="absolute bottom-3 right-5 bg-black/70 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-md border border-white/20 shadow-md">
                  {message.text.includes('(') ? message.text.split('(')[1].replace(')', '') : '0:08'}
                </div>
              </div>

              {/* Timestamp Floating Badge for standalone video note */}
              <div className="mt-1 flex items-center gap-1.5 bg-black/60 text-white text-[10px] px-2.5 py-0.5 rounded-full backdrop-blur-md border border-white/10 shadow-xs">
                <span>{message.timestamp}</span>
                {isOutgoing && (
                  message.isRead ? (
                    <CheckCheck className="w-3.5 h-3.5 text-sky-400 stroke-[2.5]" />
                  ) : (
                    <Check className="w-3.5 h-3.5 opacity-80" />
                  )
                )}
              </div>
            </div>
          )}

          {/* Voice Note Player */}
          {message.mediaType === 'voice' && (
            <div className="flex items-center gap-3 py-1 px-1">
              <button
                onClick={() => {
                  const newPlaying = !isPlayingVoice;
                  setIsPlayingVoice(newPlaying);
                  if (message.mediaUrl) {
                    let audioEl = document.getElementById(`audio_${message.id}`) as HTMLAudioElement;
                    if (!audioEl) {
                      audioEl = new Audio(message.mediaUrl);
                      audioEl.id = `audio_${message.id}`;
                    }
                    if (newPlaying) {
                      audioEl.playbackRate = voicePlaybackSpeed;
                      audioEl.play().catch(() => {});
                    } else {
                      audioEl.pause();
                    }
                  }
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-xs transition-transform active:scale-95 ${
                  isOutgoing
                    ? 'bg-white text-blue-600 hover:bg-slate-100'
                    : 'bg-blue-600 text-white hover:bg-blue-500'
                }`}
              >
                {isPlayingVoice ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>

              <div className="flex-1 min-w-[140px]">
                <div className="flex items-center gap-1 h-6">
                  {/* Waveform Bars */}
                  {[40, 70, 30, 90, 60, 100, 45, 80, 50, 75, 35, 95, 60, 40].map((h, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-full transition-all ${
                        isPlayingVoice && i % 3 === 0
                          ? isOutgoing
                            ? 'bg-white animate-pulse'
                            : 'bg-blue-600 animate-pulse'
                          : isOutgoing
                          ? 'bg-blue-300/80'
                          : 'bg-slate-300'
                      }`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <div
                  className={`flex justify-between items-center text-[10px] mt-1 ${
                    isOutgoing ? 'text-blue-100' : 'text-slate-500'
                  }`}
                >
                  <span>{message.text.includes('(') ? message.text.split('(')[1].replace(')', '') : '0:05'}</span>
                  <button
                    onClick={toggleVoiceSpeed}
                    className="font-bold bg-black/10 px-1.5 py-0.2 rounded hover:bg-black/20"
                  >
                    {voicePlaybackSpeed}x
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Poll Display */}
          {message.poll && (
            <div
              className={`my-2 p-3 rounded-xl border space-y-2 ${
                isOutgoing
                  ? 'bg-black/20 border-white/20'
                  : isLight
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-black/20 border-gray-700/50'
              }`}
            >
              <h4 className="font-semibold text-sm">{message.poll.question}</h4>
              <p className="text-[11px] opacity-75">
                {message.poll.isAnonymous ? 'Anonymous Poll' : 'Public Poll'}
              </p>

              <div className="space-y-2 mt-2">
                {message.poll.options.map((opt) => {
                  const totalVotes = message.poll!.options.reduce((acc, o) => acc + o.votes, 0);
                  const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                  const userId = 'user_me';
                  const isVoted = opt.voters.includes(userId);

                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        if (activeChatId) votePoll(activeChatId, message.id, opt.id);
                      }}
                      className={`w-full text-left p-2 rounded-lg border text-xs transition-all relative overflow-hidden ${
                        isVoted
                          ? isOutgoing
                            ? 'border-white bg-white/20 font-medium'
                            : 'border-blue-600 bg-blue-50 font-medium'
                          : 'border-slate-200 hover:border-blue-300 bg-white/50'
                      }`}
                    >
                      <div
                        className="absolute left-0 top-0 bottom-0 bg-blue-500/20 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                      <div className="relative flex justify-between items-center z-10">
                        <span>{opt.text}</span>
                        <span className="font-bold">{percentage}%</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Message Text */}
          {message.text && renderFormattedText(message.text)}

          {/* Bottom Reactions & Meta Info */}
          <div className="flex items-center justify-between gap-2 mt-1.5 pt-1 border-t border-black/5 text-[10px]">
            {/* Reactions */}
            <div className="flex items-center gap-1 flex-wrap">
              {message.reactions?.map((r) => {
                const hasReacted = r.users?.includes(user?.id || 'me');
                return (
                <button
                  key={r.emoji}
                  onClick={() => {
                    if (activeChatId) addReaction(activeChatId, message.id, r.emoji);
                  }}
                  className={`px-1.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 border transition-colors ${
                    hasReacted 
                      ? (isLight ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-sky-500/30 border-sky-500/50 text-sky-300')
                      : isOutgoing
                        ? 'bg-white/20 border-white/30 text-white hover:bg-white/30'
                        : isLight
                        ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                        : 'bg-black/20 border-white/10 text-gray-200 hover:bg-white/10'
                  }`}
                >
                  <span>{r.emoji}</span>
                  <span>{r.count}</span>
                </button>
              )})}

              <button
                onClick={() => setShowQuickReactions(!showQuickReactions)}
                className="p-1 rounded-full hover:bg-black/5 opacity-60 group-hover:opacity-100 transition-opacity"
              >
                <Smile className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Time & Read Status */}
            <div
              className={`flex items-center gap-1 shrink-0 ml-auto ${
                isOutgoing ? 'text-blue-100' : 'text-slate-400'
              }`}
            >
              {message.viewsCount && (
                <span className="flex items-center gap-0.5 opacity-80">
                  <Eye className="w-3 h-3" />
                  {message.viewsCount}
                </span>
              )}

              <span>{message.timestamp}</span>

              {isOutgoing && (
                <span className="inline-flex items-center ml-0.5" title={message.isRead ? 'Read (Oqildi)' : 'Delivered'}>
                  {message.isRead ? (
                    <CheckCheck className="w-4 h-4 text-sky-200 stroke-[2.5]" />
                  ) : (
                    <Check className="w-3.5 h-3.5 opacity-80" />
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Message Actions Menu (Appears Below Message Bubble on Hover) */}
      <div
        className={`opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded-lg text-xs shadow-xs border ${
          isOutgoing ? 'self-end' : 'self-start'
        } ${
          isLight
            ? 'bg-white/95 border-slate-200 backdrop-blur-xs text-slate-700'
            : 'bg-[#17212b]/95 border-gray-700 backdrop-blur-xs text-gray-200'
        }`}
      >
        <button
          onClick={() => onReplyTo(message)}
          title="Javob berish"
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors ${
            isLight
              ? 'hover:text-slate-900 hover:bg-slate-100'
              : 'hover:text-white hover:bg-gray-800'
          }`}
        >
          <Reply className="w-3 h-3" />
          <span className="text-[11px]">Javob</span>
        </button>

        <button
          onClick={() => {
            if (activeChatId) pinMessage(activeChatId, message.id);
          }}
          title="Sanchish"
          className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors ${
            isLight
              ? 'hover:text-slate-900 hover:bg-slate-100'
              : 'hover:text-white hover:bg-gray-800'
          }`}
        >
          <Pin className="w-3 h-3" />
          <span className="text-[11px]">Sanchish</span>
        </button>

        {isOutgoing && (
          <button
            onClick={() => {
              if (activeChatId) deleteMessage(activeChatId, message.id);
            }}
            title="O'chirish"
            className="flex items-center gap-1 px-1.5 py-0.5 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded transition-colors font-medium cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
            <span className="text-[11px]">O'chirish</span>
          </button>
        )}
      </div>

      {/* Centered Large Circular Video Note Modal Overlay (Telegram Style) */}
      {showVideoModal && message.mediaType === 'video_note' && (
        <div
          onClick={() => setShowVideoModal(false)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in zoom-in-95 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex flex-col items-center"
          >
            {/* Close Button */}
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute -top-12 right-0 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all shadow-lg"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Large Circle Player */}
            <div className="relative w-80 h-80 sm:w-96 sm:h-96 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-black flex items-center justify-center group ring-4 ring-white/20">
              <video
                src={message.mediaUrl || 'https://assets.mixkit.co/videos/preview/mixkit-womans-feet-splashing-in-the-water-41221-large.mp4'}
                autoPlay
                loop
                muted={false}
                playsInline
                className="w-full h-full object-cover rounded-full"
                onTimeUpdate={(e) => {
                  const target = e.target as HTMLVideoElement;
                  if (target.duration) {
                    setVideoProgress(target.currentTime / target.duration);
                  }
                }}
              />

              {/* Progress Ring */}
              <svg className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeDasharray="301.59"
                  strokeDashoffset={301.59 - (301.59 * videoProgress)}
                  strokeLinecap="round"
                />
              </svg>

              

              <div className="absolute bottom-4 bg-black/80 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md border border-white/20 shadow-md">
                {message.text.includes('(') ? message.text.split('(')[1].replace(')', '') : '0:08'}
              </div>
            </div>

            <div className="mt-4 text-center text-white">
              <span className="font-semibold text-sm block">{message.senderName}</span>
              <span className="text-xs text-slate-300 block">Video Note • {message.timestamp}</span>
            </div>
          </div>
        </div>
      )}

      {/* Image Lightbox Modal */}
      {showImageLightbox && message.mediaType === 'image' && message.mediaUrl && (
        <div
          onClick={() => setShowImageLightbox(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in"
        >
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowImageLightbox(false)}
              className="absolute -top-12 right-0 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all shadow-lg"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={message.mediaUrl}
              alt="Full size"
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-white/10"
            />
            <div className="mt-3 text-white/90 text-xs font-medium bg-black/60 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10">
              {message.text || 'Image'} • {message.timestamp}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
