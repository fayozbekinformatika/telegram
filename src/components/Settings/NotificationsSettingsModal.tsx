import React, { useState } from 'react';
import { 
  ArrowLeft, X, Bell, Monitor, Volume2, User, Users, Megaphone, Heart, 
  UserPlus, Pin, Phone
} from 'lucide-react';
import { useTelegram } from '../../context/TelegramContext';

interface NotificationsSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
}

export const NotificationsSettingsModal: React.FC<NotificationsSettingsModalProps> = ({
  isOpen,
  onClose,
  onBack
}) => {
  const { theme } = useTelegram();
  const [activeCorner, setActiveCorner] = useState<'tl' | 'tr' | 'bl' | 'br'>('br');
  const [notificationCount, setNotificationCount] = useState<number>(3);
  
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    desktop_notifications: false,
    flash_taskbar: false,
    allow_sound: false,
    private_chats: true,
    groups: true,
    channels: true,
    reactions: true,
    contact_joined: true,
    pinned_messages: true,
    accept_calls: true,
    include_muted: true,
    count_unread: true,
    use_windows: false,
    respect_focus: false,
  });

  if (!isOpen) return null;

  const isLight = theme === 'light';
  const bgModal = isLight ? 'bg-white text-slate-800' : 'bg-[#1c242d] text-[#e4e4e5]';
  const bgHeader = isLight ? 'bg-white text-slate-800' : 'bg-[#1c242d] text-[#e4e4e5]';
  const textSub = isLight ? 'text-slate-500' : 'text-[#7d8b99]';
  const sectionTitle = isLight ? 'text-blue-500' : 'text-[#3390ec]';
  const divider = isLight ? 'border-slate-100' : 'border-black/20';

  const toggleSetting = (key: string) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const TelegramSwitch = ({ checked }: { checked: boolean }) => (
    <div className={`w-9 h-3.5 rounded-full relative transition-colors ${checked ? 'bg-[#3390ec]/50' : (isLight ? 'bg-slate-300' : 'bg-[#1c242d] border border-gray-600')}`}>
      <div className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full shadow-sm transition-transform ${checked ? 'translate-x-4 bg-[#3390ec]' : 'translate-x-0 bg-white dark:bg-[#7d8b99]'}`} />
    </div>
  );

  const ToggleItem = ({ id, label, subLabel, icon: Icon }: any) => (
    <div className={`flex items-center px-5 py-3 cursor-pointer transition-colors ${isLight ? 'hover:bg-black/5' : 'hover:bg-white/5'}`} onClick={() => toggleSetting(id)}>
      {Icon && <Icon className={`w-5 h-5 mr-4 ${textSub}`} />}
      <div className="flex-1">
        <div className="text-[15px]">{label}</div>
        {subLabel && <div className={`text-[13px] ${textSub}`}>{subLabel}</div>}
      </div>
      <TelegramSwitch checked={toggles[id]} />
    </div>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <div className={`px-5 py-2 text-[14px] font-medium ${sectionTitle} mt-2`}>
      {title}
    </div>
  );

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
            <h2 className="text-[17px] font-medium">Notifications and Sounds</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-black/10 transition-colors">
            <X className="w-5 h-5 opacity-70" />
          </button>
        </div>
        
        {/* Content */}
        <div className={`flex-1 overflow-y-auto no-scrollbar pb-6 ${isLight ? 'bg-slate-50' : 'bg-[#0e1621]'}`}>
          
          <div className={isLight ? 'bg-white mb-2 shadow-sm' : 'bg-[#1c242d] mb-2'}>
            <SectionHeader title="Global settings" />
            <ToggleItem id="desktop_notifications" label="Desktop notifications" icon={Bell} />
            <ToggleItem id="flash_taskbar" label="Flash the taskbar icon" icon={Monitor} />
            <ToggleItem id="allow_sound" label="Allow sound" icon={Volume2} />
          </div>

          <div className={isLight ? 'bg-white mb-2 shadow-sm' : 'bg-[#1c242d] mb-2'}>
            <SectionHeader title="Notifications for chats" />
            <ToggleItem id="private_chats" label="Private chats" subLabel="Click here to change" icon={User} />
            <ToggleItem id="groups" label="Groups" subLabel="Click here to change" icon={Users} />
            <ToggleItem id="channels" label="Channels" subLabel="Click here to change" icon={Megaphone} />
            <ToggleItem id="reactions" label="Reactions" subLabel="Messages, Poll votes" icon={Heart} />
          </div>

          <div className={isLight ? 'bg-white mb-2 shadow-sm' : 'bg-[#1c242d] mb-2'}>
            <SectionHeader title="Events" />
            <ToggleItem id="contact_joined" label="Contact joined Telegram" icon={UserPlus} />
            <ToggleItem id="pinned_messages" label="Pinned messages" icon={Pin} />
          </div>

          <div className={isLight ? 'bg-white mb-2 shadow-sm' : 'bg-[#1c242d] mb-2'}>
            <SectionHeader title="Calls" />
            <ToggleItem id="accept_calls" label="Accept calls on this device" icon={Phone} />
          </div>

          <div className={isLight ? 'bg-white mb-2 shadow-sm' : 'bg-[#1c242d] mb-2'}>
            <SectionHeader title="Badge counter" />
            <ToggleItem id="include_muted" label="Include muted chats in unread count" />
            <ToggleItem id="count_unread" label="Count unread messages" />
          </div>

          <div className={isLight ? 'bg-white mb-2 shadow-sm' : 'bg-[#1c242d] mb-2'}>
            <SectionHeader title="System integration" />
            <ToggleItem id="use_windows" label="Use Windows notifications" />
            <ToggleItem id="respect_focus" label="Respect system Focus mode" />
          </div>

          <div className={isLight ? 'bg-white mb-2 shadow-sm pb-6' : 'bg-[#1c242d] mb-2 pb-6'}>
            <SectionHeader title="Location on the screen" />
            
            {/* Monitor Mockup */}
            <div className="flex justify-center mt-6 mb-8">
              <div className="relative">
                {/* iMac Display */}
                <div className="w-[280px] h-[180px] bg-[#e1e5e8] rounded-xl p-2.5 shadow-lg relative z-10 flex flex-col">
                  {/* Screen */}
                  <div className="flex-1 bg-[#234261] rounded-sm relative overflow-hidden">
                    
                    {/* Corner Hitboxes */}
                    <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                      <div className="cursor-pointer" onClick={() => setActiveCorner('tl')} />
                      <div className="cursor-pointer" onClick={() => setActiveCorner('tr')} />
                      <div className="cursor-pointer" onClick={() => setActiveCorner('bl')} />
                      <div className="cursor-pointer" onClick={() => setActiveCorner('br')} />
                    </div>

                    {/* Notifications (Mockup bubbles) */}
                    <div className={`absolute p-2 flex flex-col gap-1.5 pointer-events-none ${
                      activeCorner === 'tl' ? 'top-0 left-0' :
                      activeCorner === 'tr' ? 'top-0 right-0 items-end' :
                      activeCorner === 'bl' ? 'bottom-0 left-0' :
                      'bottom-0 right-0 items-end'
                    }`}>
                      {Array.from({ length: notificationCount }).map((_, i) => (
                        <div key={i} className="w-24 h-6 bg-[#1e2c3a] border border-[#3b4c5d] rounded shadow-sm flex items-center px-1.5 gap-1.5">
                          <div className="w-3.5 h-3.5 rounded-full bg-[#3b4c5d]" />
                          <div className="flex-1 flex flex-col gap-0.5">
                            <div className="w-10 h-1 bg-[#3b4c5d] rounded-full" />
                            <div className="w-14 h-1 bg-[#3b4c5d] rounded-full" />
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
                {/* iMac Stand */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-16 h-10 bg-gradient-to-b from-[#b5b9bc] to-[#8d9399] clip-imac-stand z-0" style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' }} />
                <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-[#a3a8ac] rounded-t-lg z-0" />
              </div>
            </div>

            {/* Notifications count slider */}
            <div className="px-5 mt-10">
              <div className={`text-[14px] font-medium ${sectionTitle} mb-3`}>Notifications count</div>
              <div className="flex gap-1 items-end mb-1">
                {[1, 2, 3, 4, 5].map(num => (
                  <div 
                    key={num} 
                    className="flex-1 cursor-pointer flex flex-col gap-2"
                    onClick={() => setNotificationCount(num)}
                  >
                    <div className={`h-1 w-full rounded-full transition-colors ${num <= notificationCount ? 'bg-[#3390ec]' : (isLight ? 'bg-slate-200' : 'bg-[#2b3541]')}`} />
                    <div className={`text-center text-[13px] ${num === notificationCount ? (isLight ? 'text-blue-500' : 'text-[#3390ec]') : textSub}`}>
                      {num}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
