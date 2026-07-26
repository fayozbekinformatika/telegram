import React, { useState } from 'react';
import { Camera, Image as ImageIcon, Clipboard, Smile, Check, Plus } from 'lucide-react';
import { useTelegram } from '../../context/TelegramContext';
import { useToast } from '../../context/ToastContext';
import { ChatType } from '../../types/telegram';

interface NewChatModalProps {
  isOpen: boolean;
  type: 'group' | 'channel' | 'secret' | null;
  onClose: () => void;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({ isOpen, type, onClose }) => {
  const { createNewChat, theme } = useTelegram();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);

  const isLight = theme === 'light';

  if (!isOpen || !type) return null;

  const handleCreate = () => {
    if (!name.trim()) return;
    createNewChat(name.trim(), type as ChatType, '', description.trim());
    setName('');
    setDescription('');
    setShowPhotoMenu(false);
    onClose();
  };
  
  const handleCancel = () => {
    setName('');
    setDescription('');
    setShowPhotoMenu(false);
    onClose();
  };

  const bgModal = isLight ? 'bg-white text-slate-800 border-slate-200' : 'bg-[#17212b] text-white border-white/5';
  const textSub = isLight ? 'text-slate-500' : 'text-gray-400';
  const borderCol = isLight ? 'border-slate-300' : 'border-sky-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={handleCancel} />
      
      <div className={`relative w-full max-w-[320px] rounded-xl shadow-2xl z-10 ${bgModal} p-5 animate-in fade-in zoom-in-95`}>
        
        <div className="flex gap-4">
          <div className="relative">
            <button 
              onClick={() => setShowPhotoMenu(!showPhotoMenu)}
              className="w-14 h-14 rounded-full bg-sky-500 hover:bg-sky-400 flex items-center justify-center transition-colors text-white"
            >
              <Camera className="w-6 h-6" />
            </button>
            
            {showPhotoMenu && (
              <div className={`absolute top-0 left-16 w-48 rounded-xl shadow-2xl py-1 z-20 animate-in fade-in zoom-in-95 ${bgModal}`}>
                <button onClick={(e) => showToast(e.currentTarget.textContent || "Coming soon")} className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-black/10 transition-colors`}>
                  <ImageIcon className="w-5 h-5 text-gray-400" />
                  <span>File</span>
                </button>
                <button onClick={(e) => showToast(e.currentTarget.textContent || "Coming soon")} className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-black/10 transition-colors`}>
                  <Camera className="w-5 h-5 text-gray-400" />
                  <span>Camera</span>
                </button>
                <button onClick={(e) => showToast(e.currentTarget.textContent || "Coming soon")} className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-black/10 transition-colors`}>
                  <Clipboard className="w-5 h-5 text-gray-400" />
                  <span>From clipboard</span>
                </button>
                <button onClick={(e) => showToast(e.currentTarget.textContent || "Coming soon")} className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-black/10 transition-colors`}>
                  <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold">NO</div>
                  <span>Use an Emoji</span>
                </button>
              </div>
            )}
          </div>
          
          <div className="flex-1 flex flex-col justify-center gap-4">
            <div className="relative">
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full bg-transparent border-b ${borderCol} focus:outline-none pb-1 text-[15px] ${isLight ? 'text-slate-800' : 'text-white'}`} 
              />
              <label className={`absolute ${name ? '-top-4 text-xs' : 'top-0 text-[15px]'} left-0 transition-all text-sky-500 pointer-events-none`}>
                {type === 'group' ? 'Group name' : type === 'channel' ? 'Channel name' : 'Contact name'}
              </label>
            </div>
            
            {type === 'channel' && (
              <div className="relative">
                <input 
                  type="text" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`w-full bg-transparent border-b ${isLight ? 'border-slate-300' : 'border-gray-600'} focus:border-sky-500 focus:outline-none pb-1 text-[15px] ${isLight ? 'text-slate-800' : 'text-white'}`} 
                />
                <label className={`absolute ${description ? '-top-4 text-xs text-sky-500' : `top-0 text-[15px] ${textSub}`} left-0 transition-all pointer-events-none`}>
                  Description (optional)
                </label>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end gap-4 mt-6">
          <button onClick={handleCancel} className="text-sky-500 font-medium hover:text-sky-600">Cancel</button>
          <button onClick={handleCreate} className="text-sky-500 font-medium hover:text-sky-600">
            {type === 'group' ? 'Next' : 'Create'}
          </button>
        </div>
        
      </div>
    </div>
  );
};
