import React, { useState } from 'react';
import { 
  ArrowLeft, X, Shield, Clock, Lock, Mail, Hand, MonitorSmartphone, Trash2
} from 'lucide-react';
import { useTelegram } from '../../context/TelegramContext';
import { useAuth } from '../../context/AuthContext';

interface PrivacySecuritySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
}

export const PrivacySecuritySettingsModal: React.FC<PrivacySecuritySettingsModalProps> = ({
  isOpen,
  onClose,
  onBack
}) => {
  const { theme } = useTelegram();
  const { user } = useAuth();
  
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    suggest_frequent_contacts: true,
  });

  if (!isOpen) return null;

  const isLight = theme === 'light';
  const bgModal = isLight ? 'bg-white text-slate-800' : 'bg-[#1c242d] text-[#e4e4e5]';
  const bgHeader = isLight ? 'bg-white text-slate-800' : 'bg-[#1c242d] text-[#e4e4e5]';
  const textSub = isLight ? 'text-slate-500' : 'text-[#7d8b99]';
  const textValue = isLight ? 'text-blue-500' : 'text-[#3390ec]';
  const sectionTitle = isLight ? 'text-blue-500' : 'text-[#3390ec]';

  const toggleSetting = (key: string) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const TelegramSwitch = ({ checked }: { checked: boolean }) => (
    <div className={`w-9 h-3.5 rounded-full relative transition-colors ${checked ? 'bg-[#3390ec]/50' : (isLight ? 'bg-slate-300' : 'bg-[#1c242d] border border-gray-600')}`}>
      <div className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full shadow-sm transition-transform ${checked ? 'translate-x-4 bg-[#3390ec]' : 'translate-x-0 bg-white dark:bg-[#7d8b99]'}`} />
    </div>
  );

  const SettingItem = ({ id, label, subLabel, icon: Icon, value, isToggle, onClick }: any) => (
    <div 
      className={`flex items-center px-5 py-3 cursor-pointer transition-colors ${isLight ? 'hover:bg-black/5' : 'hover:bg-white/5'}`} 
      onClick={isToggle ? () => toggleSetting(id) : onClick}
    >
      {Icon && <Icon className={`w-5 h-5 mr-4 ${textSub}`} />}
      <div className="flex-1">
        <div className="text-[15px]">{label}</div>
        {subLabel && <div className={`text-[13px] ${textSub}`}>{subLabel}</div>}
      </div>
      {isToggle ? (
        <TelegramSwitch checked={toggles[id]} />
      ) : (
        value && <div className={`text-[14px] ${textValue}`}>{value}</div>
      )}
    </div>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <div className={`px-5 py-2 text-[14px] font-medium ${sectionTitle} mt-2`}>
      {title}
    </div>
  );

  const FooterText = ({ text }: { text: string }) => (
    <div className={`px-5 py-2 pb-4 text-[13px] ${textSub}`}>
      {text}
    </div>
  );

  const formatEmail = (email: string) => {
    if (!email) return '';
    const parts = email.split('@');
    if (parts.length !== 2) return email;
    const name = parts[0];
    if (name.length <= 3) return email;
    return `${name.substring(0, 2)}****${name.substring(name.length - 1)}@${parts[1]}`;
  };

  // Mock values based on the screenshot
  const mockEmail = user?.username ? `${user.username}@gmail.com` : 'user@gmail.com';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className={`relative w-full max-w-[380px] h-[700px] max-h-[90vh] flex flex-col rounded-xl shadow-2xl z-10 ${bgModal} animate-in fade-in zoom-in-95 overflow-hidden`}>
        {/* Header */}
        <div className={`h-14 px-4 ${bgHeader} flex items-center justify-between shadow-sm z-10`}>
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-1.5 rounded-full hover:bg-black/10 transition-colors">
              <ArrowLeft className="w-5 h-5 opacity-70" />
            </button>
            <h2 className="text-[17px] font-medium">Privacy and Security</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-black/10 transition-colors">
            <X className="w-5 h-5 opacity-70" />
          </button>
        </div>
        
        {/* Content */}
        <div className={`flex-1 overflow-y-auto no-scrollbar ${isLight ? 'bg-slate-50' : 'bg-[#0e1621]'}`}>
          
          <div className={isLight ? 'bg-white mb-2 shadow-sm' : 'bg-[#1c242d] mb-2'}>
            <SectionHeader title="Security" />
            <SettingItem id="2fa" label="Two-Step Verification" icon={Shield} value="Off" />
            <SettingItem id="auto_delete" label="Auto-Delete Messages" icon={Clock} value="Off" />
            <SettingItem id="passcode" label="Local passcode" icon={Lock} value="Off" />
            <SettingItem id="email" label="Login Email" icon={Mail} value={formatEmail(mockEmail)} />
            <SettingItem id="blocked" label="Blocked users" icon={Hand} value="4" />
            <SettingItem id="sessions" label="Active sessions" icon={MonitorSmartphone} value="2" />
            <FooterText text="Manage your sessions on all your devices." />
          </div>

          <div className={isLight ? 'bg-white mb-2 shadow-sm' : 'bg-[#1c242d] mb-2'}>
            <SectionHeader title="Privacy" />
            <SettingItem id="phone" label="Phone number" value="My contacts" />
            <SettingItem id="last_seen" label="Last seen & online" value="Everybody" />
            <SettingItem id="profile_photos" label="Profile photos" value="Everybody" />
            <SettingItem id="forwarded" label="Forwarded messages" value="Everybody" />
            <SettingItem id="calls" label="Calls" value="Everybody" />
            <SettingItem id="voice" label="Voice messages" value="Everybody" />
            <SettingItem id="messages" label="Messages" value="Everybody" />
            <SettingItem id="birthday" label="Birthday" value="My contacts" />
            <SettingItem id="gifts" label="Gifts" value="Everybody" />
            <SettingItem id="bio" label="Bio" value="Everybody" />
            <SettingItem id="saved_music" label="Saved Music" value="Everybody" />
            <SettingItem id="invites" label="Invites" value="Everybody" />
          </div>

          <div className={isLight ? 'bg-white mb-2 shadow-sm' : 'bg-[#1c242d] mb-2'}>
            <SectionHeader title="Bots and websites" />
            <SettingItem id="clear_payment" label="Clear Payment and Shipping Info" />
          </div>

          <div className={isLight ? 'bg-white mb-2 shadow-sm' : 'bg-[#1c242d] mb-2'}>
            <SectionHeader title="Frequent contacts" />
            <SettingItem id="suggest_frequent_contacts" label="Suggest frequent contacts" isToggle={true} />
            <FooterText text="Display people you message frequently at the top of the search section for quick access." />
          </div>

          <div className={isLight ? 'bg-white shadow-sm' : 'bg-[#1c242d]'}>
            <SectionHeader title="Delete my account" />
            <SettingItem id="delete_account" label="If away for..." value="18 months" />
          </div>
          
          {/* Bottom Padding */}
          <div className="h-4"></div>
        </div>
      </div>
    </div>
  );
};
