const fs = require('fs');
const path = 'src/components/Chat/MessageInput.tsx';
let content = fs.readFileSync(path, 'utf8');

const effectTarget = `  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);`;

const hookTarget = `  const mediaRecorderRef = useRef<MediaRecorder | null>(null);`;
const hookReplacement = `  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const isGlobalPointerDown = useRef(false);

  useEffect(() => {
    const handleGlobalPointerUp = (e: PointerEvent) => {
      isGlobalPointerDown.current = false;
      if (isRecording) {
        // If it's a click on the Cancel or Send buttons themselves, those will handle their own onClick,
        // but we might accidentally trigger a send if they just release the mouse anywhere.
        // Actually, if we just want to allow them to release to send, it's fine.
        // But let's make sure they aren't clicking Cancel.
        const target = e.target as HTMLElement;
        if (target.closest('button[data-action="cancel"]')) return;
        
        // Also don't send if recording is less than 1 second to avoid glitches
        if (recordingSeconds >= 1) {
          stopAndSendRecording();
        }
      }
    };
    
    // We only attach this if they started recording by holding down
    if (isRecording && isHeldDownRef.current) {
      window.addEventListener('pointerup', handleGlobalPointerUp);
    }
    return () => {
      window.removeEventListener('pointerup', handleGlobalPointerUp);
    };
  }, [isRecording, recordingSeconds]);`;

content = content.replace(hookTarget, hookReplacement);

// Need to add data-action="cancel" to the cancel button
const cancelBtnTarget = `<button
              onClick={cancelRecording}
              className={\`text-xs px-3 py-1.5 rounded-xl \${
                isLight ? 'text-slate-500 hover:bg-slate-200' : 'text-gray-400 hover:bg-gray-800'
              }\`}
            >
              Cancel
            </button>`;
const cancelBtnReplacement = `<button
              data-action="cancel"
              onClick={cancelRecording}
              className={\`text-xs px-3 py-1.5 rounded-xl \${
                isLight ? 'text-slate-500 hover:bg-slate-200' : 'text-gray-400 hover:bg-gray-800'
              }\`}
            >
              Cancel
            </button>`;
content = content.replace(cancelBtnTarget, cancelBtnReplacement);

fs.writeFileSync(path, content);
