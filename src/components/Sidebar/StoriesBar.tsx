import React from 'react';
import { Plus } from 'lucide-react';
import { useTelegram } from '../../context/TelegramContext';
import { useAuth } from '../../context/AuthContext';

interface StoriesBarProps {
  onOpenCreateStory: () => void;
}

export const StoriesBar: React.FC<StoriesBarProps> = ({ onOpenCreateStory }) => {
  const { stories, setActiveStoryIndex, theme } = useTelegram();
  const { user } = useAuth();
  const isLight = theme === 'light';

  return (
    <div
      className={`flex items-center gap-3 px-3.5 py-2.5 overflow-x-auto no-scrollbar border-b ${
        isLight ? 'bg-white border-slate-100' : 'bg-[#17212b] border-gray-800'
      }`}
    >
      {/* Add My Story Button */}
      <div className="flex flex-col items-center gap-1 min-w-[56px] cursor-pointer group" onClick={onOpenCreateStory}>
        <div className="relative w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-blue-500 to-indigo-600 group-hover:scale-105 transition-transform shadow-xs">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
            alt="My Avatar"
            className="w-full h-full object-cover rounded-full"
          />
          <div
            className={`absolute bottom-0 right-0 p-0.5 rounded-full border-2 ${
              isLight
                ? 'bg-blue-600 text-white border-white'
                : 'bg-[#2b5278] text-white border-[#17212b]'
            }`}
          >
            <Plus className="w-3 h-3" />
          </div>
        </div>
        <span
          className={`text-[11px] font-medium truncate max-w-[56px] ${
            isLight ? 'text-slate-600' : 'text-gray-300'
          }`}
        >
          My Story
        </span>
      </div>

      {/* Stories List */}
      {stories.map((story, idx) => (
        <div
          key={story.id}
          id={`story-item-${story.id}`}
          onClick={() => setActiveStoryIndex(idx)}
          className="flex flex-col items-center gap-1 min-w-[56px] cursor-pointer group"
        >
          <div
            className={`w-12 h-12 rounded-full p-[2px] ${
              story.isUnread
                ? 'bg-gradient-to-tr from-blue-500 via-sky-400 to-indigo-600 animate-pulse'
                : isLight
                ? 'bg-slate-200'
                : 'bg-gray-700'
            } group-hover:scale-105 transition-transform`}
          >
            <img
              src={story.userAvatar}
              alt={story.userName}
              className={`w-full h-full object-cover rounded-full border ${
                isLight ? 'border-white' : 'border-[#17212b]'
              }`}
            />
          </div>
          <span
            className={`text-[11px] font-medium truncate max-w-[60px] ${
              isLight ? 'text-slate-600' : 'text-gray-300'
            }`}
          >
            {story.userName}
          </span>
        </div>
      ))}
    </div>
  );
};
