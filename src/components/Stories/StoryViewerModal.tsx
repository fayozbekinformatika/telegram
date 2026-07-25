import React, { useState, useEffect, useRef } from 'react';
import { X, Heart, Eye, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTelegram } from '../../context/TelegramContext';

const STORY_DURATION_MS = 5000;

export const StoryViewerModal: React.FC = () => {
  const { stories, activeStoryIndex, setActiveStoryIndex } = useTelegram();
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const activeStoryIndexRef = useRef(activeStoryIndex);
  activeStoryIndexRef.current = activeStoryIndex;

  useEffect(() => {
    if (activeStoryIndex === null || !stories[activeStoryIndex]) return;

    setLiked(false);
    setComment('');
    setProgress(0);

    let startTime = Date.now();
    let accumulatedElapsed = 0;
    let animationFrameId: number;

    const updateProgress = () => {
      if (!isPaused) {
        const now = Date.now();
        const elapsed = accumulatedElapsed + (now - startTime);
        const p = Math.min((elapsed / STORY_DURATION_MS) * 100, 100);
        setProgress(p);

        if (p >= 100) {
          const currentIndex = activeStoryIndexRef.current;
          if (currentIndex !== null) {
            if (currentIndex < stories.length - 1) {
              setActiveStoryIndex(currentIndex + 1);
            } else {
              setActiveStoryIndex(null);
            }
          }
          return;
        }
      } else {
        startTime = Date.now();
      }

      animationFrameId = requestAnimationFrame(updateProgress);
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [activeStoryIndex, stories.length, setActiveStoryIndex, isPaused]);

  if (activeStoryIndex === null || !stories[activeStoryIndex]) return null;

  const currentStory = stories[activeStoryIndex];

  const handleNext = () => {
    if (activeStoryIndex < stories.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
      setLiked(false);
    } else {
      setActiveStoryIndex(null);
    }
  };

  const handlePrev = () => {
    if (activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
      setLiked(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center backdrop-blur-md animate-in fade-in duration-200">
      {/* Close Button */}
      <button
        onClick={() => setActiveStoryIndex(null)}
        className="absolute top-4 right-4 z-50 p-2 text-white/80 hover:text-white bg-black/40 hover:bg-black/70 rounded-full"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Story Player Container */}
      <div className="relative w-full max-w-md h-full sm:h-[85vh] sm:rounded-3xl bg-[#17212b] overflow-hidden shadow-2xl flex flex-col border border-gray-800">
        {/* Progress Bars */}
        <div className="absolute top-3 left-3 right-3 z-30 flex items-center gap-1.5">
          {stories.map((st, i) => (
            <div
              key={st.id}
              className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-white transition-none"
                style={{
                  width:
                    i < activeStoryIndex
                      ? '100%'
                      : i === activeStoryIndex
                      ? `${progress}%`
                      : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* User Info Header */}
        <div className="absolute top-6 left-4 right-4 z-30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src={currentStory.userAvatar}
              alt={currentStory.userName}
              className="w-9 h-9 rounded-full object-cover border-2 border-sky-400"
            />
            <div>
              <h3 className="text-xs font-bold text-white shadow-xs">{currentStory.userName}</h3>
              <p className="text-[10px] text-gray-300">{currentStory.timestamp}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-white/90 text-xs bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-xs">
            <Eye className="w-3.5 h-3.5" />
            <span>{currentStory.viewsCount || 102}</span>
          </div>
        </div>

        {/* Story Media Image */}
        <div
          className="flex-1 relative bg-black flex items-center justify-center select-none"
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <img
            src={currentStory.mediaUrl}
            alt="Story"
            className="w-full h-full object-cover pointer-events-none"
          />

          {/* Left / Right Nav Click Hotspots */}
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/60 rounded-full text-white/80 hover:text-white z-20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/60 rounded-full text-white/80 hover:text-white z-20"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Caption & Bottom Bar */}
        <div className="p-4 bg-gradient-to-t from-black via-black/80 to-transparent space-y-3 z-30">
          {currentStory.caption && (
            <p className="text-xs text-white font-medium text-center line-clamp-2">
              {currentStory.caption}
            </p>
          )}

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Reply to story..."
              value={comment}
              onFocus={() => setIsPaused(true)}
              onBlur={() => setIsPaused(false)}
              onChange={(e) => setComment(e.target.value)}
              className="flex-1 bg-white/10 text-white text-xs px-3.5 py-2.5 rounded-full border border-white/20 focus:outline-none placeholder:text-gray-400"
            />

            <button
              onClick={() => setLiked(!liked)}
              className={`p-2.5 rounded-full transition-transform ${
                liked ? 'text-red-500 scale-110' : 'text-white/80 hover:text-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-red-500' : ''}`} />
            </button>

            <button
              onClick={() => {
                if (comment.trim()) {
                  setComment('');
                  alert('Story reply sent!');
                }
              }}
              className="p-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-full"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
