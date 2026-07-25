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

interface SideMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenNewChat: (type: 'group' | 'channel' | 'secret') => void;
  onOpenSettings: () => void;
  onOpenPasscode: () => void;
}

export const SideMenuDrawer: React.FC<SideMenuDrawerProps> = ({
  isOpen,
  onClose,
  onOpenNewChat,
  onOpenSettings,
}) => {
  const { user } = useAuth();
  const { theme, setTheme, setActiveChatId } = useTelegram();
  const isLight = theme === 'light';

  if (!isOpen) return null;

  const toggleNightMode = () => {
    setTheme(isLight ? 'dark' : 'light');
  };

  return (
    <div className="fixed inset-0 z-50 flex">
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
            <h2 className="text-[15px] font-medium leading-tight">
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
            onClick={() => {}}
            className={`w-full flex items-center gap-4 px-5 py-3 text-[15px] transition-colors ${
              isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-[#202b36] text-gray-200'
            }`}
          >
            <UserIcon className="w-5 h-5 opacity-70" />
            <span className="font-medium flex-1 text-left">My Profile</span>
          </button>
          
          <button
            onClick={() => {}}
            className={`w-full flex items-center gap-4 px-5 py-3 text-[15px] transition-colors ${
              isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-[#202b36] text-gray-200'
            }`}
          >
            <Wallet className="w-5 h-5 opacity-70" />
            <span className="font-medium flex-1 text-left">Wallet</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500 text-white uppercase">New</span>
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
            <Users className="w-5 h-5 opacity-70" />
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
            <span className="font-medium flex-1 text-left">New Channel</span>
          </button>
          
          <button
            onClick={() => {}}
            className={`w-full flex items-center gap-4 px-5 py-3 text-[15px] transition-colors ${
              isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-[#202b36] text-gray-200'
            }`}
          >
            <UserIcon className="w-5 h-5 opacity-70" />
            <span className="font-medium flex-1 text-left">Contacts</span>
          </button>
          
          <button
            onClick={() => {}}
            className={`w-full flex items-center gap-4 px-5 py-3 text-[15px] transition-colors ${
              isLight ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-[#202b36] text-gray-200'
            }`}
          >
            <Phone className="w-5 h-5 opacity-70" />
            <span className="font-medium flex-1 text-left">Calls</span>
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
            <span className="font-medium flex-1 text-left">Night Mode</span>
            
            {/* Toggle switch */}
            <div className={`w-8 h-4 rounded-full relative transition-colors ${!isLight ? 'bg-sky-500' : 'bg-slate-300'}`}>
              <div className={`absolute top-0.5 bottom-0.5 w-3 bg-white rounded-full transition-transform ${!isLight ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </div>
          </button>
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t flex flex-col justify-center ${
            isLight ? 'border-slate-100 text-slate-500' : 'border-black/20 text-gray-500'
          }`}
        >
          <span className="text-[13px] font-medium mb-0.5">
            Telegram Desktop
          </span>
          <span className="text-[12px]">
            Version 7.0.4 x64 — About
          </span>
        </div>
      </div>
    </div>
  );
};
