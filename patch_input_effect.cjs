const fs = require('fs');
const path = 'src/components/Chat/MessageInput.tsx';
let content = fs.readFileSync(path, 'utf8');

const target = `    if (isRecording && isHeldDownRef.current) {
      window.addEventListener('pointerup', handleGlobalPointerUp);
    }`;

const replacement = `    if (isRecording) {
      window.addEventListener('pointerup', handleGlobalPointerUp);
    }`;

content = content.replace(target, replacement);
fs.writeFileSync(path, content);
