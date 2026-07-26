const fs = require('fs');
const path = 'src/components/Chat/MessageItem.tsx';
let content = fs.readFileSync(path, 'utf8');

const smallVideoTarget = `muted={!isPlayingVoice}
                  playsInline
                  className="w-full h-full object-cover rounded-full"
                  onTimeUpdate`;

const smallVideoReplacement = `muted={true}
                  playsInline
                  className="w-full h-full object-cover rounded-full"
                  onTimeUpdate`;

content = content.replace(smallVideoTarget, smallVideoReplacement);

const largeVideoTarget = `muted={!isPlayingVoice}
                playsInline
                className="w-full h-full object-cover rounded-full"
                onTimeUpdate`;

const largeVideoReplacement = `muted={false}
                playsInline
                className="w-full h-full object-cover rounded-full"
                onTimeUpdate`;

content = content.replace(largeVideoTarget, largeVideoReplacement);
fs.writeFileSync(path, content);
