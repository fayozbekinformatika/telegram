import React, { useState } from 'react';
import { X, Image as ImageIcon, Send } from 'lucide-react';
import { useTelegram } from '../../context/TelegramContext';

interface StoryCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StoryCreatorModal: React.FC<StoryCreatorModalProps> = ({ isOpen, onClose }) => {
  const { addStory } = useTelegram();
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');

  if (!isOpen) return null;

  const sampleImages = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
  ];

  const handlePost = () => {
    const finalUrl = imageUrl.trim() || sampleImages[0];
    addStory(finalUrl, caption.trim());
    setImageUrl('');
    setCaption('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#17212b] text-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>📸</span> Create Telegram Story
          </h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">
              Image URL or Choose Preset
            </label>
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-[#0e1621] text-xs text-white p-3 rounded-xl border border-gray-700 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {sampleImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setImageUrl(img)}
                className={`h-20 rounded-xl overflow-hidden border-2 transition-all ${
                  imageUrl === img ? 'border-sky-500 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="Preset" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">
              Story Caption
            </label>
            <textarea
              placeholder="Add a text caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={2}
              className="w-full bg-[#0e1621] text-xs text-white p-3 rounded-xl border border-gray-700 focus:outline-none focus:border-sky-500 resize-none"
            />
          </div>
        </div>

        <div className="p-4 border-t border-gray-800 flex justify-end gap-2 bg-[#0e1621]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white rounded-xl hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handlePost}
            className="px-5 py-2 text-xs font-bold bg-sky-500 hover:bg-sky-400 text-white rounded-xl flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" /> Post Story
          </button>
        </div>
      </div>
    </div>
  );
};
