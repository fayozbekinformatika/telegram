const fs = require('fs');
let code = fs.readFileSync('src/components/Calls/CallWindowModal.tsx', 'utf-8');

// Replace state
code = code.replace(
  'const [callDuration, setCallDuration] = useState(0);',
  `const [callDuration, setCallDuration] = useState(0);
  const [callState, setCallState] = useState<'ringing' | 'connected' | 'ended'>('ringing');
  const ringtoneRef = useRef<HTMLAudioElement | null>(null);`
);

// Replace useEffect for timer and ringing
code = code.replace(
  /useEffect\(\(\) => \{\s*if \(\!activeCall\) return;\s*const timer = setInterval\(\(\) => \{\s*setCallDuration\(\(prev\) => prev \+ 1\);\s*\}, 1000\);\s*return \(\) => clearInterval\(timer\);\s*\}, \[activeCall\]\);/,
  `useEffect(() => {
    if (!activeCall) return;

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
  }, [callState]);`
);

// Replace duration rendering
code = code.replace(
  /\{callDuration > 0 \? formatTime\(callDuration\) : 'Connecting\.\.\.'\}/g,
  `{callState === 'ringing' ? 'Ringing...' : callState === 'ended' ? 'Call Ended' : formatTime(callDuration)}`
);

// Enhance video rendering to add a PIP
code = code.replace(
  /<div className="relative w-full h-full flex items-center justify-center bg-black">\s*<video\s*ref=\{localVideoRef\}\s*autoPlay\s*playsInline\s*muted\s*className="w-full h-full object-cover transform scale-x-\[-1\]"\s*\/>\s*<div className="absolute top-4 left-4 bg-black\/60 px-3 py-1 rounded-full text-xs text-white">\s*Live Video Feed\s*<\/div>\s*<\/div>/,
  `<div className="relative w-full h-full flex items-center justify-center bg-black">
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
            </div>`
);

fs.writeFileSync('src/components/Calls/CallWindowModal.tsx', code);
