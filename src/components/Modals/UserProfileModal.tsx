import React from 'react';
import { X, QrCode } from 'lucide-react';
import { User } from '../../types/telegram';
import { useTelegram } from '../../context/TelegramContext';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, user }) => {
  const { theme } = useTelegram();
  const isLight = theme === 'light';

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={`relative w-[340px] rounded-xl shadow-2xl z-10 animate-in fade-in zoom-in-95 flex flex-col overflow-hidden ${
          isLight ? 'bg-white text-slate-800' : 'bg-[#17212b] text-white'
        }`}
      >
        {/* Top Header Actions */}
        <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
          <button className="p-2 rounded-full hover:bg-black/10 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/10 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* User Info Header Section (Gradient Background) */}
        <div className={`pt-6 pb-4 px-4 relative flex flex-col items-center ${isLight ? 'bg-blue-500' : 'bg-[#1e2c3a]'}`}>
          <div className="w-24 h-24 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center text-4xl font-bold mb-3 border-2 border-[#1e2c3a]">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              (user.name || 'U')[0]
            )}
          </div>
          <h2 className="text-xl font-medium text-white mb-0.5">{user.name}</h2>
          <p className="text-sm text-sky-400">online</p>
        </div>

        {/* Details Section */}
        <div className={`p-4 flex flex-col ${isLight ? 'bg-white' : 'bg-[#17212b]'}`}>
          {/* Phone */}
          <div className="flex flex-col py-2">
            <span className={`text-[15px] font-medium ${isLight ? 'text-slate-800' : 'text-gray-100'}`}>
              {user.phone || '+998 77 400 11 25'}
            </span>
            <span className={`text-[13px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
              Mobile
            </span>
          </div>

          {/* Username */}
          <div className="flex items-center justify-between py-2 cursor-pointer group">
            <div className="flex flex-col">
              <span className="text-[15px] text-sky-400 font-medium group-hover:underline">
                @{user.username || 'fayozchek'}
              </span>
              <span className={`text-[13px] ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                Username
              </span>
            </div>
            <button className={`p-2 rounded-lg transition-colors ${isLight ? 'hover:bg-slate-100' : 'hover:bg-[#202b36]'}`}>
              <QrCode className="w-6 h-6 text-sky-400" />
            </button>
          </div>
        </div>
        
        {/* Stories Section Placeholder */}
        <div className={`px-4 py-8 text-center border-t ${isLight ? 'border-slate-100' : 'border-black/20'}`}>
           <p className={`text-sm ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
             Your stories will be here.
           </p>
        </div>
      </div>
    </div>
  );
};
