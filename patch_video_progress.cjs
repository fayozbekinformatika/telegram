const fs = require('fs');
const path = 'src/components/Chat/MessageItem.tsx';
let content = fs.readFileSync(path, 'utf8');

const hookTarget = `  const [showVideoModal, setShowVideoModal] = useState(false);`;
const hookReplacement = `  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);`;

content = content.replace(hookTarget, hookReplacement);

const videoTarget = `<video
                src={message.mediaUrl || 'https://assets.mixkit.co/videos/preview/mixkit-womans-feet-splashing-in-the-water-41221-large.mp4'}
                autoPlay
                loop
                muted={!isPlayingVoice}
                playsInline
                className="w-full h-full object-cover rounded-full"
              />`;
const videoReplacement = `<video
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
              />`;

content = content.replace(videoTarget, videoReplacement);

const dashTarget = `strokeDashoffset={301.59 * 0.2}`;
const dashReplacement = `strokeDashoffset={301.59 - (301.59 * videoProgress)}`;

content = content.replace(dashTarget, dashReplacement);

// Let's also do it for the small circular video note if there is a progress ring there.
// But wait, there wasn't a progress ring in the small one. Let's check.

fs.writeFileSync(path, content);
