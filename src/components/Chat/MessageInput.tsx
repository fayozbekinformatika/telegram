import React, { useState, useRef } from 'react';
import {
  Send,
  Paperclip,
  Smile,
  Mic,
  Video,
  Sparkles,
  X,
  Image as ImageIcon,
  FileText,
  BarChart2,
  MapPin,
  Loader2,
  Square,
} from 'lucide-react';
import { useTelegram } from '../../context/TelegramContext';
import { StickerEmojiPicker } from './StickerEmojiPicker';
import { Message } from '../../types/telegram';

interface MessageInputProps {
  chatId: string;
  replyToMessage: Message | null;
  onCancelReply: () => void;
  onOpenCreatePoll: () => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  chatId,
  replyToMessage,
  onCancelReply,
  onOpenCreatePoll,
}) => {
  const { sendMessage, rewriteMessageWithAI, theme } = useTelegram();
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showAIRewriteMenu, setShowAIRewriteMenu] = useState(false);
  const [isRewritingAI, setIsRewritingAI] = useState(false);
  
  // Voice & Circular Video Recording state
  const [recordMode, setRecordMode] = useState<'voice' | 'video'>('voice');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordingTimerRef = useRef<any>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isLight = theme === 'light';

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(chatId, text.trim(), undefined, undefined, undefined, replyToMessage?.id);
    setText('');
    onCancelReply();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAIRewrite = async (style: string) => {
    if (!text.trim()) return;
    setIsRewritingAI(true);
    setShowAIRewriteMenu(false);
    const rewritten = await rewriteMessageWithAI(text, style);
    setText(rewritten);
    setIsRewritingAI(false);
  };

  const handleSelectEmoji = (emoji: string) => {
    setText((prev) => prev + emoji);
  };

  const handleSelectSticker = (stickerUrl: string) => {
    sendMessage(chatId, '', 'sticker', stickerUrl, undefined, replyToMessage?.id);
    onCancelReply();
  };

  const handleSelectGif = (gifUrl: string) => {
    sendMessage(chatId, '', 'gif', gifUrl, undefined, replyToMessage?.id);
    onCancelReply();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        sendMessage(chatId, text || file.name, 'image', url, undefined, replyToMessage?.id);
        setText('');
        onCancelReply();
      };
      reader.readAsDataURL(file);
    }
  };

  const startRecording = async () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    recordedChunksRef.current = [];

    recordingTimerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);

    try {
      if (recordMode === 'video') {
        // Real Video Note recording (Webcam circular stream)
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 360, height: 360, facingMode: 'user' },
          audio: true,
        });
        mediaStreamRef.current = stream;

        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = stream;
        }

        const options = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
          ? { mimeType: 'video/webm;codecs=vp9' }
          : MediaRecorder.isTypeSupported('video/webm')
          ? { mimeType: 'video/webm' }
          : {};

        const mediaRecorder = new MediaRecorder(stream, options);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            recordedChunksRef.current.push(e.data);
          }
        };

        mediaRecorder.start(200);
      } else {
        // Real Voice Note recording (Microphone audio)
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

        const options = MediaRecorder.isTypeSupported('audio/webm')
          ? { mimeType: 'audio/webm' }
          : {};

        const mediaRecorder = new MediaRecorder(stream, options);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            recordedChunksRef.current.push(e.data);
          }
        };

        mediaRecorder.start(200);
      }
    } catch (err) {
      console.warn('Camera/Microphone access fallback enabled:', err);
    }
  };

  const stopAndSendRecording = () => {
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    const finalSeconds = recordingSeconds || 5;
    const durationStr = `0:${finalSeconds < 10 ? '0' : ''}${finalSeconds}`;

    const recorder = mediaRecorderRef.current;

    const finishSend = (dataUrl?: string) => {
      setIsRecording(false);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
      mediaRecorderRef.current = null;

      if (recordMode === 'video') {
        const fallbackUrl = 'https://assets.mixkit.co/videos/preview/mixkit-womans-feet-splashing-in-the-water-41221-large.mp4';
        sendMessage(
          chatId,
          `🎥 Video Note (${durationStr})`,
          'video_note',
          dataUrl || fallbackUrl,
          undefined,
          replyToMessage?.id
        );
      } else {
        sendMessage(
          chatId,
          `🎙 Voice Message (${durationStr})`,
          'voice',
          dataUrl || undefined,
          undefined,
          replyToMessage?.id
        );
      }
      onCancelReply();
      setRecordingSeconds(0);
    };

    if (recorder && recorder.state !== 'inactive') {
      recorder.onstop = () => {
        const mimeType = recordMode === 'video' ? 'video/webm' : 'audio/webm';
        const blob = new Blob(recordedChunksRef.current, { type: mimeType });
        if (blob.size > 0) {
          const reader = new FileReader();
          reader.onloadend = () => {
            finishSend(reader.result as string);
          };
          reader.readAsDataURL(blob);
        } else {
          finishSend();
        }
      };
      recorder.stop();
    } else {
      finishSend();
    }
  };

  const cancelRecording = () => {
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsRecording(false);
    setRecordingSeconds(0);
  };

  return (
    <div
      className={`relative px-4 py-1.5 border-t ${
        isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#17212b] border-[#0e1621]'
      }`}
    >
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Reply-To Preview Bar */}
      {replyToMessage && (
        <div
          className={`flex items-center justify-between px-3 py-1.5 rounded-xl mb-2 border-l-2 ${
            isLight
              ? 'bg-slate-100 border-blue-600'
              : 'bg-[#0e1621] border-sky-500'
          }`}
        >
          <div className="text-xs min-w-0">
            <span
              className={`font-semibold block ${isLight ? 'text-blue-600' : 'text-sky-400'}`}
            >
              {replyToMessage.senderName}
            </span>
            <span className={`truncate block ${isLight ? 'text-slate-600' : 'text-gray-300'}`}>
              {replyToMessage.text}
            </span>
          </div>
          <button
            onClick={onCancelReply}
            className={`p-1 ${isLight ? 'text-slate-400 hover:text-slate-700' : 'text-gray-400 hover:text-white'}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* AI Text Rewrite Popover */}
      {showAIRewriteMenu && (
        <div
          className={`absolute bottom-16 left-12 border p-2 rounded-2xl shadow-xl z-30 space-y-1 w-56 animate-in fade-in zoom-in-95 ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#17212b] border-gray-700'
          }`}
        >
          <p className="text-[11px] font-bold text-amber-500 px-2.5 py-1 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Gemini AI Rewrite
          </p>
          <button
            onClick={() => handleAIRewrite('grammar')}
            className={`w-full text-left px-2.5 py-1.5 text-xs rounded-xl flex items-center justify-between ${
              isLight
                ? 'text-slate-700 hover:bg-slate-100'
                : 'text-gray-200 hover:bg-[#202b36]'
            }`}
          >
            <span>Fix Grammar & Spelling</span>
            <span className="text-[10px] text-slate-400">Auto</span>
          </button>
          <button
            onClick={() => handleAIRewrite('formal')}
            className={`w-full text-left px-2.5 py-1.5 text-xs rounded-xl flex items-center justify-between ${
              isLight
                ? 'text-slate-700 hover:bg-slate-100'
                : 'text-gray-200 hover:bg-[#202b36]'
            }`}
          >
            <span>Rasmiy Style (Formal)</span>
            <span>🤝</span>
          </button>
          <button
            onClick={() => handleAIRewrite('short')}
            className={`w-full text-left px-2.5 py-1.5 text-xs rounded-xl flex items-center justify-between ${
              isLight
                ? 'text-slate-700 hover:bg-slate-100'
                : 'text-gray-200 hover:bg-[#202b36]'
            }`}
          >
            <span>Qisqa Style (Short)</span>
            <span>🎯</span>
          </button>
          <button
            onClick={() => handleAIRewrite('zen')}
            className={`w-full text-left px-2.5 py-1.5 text-xs rounded-xl flex items-center justify-between ${
              isLight
                ? 'text-slate-700 hover:bg-slate-100'
                : 'text-gray-200 hover:bg-[#202b36]'
            }`}
          >
            <span>Zen / Yengil Style</span>
            <span>🗿</span>
          </button>
        </div>
      )}

      {/* Attachment Popover */}
      {showAttachmentMenu && (
        <div
          className={`absolute bottom-16 left-4 border p-2 rounded-2xl shadow-xl z-30 space-y-1 w-48 animate-in fade-in zoom-in-95 ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#17212b] border-gray-700'
          }`}
        >
          <button
            onClick={() => {
              setShowAttachmentMenu(false);
              fileInputRef.current?.click();
            }}
            className={`w-full text-left px-3 py-2 text-xs rounded-xl flex items-center gap-2.5 ${
              isLight ? 'text-slate-700 hover:bg-slate-100' : 'text-gray-200 hover:bg-[#202b36]'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-blue-600" />
            <span>Photo or Video</span>
          </button>

          <button
            onClick={() => {
              setShowAttachmentMenu(false);
              onOpenCreatePoll();
            }}
            className={`w-full text-left px-3 py-2 text-xs rounded-xl flex items-center gap-2.5 ${
              isLight ? 'text-slate-700 hover:bg-slate-100' : 'text-gray-200 hover:bg-[#202b36]'
            }`}
          >
            <BarChart2 className="w-4 h-4 text-emerald-500" />
            <span>Poll / Quiz</span>
          </button>

          <button
            onClick={() => {
              setShowAttachmentMenu(false);
              sendMessage(
                chatId,
                '📍 Shared Location: Tashkent, Uzbekistan (41.2995° N, 69.2401° E)',
                'file'
              );
            }}
            className={`w-full text-left px-3 py-2 text-xs rounded-xl flex items-center gap-2.5 ${
              isLight ? 'text-slate-700 hover:bg-slate-100' : 'text-gray-200 hover:bg-[#202b36]'
            }`}
          >
            <MapPin className="w-4 h-4 text-amber-500" />
            <span>Location</span>
          </button>
        </div>
      )}

      {/* Sticker & Emoji Picker */}
      {showEmojiPicker && (
        <StickerEmojiPicker
          onSelectEmoji={handleSelectEmoji}
          onSelectSticker={handleSelectSticker}
          onSelectGif={handleSelectGif}
          onClose={() => setShowEmojiPicker(false)}
        />
      )}

      {/* Floating Webcam Circular Video Note Preview Modal during recording (Centered in screen) */}
      {isRecording && recordMode === 'video' && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center p-4 pb-20 animate-in fade-in zoom-in-95">
          <div className="flex flex-col items-center">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full border-4 border-white/90 shadow-2xl overflow-hidden bg-black flex items-center justify-center ring-4 ring-white/20">
              <video
                ref={videoPreviewRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover rounded-full transform -scale-x-100"
              />
              <svg className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="3"
                  strokeDasharray="301.59"
                  strokeDashoffset={301.59 - (301.59 * Math.min(recordingSeconds, 60)) / 60}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              </svg>
              <div className="absolute top-4 bg-red-600/90 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md shadow-md uppercase tracking-wider flex items-center gap-2 z-10 border border-white/20">
                <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                0:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}
              </div>
            </div>
            <span className="text-xs font-medium mt-3 text-white bg-black/80 px-3 py-1 rounded-full backdrop-blur-md border border-white/20 shadow-lg">
              🎥 Circular Video Note (Кружочек)
            </span>
          </div>
        </div>
      )}

      {/* Voice / Circular Video Note Recording Bar */}
      {isRecording ? (
        <div
          className={`flex items-center justify-between p-2.5 rounded-2xl border animate-pulse ${
            recordMode === 'video'
              ? 'bg-blue-600/10 border-blue-500/50 text-blue-500'
              : isLight
              ? 'bg-red-50 border-red-200 text-red-600'
              : 'bg-[#0e1621] border-red-500/30 text-red-500'
          }`}
        >
          <div className="flex items-center gap-3">
            {recordMode === 'video' ? (
              <div className="relative w-8 h-8 rounded-full border-2 border-blue-500 overflow-hidden flex items-center justify-center bg-blue-500/20">
                <Video className="w-4 h-4 text-blue-500 animate-bounce" />
              </div>
            ) : (
              <div className="w-3 h-3 rounded-full bg-red-500 animate-ping ml-2" />
            )}
            <span className="text-xs font-mono font-bold">
              {recordMode === 'video' ? 'Recording Video Note (Кружочек)...' : 'Recording Voice Note...'} 0:0{recordingSeconds}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={cancelRecording}
              className={`text-xs px-3 py-1.5 rounded-xl ${
                isLight ? 'text-slate-500 hover:bg-slate-200' : 'text-gray-400 hover:bg-gray-800'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={stopAndSendRecording}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Standard Message Bar */
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Attachment Button */}
          <button
            onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
            className={`p-2 rounded-full transition-colors ${
              isLight
                ? 'text-slate-400 hover:text-blue-600 hover:bg-slate-100'
                : 'text-gray-400 hover:text-sky-400'
            }`}
          >
            <Paperclip className="w-6 h-6 p-0.5" />
          </button>

          {/* Text Input Field */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Write a message..."
              className={`w-full text-[15px] px-2 py-2 outline-none transition-all ${
                isLight
                  ? 'bg-transparent text-slate-800 placeholder:text-slate-400'
                  : 'bg-transparent text-white placeholder:text-gray-500'
              }`}
            />
          </div>

          {/* Sticker / Emoji Toggle */}
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`p-2 transition-colors ${
              isLight ? 'text-slate-400 hover:text-slate-700' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Smile className="w-6 h-6 p-0.5" />
          </button>

          {/* Send or Voice/Video Note Button */}
          {text.trim() ? (
            <button
              onClick={handleSend}
              className="p-2 text-blue-500 hover:text-blue-600 transition-colors"
            >
              <Send className="w-6 h-6 p-0.5" />
            </button>
          ) : (
            <div className="relative group flex items-center">
              {/* Primary Telegram Record Button */}
              <button
                onClick={startRecording}
                title="Ovozli xabar yozishni boshlash"
                className={`p-2 transition-colors ${
                  isLight
                    ? 'text-slate-500 hover:text-blue-600'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Mic className="w-6 h-6 p-0.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
