import React from 'react';
import {
  Users,
  Radio,
  User as UserIcon,
  Phone,
  Bookmark,
  Settings,
  Moon,
  Sun,
  LogOut,
  ChevronDown,
  Wallet,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTelegram } from '../../context/TelegramContext';
import { UserProfileModal } from '../Modals/UserProfileModal';

interface SideMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenNewChat: (type: 'group' | 'channel' | 'secret') => void;
  onOpenSettings: () => void;
  onOpenPasscode: () => void;
  onOpenContacts: () => void;
  onOpenCalls: () => void;
}

export const SideMenuDrawer: React.FC<SideMenuDrawerProps> = ({
  isOpen,
  onClose,
  onOpenNewChat,
  onOpenSettings,
  onOpenContacts,
  onOpenCalls,
}) => {
  const { user } = useAuth();
  const { theme, setTheme, setActiveChatId } = useTelegram();
  const [showMyProfile, setShowMyProfile] = React.useState(false);
  const isLight = theme === 'light';

  if (!isOpen) return null;

  const toggleNightMode = () => {
    setTheme(isLight ? 'dark' : 'light');
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <UserProfileModal 
        isOpen={showMyProfile} 
        onClose={() => setShowMyProfile(false)} 
        user={{ id: user?.id || 'me', name: user?.name || 'Fayozbek Yusubjonov', phone: "+998 77 400 11 25", username: "fayozchek", avatar: user?.avatar || 'https://i.pravatar.cc/150?u=a042581f4e29026024d', isOnline: true } as any}
      />
      
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Card */}
      <div
        className={`relative w-72 max-w-[85vw] h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-left duration-200 ${
          isLight ? 'bg-white text-slate-800' : 'bg-[#17212b] text-white'
        }`}
      >
        {/* User Profile Header */}
        <div
          className={`p-4 relative ${
            isLight
              ? 'bg-blue-500 text-white'
              : 'bg-[#17212b] text-white border-b border-black/20'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center text-xl font-bold">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                (user?.name || 'T')[0]
              )}
            </div>
            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/10 transition-colors">
              <ChevronDown className="w-5 h-5 opacity-70" />
            </button>
          </div>
          <div className="flex flex-col mt-3">
            <h2 className={`text-[15px] font-medium leading-tight ${user?.profileColor ? user.profileColor.replace('bg-', 'text-') : ''}`}>
              {user?.name || 'Telegram User'}
            </h2>
            <button className="text-[13px] text-sky-400 font-medium text-left mt-0.5 hover:underline">
              Set Emoji Status
            </button>
          </div>
        </div>

        {/* Menu Items List */}
        <div className="flex-1 overflow-y-auto py-2 space-y-0.5">
          <button
            onClick={() => { setShowMyProfile(true); }}
            className={`w-full flex items-center gap-4 px-5 py-3 text-[15px] transition-colors ${
              isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-[#202b36] text-gray-200'
            }`}
          >
            <UserIcon className="w-5 h-5 opacity-70" />
            <span className="font-medium flex-1 text-left">My Profile</span>
          </button>
          <div className={`my-1 border-t ${isLight ? 'border-slate-100' : 'border-black/20'}`} />
          <button
            onClick={() => {
              onOpenNewChat('group');
              onClose();
            }}
            className={`w-full flex items-center gap-4 px-5 py-3 text-[15px] transition-colors ${
              isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-[#202b36] text-gray-200'
            }`}
          >
            <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            <span className="font-medium flex-1 text-left">New Group</span>
          </button>
          <button
            onClick={() => {
              onOpenNewChat('channel');
              onClose();
            }}
            className={`w-full flex items-center gap-4 px-5 py-3 text-[15px] transition-colors ${
              isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-[#202b36] text-gray-200'
            }`}
          >
            <Radio className="w-5 h-5 opacity-70" />
            <span className="font-medium flex-1 text-left">Channel</span>
          </button>
          
          <button
            onClick={() => {
              setActiveChatId('saved_messages');
              onClose();
            }}
            className={`w-full flex items-center gap-4 px-5 py-3 text-[15px] transition-colors ${
              isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-[#202b36] text-gray-200'
            }`}
          >
            <Bookmark className="w-5 h-5 opacity-70" />
            <span className="font-medium flex-1 text-left">Saved Messages</span>
          </button>
          
          <button
            onClick={() => { onOpenContacts(); onClose(); }}
            className={`w-full flex items-center gap-4 px-5 py-3 text-[15px] transition-colors ${
              isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-[#202b36] text-gray-200'
            }`}
          >
            <UserIcon className="w-5 h-5 opacity-70" />
            <span className="font-medium flex-1 text-left">Contacts</span>
          </button>
          
          <button
            onClick={() => {
              onOpenSettings();
              onClose();
            }}
            className={`w-full flex items-center gap-4 px-5 py-3 text-[15px] transition-colors ${
              isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-[#202b36] text-gray-200'
            }`}
          >
            <Settings className="w-5 h-5 opacity-70" />
            <span className="font-medium flex-1 text-left">Settings</span>
          </button>
          
          <button
            onClick={toggleNightMode}
            className={`w-full flex items-center gap-4 px-5 py-3 text-[15px] transition-colors ${
              isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-[#202b36] text-gray-200'
            }`}
          >
            <Moon className="w-5 h-5 opacity-70" />
            <span className="font-medium flex-1 text-left">Dark Mode</span>
            {/* Toggle switch */}
            <div className={`w-8 h-4 rounded-full relative transition-colors ${!isLight ? 'bg-sky-500' : 'bg-slate-300'}`}>
              <div className={`absolute top-0.5 bottom-0.5 w-3 bg-white rounded-full transition-transform ${!isLight ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </div>
          </button>
          
          <button className={`w-full flex items-center gap-4 px-5 py-3 text-[15px] transition-colors ${isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-[#202b36] text-gray-200'}`}>
            <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            <span className="font-medium flex-1 text-left">Animations</span>
          </button>
          
          <button className={`w-full flex items-center gap-4 px-5 py-3 text-[15px] transition-colors ${isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-[#202b36] text-gray-200'}`}>
            <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            <span className="font-medium flex-1 text-left">Telegram Features</span>
          </button>
          
          <button className={`w-full flex items-center gap-4 px-5 py-3 text-[15px] transition-colors ${isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-[#202b36] text-gray-200'}`}>
            <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
            <span className="font-medium flex-1 text-left">Report Bug</span>
          </button>
          
          <button className={`w-full flex items-center gap-4 px-5 py-3 text-[15px] transition-colors ${isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-[#202b36] text-gray-200'}`}>
            <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
            <span className="font-medium flex-1 text-left">Switch to K Version</span>
          </button>
          
          <button className={`w-full flex items-center gap-4 px-5 py-3 text-[15px] transition-colors ${isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-[#202b36] text-gray-200'}`}>
            <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            <span className="font-medium flex-1 text-left">Install App</span>
          </button>
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t flex flex-col justify-center ${
            isLight ? 'border-slate-100 text-slate-500' : 'border-black/20 text-gray-500'
          }`}
        >
          <span className="text-[13px] font-medium mb-0.5">
            Telegram Web Z
          </span>
          <span className="text-[12px]">
            Version 2.1.2 alpha — About
          </span>
        </div>
      </div>
    </div>
  );
};
