const fs = require('fs');
const path = 'src/components/Chat/MessageItem.tsx';
let content = fs.readFileSync(path, 'utf8');

const smallVideoTarget = `<video
                  src={message.mediaUrl || 'https://assets.mixkit.co/videos/preview/mixkit-womans-feet-splashing-in-the-water-41221-large.mp4'}
                  autoPlay
                  loop
                  muted={!isPlayingVoice}
                  playsInline
                  className="w-full h-full object-cover rounded-full"
                />`;

const smallVideoReplacement = `<video
                  src={message.mediaUrl || 'https://assets.mixkit.co/videos/preview/mixkit-womans-feet-splashing-in-the-water-41221-large.mp4'}
                  autoPlay
                  loop
                  muted={!isPlayingVoice}
                  playsInline
                  className="w-full h-full object-cover rounded-full"
                  onTimeUpdate={(e) => {
                    const target = e.target as HTMLVideoElement;
                    if (target.duration) {
                      setVideoProgress(target.currentTime / target.duration);
                    }
                  }}
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
                    strokeDashoffset={301.59 - (301.59 * videoProgress)}
                    strokeLinecap="round"
                  />
                </svg>`;

content = content.replace(smallVideoTarget, smallVideoReplacement);
fs.writeFileSync(path, content);
