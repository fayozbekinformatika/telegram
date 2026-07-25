import React, { useState } from 'react';
import { X, User as UserIcon, ShieldCheck, Lock, Palette, Globe, Check, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTelegram } from '../../context/TelegramContext';
import { ThemeMode } from '../../types/telegram';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPasscodeModal: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onOpenPasscodeModal,
}) => {
  const { user, updateUserProfile, loginWithGoogleOAuth } = useAuth();
  const { theme, setTheme } = useTelegram();

  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');

  if (!isOpen) return null;

  const handleSave = () => {
    updateUserProfile({ name, username, bio });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#17212b] text-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-gray-800 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-[#0e1621]">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>⚙️</span> Telegram Settings
          </h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* User Card */}
          <div className="flex items-center gap-4 bg-[#0e1621] p-4 rounded-2xl border border-gray-800">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
              alt={user?.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-sky-500 shadow-md"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-white truncate">{user?.name}</h3>
                <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
              </div>
              <p className="text-xs text-sky-400 font-medium">@{user?.username}</p>
              <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
            </div>
          </div>

          {/* Google Auth Status Card */}
          <div className="bg-[#0e1621]/80 p-4 rounded-2xl border border-sky-500/30 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Google Authentication
              </span>
              <p className="text-xs text-gray-300">Gmail: {user?.email || 'Authenticated'}</p>
            </div>
            <button
              onClick={loginWithGoogleOAuth}
              className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-bold shadow-xs"
            >
              Re-Authenticate
            </button>
          </div>

          {/* Edit Profile Fields */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Profile Information</h4>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0e1621] text-xs text-white p-3 rounded-xl border border-gray-700 focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#0e1621] text-xs text-white p-3 rounded-xl border border-gray-700 focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                className="w-full bg-[#0e1621] text-xs text-white p-3 rounded-xl border border-gray-700 focus:outline-none focus:border-sky-500 resize-none"
              />
            </div>
          </div>

          {/* Theme Selector */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-sky-400" /> App Theme
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'dark', label: 'Dark Classic', bg: 'bg-[#0e1621]' },
                { id: 'night', label: 'Night Blue', bg: 'bg-[#17212b]' },
                { id: 'light', label: 'Day Light', bg: 'bg-slate-100 text-gray-900' },
                { id: 'green', label: 'Matrix Green', bg: 'bg-emerald-950' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id as ThemeMode)}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${t.bg} ${
                    theme === t.id ? 'border-sky-500 ring-2 ring-sky-500/30' : 'border-gray-700'
                  }`}
                >
                  <span>{t.label}</span>
                  {theme === t.id && <Check className="w-4 h-4 text-sky-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Security & Passcode */}
          <div className="bg-[#0e1621] p-4 rounded-2xl border border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-purple-400" />
              <div>
                <h5 className="text-xs font-bold text-white">Passcode Lock</h5>
                <p className="text-[11px] text-gray-400">Lock application with local 4-digit PIN</p>
              </div>
            </div>
            <button
              onClick={onOpenPasscodeModal}
              className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-xs text-purple-300 font-bold rounded-xl"
            >
              Configure
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 flex justify-end gap-2 bg-[#0e1621]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white rounded-xl hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-xs font-bold bg-sky-500 hover:bg-sky-400 text-white rounded-xl"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
