const fs = require('fs');
const path = 'src/components/Chat/MessageInput.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add clickTimeoutRef and handleRecord functions
const refHookTarget = `  const recordingTimerRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);`;
const refHookReplacement = `  const recordingTimerRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const clickTimeoutRef = useRef<any>(null);
  const isHeldDownRef = useRef<boolean>(false);
  
  const handleRecordDown = (e: React.PointerEvent) => {
    isHeldDownRef.current = true;
    clickTimeoutRef.current = setTimeout(() => {
      clickTimeoutRef.current = null;
      if (isHeldDownRef.current) {
        startRecording();
      }
    }, 250);
  };

  const handleRecordUp = (e: React.PointerEvent) => {
    isHeldDownRef.current = false;
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      setRecordMode(prev => prev === 'voice' ? 'video' : 'voice');
    } else if (isRecording) {
      // They released after long press started recording
      // To keep it simple, we could stop and send here, but since the UI changes and the button unmounts,
      // this pointerUp might not reliably fire if the button is replaced by the recording bar.
      // So let's just let them use the Cancel/Send buttons in the recording bar.
    }
  };

  const handleRecordLeave = (e: React.PointerEvent) => {
    isHeldDownRef.current = false;
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }
  };
`;
content = content.replace(refHookTarget, refHookReplacement);

// 2. Replace the record button rendering
const buttonTarget = `              {/* Primary Telegram Record Button */}
              <button
                onClick={startRecording}
                title="Ovozli xabar yozishni boshlash"
                className={\`p-2 transition-colors \${
                  isLight
                    ? 'text-slate-500 hover:text-blue-600'
                    : 'text-gray-400 hover:text-white'
                }\`}
              >
                <Mic className="w-6 h-6 p-0.5" />
              </button>`;
const buttonReplacement = `              {/* Primary Telegram Record Button */}
              <button
                onPointerDown={handleRecordDown}
                onPointerUp={handleRecordUp}
                onPointerLeave={handleRecordLeave}
                onContextMenu={(e) => e.preventDefault()}
                title={recordMode === 'voice' ? "Ovozli xabar yozish" : "Video xabar yozish"}
                className={\`p-2 transition-colors touch-none \${
                  isLight
                    ? 'text-slate-500 hover:text-blue-600'
                    : 'text-gray-400 hover:text-white'
                }\`}
              >
                {recordMode === 'voice' ? (
                  <Mic className="w-6 h-6 p-0.5" />
                ) : (
                  <Video className="w-6 h-6 p-0.5" />
                )}
              </button>`;
content = content.replace(buttonTarget, buttonReplacement);

fs.writeFileSync(path, content);
