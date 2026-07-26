const fs = require('fs');
const path = 'src/components/Chat/MessageInput.tsx';
let content = fs.readFileSync(path, 'utf8');

const target = `        if (recordingSeconds >= 1) {
          stopAndSendRecording();
        }`;
const replacement = `        if (recordingSeconds >= 1) {
          stopAndSendRecording();
        } else {
          cancelRecording();
        }`;
content = content.replace(target, replacement);

fs.writeFileSync(path, content);
