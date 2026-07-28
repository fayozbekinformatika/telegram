import React, { useState, useEffect, useRef } from 'react';
import { PhoneOff, Mic, MicOff, Video, VideoOff, ShieldCheck, Monitor } from 'lucide-react';
import { useTelegram } from '../../context/TelegramContext';

export const CallWindowModal: React.FC = () => {
  const { activeCall, endCall } = useTelegram();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(activeCall?.isVideo || false);
  const [callDuration, setCallDuration] = useState(0);
  const [callState, setCallState] = useState<'ringing' | 'connected' | 'ended'>('ringing');
  const ringtoneRef = useRef<HTMLAudioElement | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!activeCall) {
      // Reset call duration when active call is cleared
      setCallDuration(0);
      setCallState('ringing');
      return;
    }

    setCallDuration(0);
    setCallState('ringing');
    setIsVideoOn(activeCall.isVideo || false);
    setIsMuted(false);

    // Start ringing
    const audio = new Audio('https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg');
    audio.loop = true;
    audio.volume = 0.5;
    ringtoneRef.current = audio;
    
    // Auto answer after 3 seconds
    const answerTimeout = setTimeout(() => {
      setCallState('connected');
    }, 3000);

    return () => {
      clearTimeout(answerTimeout);
      if (ringtoneRef.current) {
        ringtoneRef.current.pause();
        ringtoneRef.current.currentTime = 0;
      }
    };
  }, [activeCall]);

  useEffect(() => {
    if (callState === 'ringing' && ringtoneRef.current) {
      ringtoneRef.current.play().catch(e => console.warn('Audio play failed', e));
    } else if (callState === 'connected' && ringtoneRef.current) {
      ringtoneRef.current.pause();
    }
  }, [callState]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (callState === 'connected') {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callState]);

  useEffect(() => {
    if (activeCall && isVideoOn) {
      navigator.mediaDevices
        ?.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          streamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.warn('Camera access denied or unavailable:', err);
        });
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [activeCall, isVideoOn]);

  if (!activeCall) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#17212b] rounded-3xl overflow-hidden shadow-2xl border border-gray-800 flex flex-col h-[80vh]">
        {/* End-to-End Encryption Verification Bar */}
        <div className="bg-[#0e1621] px-4 py-2 flex items-center justify-between border-b border-gray-800 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" /> End-to-End Encrypted Call
          </div>
          <div className="flex items-center gap-1 text-base tracking-widest bg-black/40 px-2.5 py-0.5 rounded-full border border-gray-700">
            <span>🔒</span>
            <span>🥑</span>
            <span>🚀</span>
            <span>💎</span>
          </div>
        </div>

        {/* Video / Avatar Canvas Area */}
        <div className="flex-1 relative bg-gradient-to-b from-[#1e2c3a] to-[#0e1621] flex items-center justify-center overflow-hidden">
          {isVideoOn ? (
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              {/* Fake remote video (just a blurred version of local or avatar) */}
              <div className="absolute inset-0 flex items-center justify-center bg-[#17212b]">
                 <img src={activeCall.avatar || 'https://telegram.org/img/t_logo.png'} className="w-full h-full object-cover opacity-30 blur-sm" alt="remote" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    {callState === 'ringing' ? (
                      <div className="text-white text-xl animate-pulse">Waiting for answer...</div>
                    ) : (
                      <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white/20">
                         <img src={activeCall.avatar || 'https://telegram.org/img/t_logo.png'} className="w-full h-full object-cover" alt="remote" />
                      </div>
                    )}
                 </div>
              </div>
              
              {/* Local Video PIP */}
              <div className="absolute bottom-6 right-6 w-28 h-40 bg-black rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl z-10">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform scale-x-[-1]"
                />
              </div>
              <div className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded-full text-xs text-white z-10">
                End-to-End Encrypted
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-sky-500/40 shadow-2xl animate-pulse">
                <img
                  src={activeCall.avatar || 'https://telegram.org/img/t_logo.png'}
                  alt={activeCall.chatName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-1">{activeCall.chatName}</h3>
                <p className="text-xs text-sky-400 font-mono font-bold">
                  {callState === 'ringing' ? 'Ringing...' : callState === 'ended' ? 'Call Ended' : formatTime(callDuration)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Call Action Controls */}
        <div className="p-6 bg-[#0e1621] border-t border-gray-800 flex items-center justify-center gap-6">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-4 rounded-full transition-all ${
              isMuted ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          <button
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`p-4 rounded-full transition-all ${
              !isVideoOn ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-sky-500 text-white hover:bg-sky-400'
            }`}
          >
            {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
          </button>

          <button
            onClick={() => alert('Screen sharing initialized.')}
            className="p-4 bg-gray-800 hover:bg-gray-700 text-white rounded-full transition-all"
          >
            <Monitor className="w-6 h-6" />
          </button>

          <button
            onClick={endCall}
            className="p-4 bg-red-600 hover:bg-red-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
