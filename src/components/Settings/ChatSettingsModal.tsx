import React, { useState } from 'react';
import { 
  ArrowLeft, X, Palette, Image as ImageIcon, Folder, Smile, MessageSquare, ShieldAlert, Heart, Search
} from 'lucide-react';
import { useTelegram } from '../../context/TelegramContext';

interface ChatSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
}

export const ChatSettingsModal: React.FC<ChatSettingsModalProps> = ({
  isOpen,
  onClose,
  onBack
}) => {
  const { theme, setTheme, themeColor, setThemeColor, autoNightMode, setAutoNightMode } = useTelegram();
  const [fontFamily, setFontFamily] = useState('Calibri Light');
  const [isFontModalOpen, setIsFontModalOpen] = useState(false);
  const [isWallpaperModalOpen, setIsWallpaperModalOpen] = useState(false);
  
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    adaptive_layout: true,
    large_emoji: true,
    replace_emoji: true,
    suggest_emoji_replacements: true,
    suggest_popular_stickers: true,
    loop_animated: true,
    reply_button: true,
    reaction_button: true,
    swipe_unread: true,
    show_18_content: false,
  });

  const [messageAction, setMessageAction] = useState('Reply with double click');

  if (!isOpen) return null;

  const isLight = theme === 'light';
  const bgModal = isLight ? 'bg-white text-slate-800' : 'bg-[#1c242d] text-[#e4e4e5]';
  const bgHeader = isLight ? 'bg-white text-slate-800' : 'bg-[#1c242d] text-[#e4e4e5]';
  const textSub = isLight ? 'text-slate-500' : 'text-[#7d8b99]';
  const textValue = 'text-[var(--tg-primary)]';
  const sectionTitle = 'text-[var(--tg-primary)]';
  const borderCol = isLight ? 'border-slate-100' : 'border-black/20';

  const toggleSetting = (key: string) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const cycleAutoNightMode = () => {
    if (autoNightMode === 'System') setAutoNightMode('Off');
    else if (autoNightMode === 'Off') setAutoNightMode('System');
  };

  const TelegramSwitch = ({ checked }: { checked: boolean }) => (
    <div 
      className={`w-9 h-3.5 rounded-full relative transition-colors ${checked ? '' : (isLight ? 'bg-slate-300' : 'bg-[#1c242d] border border-gray-600')}`}
    >
      {checked && <div className="absolute inset-0 rounded-full opacity-50" style={{ backgroundColor: 'var(--tg-primary)' }} />}
      <div 
        className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full shadow-sm transition-transform ${checked ? 'translate-x-4' : 'translate-x-0 bg-white dark:bg-[#7d8b99]'}`} 
        style={checked ? { backgroundColor: 'var(--tg-primary)' } : {}}
      />
    </div>
  );

  const TelegramCheckbox = ({ checked, onClick }: { checked: boolean, onClick: () => void }) => (
    <div 
      className={`w-5 h-5 rounded-sm flex items-center justify-center cursor-pointer transition-colors ${checked ? '' : 'border-2 ' + (isLight ? 'border-slate-300' : 'border-[#7d8b99]')}`}
      style={checked ? { backgroundColor: 'var(--tg-primary)' } : {}}
      onClick={onClick}
    >
      {checked && <X className="w-3.5 h-3.5 text-white stroke-[3] rotate-45 scale-125 transition-transform" style={{ clipPath: 'polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%)', backgroundColor: 'white' }} />}
      {/* Simple checkmark representation for simplicity */}
      {checked && (
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-none stroke-current stroke-2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      )}
    </div>
  );

  const TelegramRadio = ({ checked, onClick }: { checked: boolean, onClick: () => void }) => (
    <div 
      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors ${checked ? '' : (isLight ? 'border-slate-300' : 'border-[#7d8b99]')}`}
      style={checked ? { borderColor: 'var(--tg-primary)' } : {}}
      onClick={onClick}
    >
      {checked && <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--tg-primary)' }} />}
    </div>
  );

  const SettingItem = ({ id, label, subLabel, icon: Icon, value, isToggle, onClick, actionIcon: ActionIcon }: any) => (
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
        <div className="flex items-center gap-2">
          {value && <div className={`text-[14px] ${textValue}`}>{value}</div>}
          {ActionIcon && <ActionIcon className="w-4 h-4 text-red-500" />}
        </div>
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

  const themes = [
    { name: 'Classic', bg: '#86d086', chatBg: '#e1f5c4', chatText: '#000' },
    { name: 'Day', bg: '#60a5fa', chatBg: '#dbeafe', chatText: '#000' },
    { name: 'Tinted', bg: '#475569', chatBg: '#64748b', chatText: '#fff' },
    { name: 'Night', bg: '#1e293b', chatBg: '#0f172a', chatText: '#fff' }
  ];

  const colors = [
    '#3b82f6', '#06b6d4', '#22c55e', '#ec4899', '#d97706', '#a855f7', '#64748b', '#eab308'
  ];

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
        
        <div className={`relative w-full max-w-[380px] h-[700px] max-h-[90vh] flex flex-col rounded-xl shadow-2xl z-10 ${bgModal} animate-in fade-in zoom-in-95 overflow-hidden`}>
          {/* Header */}
          <div className={`h-14 px-4 ${bgHeader} flex items-center justify-between shadow-sm z-10`}>
            <div className="flex items-center gap-4">
              <button onClick={onBack} className="p-1.5 rounded-full hover:bg-black/10 transition-colors">
                <ArrowLeft className="w-5 h-5 opacity-70" />
              </button>
              <h2 className="text-[17px] font-medium">Chat Settings</h2>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1.5 rounded-full hover:bg-black/10 transition-colors">
                <div className="flex flex-col gap-1 w-4">
                  <div className="w-1 h-1 rounded-full bg-current"></div>
                  <div className="w-1 h-1 rounded-full bg-current"></div>
                  <div className="w-1 h-1 rounded-full bg-current"></div>
                </div>
              </button>
              <button onClick={onClose} className="p-1.5 rounded-full hover:bg-black/10 transition-colors">
                <X className="w-5 h-5 opacity-70" />
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className={`flex-1 overflow-y-auto no-scrollbar ${isLight ? 'bg-slate-50' : 'bg-[#0e1621]'}`}>
            
            {/* Themes Section */}
            <div className={isLight ? 'bg-white mb-2 shadow-sm pb-4' : 'bg-[#1c242d] mb-2 pb-4'}>
              <SectionHeader title="Themes" />
              <div className="flex gap-4 px-5 mt-2 overflow-x-auto no-scrollbar pb-2">
                {themes.map(t => {
                  const modeMapping: Record<string, string> = {
                    'Classic': 'green',
                    'Day': 'light',
                    'Tinted': 'dark',
                    'Night': 'night'
                  };
                  const isCurrent = theme === modeMapping[t.name];
                  
                  return (
                    <div key={t.name} className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => setTheme(modeMapping[t.name] as any)}>
                      <div 
                        className={`w-16 h-20 rounded-xl relative overflow-hidden transition-transform ${isCurrent ? 'scale-105 ring-2 ring-[var(--tg-primary)] ring-offset-2 ring-offset-current' : ''}`}
                        style={{ backgroundColor: t.bg }}
                      >
                        {/* Fake chat bubbles */}
                        <div className="absolute top-2 left-2 w-8 h-3 bg-white/80 rounded-sm" />
                        <div className="absolute top-6 right-2 w-10 h-3 rounded-sm" style={{ backgroundColor: t.chatBg }} />
                        
                        {/* Active indicator in bottom center */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white/50 flex items-center justify-center">
                          {isCurrent && <div className="w-2 h-2 rounded-full bg-white/80" />}
                        </div>
                      </div>
                      <span className={`text-[13px] ${isCurrent ? textValue : textSub}`}>{t.name}</span>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex gap-2.5 px-5 mt-2 overflow-x-auto no-scrollbar pb-1">
                {colors.map((c, i) => (
                  <div 
                    key={i} 
                    className={`w-6 h-6 rounded-full cursor-pointer flex-shrink-0 flex items-center justify-center ${themeColor === c ? 'ring-2 ring-offset-2 ring-offset-current' : ''}`}
                    style={{ backgroundColor: c, '--tw-ring-color': c } as React.CSSProperties}
                    onClick={() => setThemeColor(c)}
                  >
                    {themeColor === c && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                ))}
                {/* Custom color picker icon mock */}
                <div className="w-6 h-6 rounded-full cursor-pointer flex-shrink-0 flex items-center justify-center bg-transparent border border-dashed border-[#7d8b99]">
                   <div className="w-3 h-3 flex flex-wrap gap-0.5">
                      <div className="w-1 h-1 bg-red-500 rounded-full" />
                      <div className="w-1 h-1 bg-green-500 rounded-full" />
                      <div className="w-1 h-1 bg-blue-500 rounded-full" />
                      <div className="w-1 h-1 bg-yellow-500 rounded-full" />
                   </div>
                </div>
              </div>
            </div>

            <div className={isLight ? 'bg-white mb-2 shadow-sm' : 'bg-[#1c242d] mb-2'}>
              <SectionHeader title="Theme settings" />
              <SettingItem label="Your name color" icon={Palette} value="Fayozbek" />
              <SettingItem label="Auto-night mode" icon={ShieldAlert} value={autoNightMode} onClick={cycleAutoNightMode} />
              <SettingItem label="Font family" icon={Palette} value={fontFamily} onClick={() => setIsFontModalOpen(true)} />
            </div>

            <div className={isLight ? 'bg-white mb-2 shadow-sm' : 'bg-[#1c242d] mb-2'}>
              <SectionHeader title="Chat wallpaper" />
              <div 
                className={`flex items-center px-5 py-3 cursor-pointer transition-colors ${isLight ? 'hover:bg-black/5' : 'hover:bg-white/5'}`}
                onClick={() => setIsWallpaperModalOpen(true)}
              >
                <div className="w-16 h-16 bg-[#1a222c] rounded-xl mr-4 flex-shrink-0" />
                <div className="flex flex-col gap-2 flex-1">
                  <div className={`text-[14px] ${textValue}`}>Choose from gallery</div>
                  <div className={`text-[14px] ${textValue}`}>Choose from file</div>
                </div>
              </div>
              <div className="px-5 py-2 pb-4">
                <div className="flex items-center gap-4 cursor-pointer" onClick={() => toggleSetting('adaptive_layout')}>
                  <TelegramCheckbox checked={toggles.adaptive_layout} onClick={() => {}} />
                  <span className="text-[15px]">Adaptive layout for wide screens</span>
                </div>
              </div>
            </div>

            <div className={isLight ? 'bg-white mb-2 shadow-sm' : 'bg-[#1c242d] mb-2'}>
              <SectionHeader title="Chat list quick action" />
              <SettingItem label="Change folder" icon={Folder} />
              <FooterText text="Choose the action you want to perform when you middle-click or swipe left in the chat list." />
            </div>

            <div className={isLight ? 'bg-white mb-2 shadow-sm' : 'bg-[#1c242d] mb-2'}>
              <SectionHeader title="Stickers and emoji" />
              <div className="flex flex-col gap-3 px-5 py-3">
                {[
                  { id: 'large_emoji', label: 'Large emoji' },
                  { id: 'replace_emoji', label: 'Replace emoji automatically' },
                  { id: 'suggest_emoji_replacements', label: 'Suggest emoji replacements' },
                  { id: 'suggest_popular_stickers', label: 'Suggest popular stickers by emoji' },
                  { id: 'loop_animated', label: 'Loop animated stickers' },
                ].map(item => (
                  <div key={item.id} className="flex items-center gap-4 cursor-pointer" onClick={() => toggleSetting(item.id)}>
                    <TelegramCheckbox checked={toggles[item.id]} onClick={() => {}} />
                    <span className="text-[15px]">{item.label}</span>
                  </div>
                ))}
              </div>
              <SettingItem label="Manage sticker sets" icon={Smile} />
              <SettingItem label="Choose emoji set" icon={Smile} />
            </div>

            <div className={isLight ? 'bg-white mb-2 shadow-sm' : 'bg-[#1c242d] mb-2'}>
              <SectionHeader title="Messages" />
              <div className="flex flex-col gap-3 px-5 py-3 border-b border-black/10">
                {[
                  { id: 'Send with Enter' },
                  { id: 'Send with Ctrl+Enter' },
                ].map(item => (
                  <div key={item.id} className="flex items-center gap-4 cursor-pointer" onClick={() => {}}>
                    <TelegramRadio checked={item.id === 'Send with Enter'} onClick={() => {}} />
                    <span className="text-[15px]">{item.id}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-3 px-5 py-3 border-b border-black/10">
                {[
                  { id: 'Reply with double click' },
                  { id: 'Send reaction with double click', icon: Heart },
                ].map(item => (
                  <div key={item.id} className="flex items-center gap-4 cursor-pointer" onClick={() => setMessageAction(item.id)}>
                    <TelegramRadio checked={messageAction === item.id} onClick={() => {}} />
                    <span className="text-[15px] flex-1">{item.id}</span>
                    {item.icon && <item.icon className="w-4 h-4 text-red-500 fill-red-500" />}
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-3 px-5 py-3">
                {[
                  { id: 'reply_button', label: 'Reply button on messages' },
                  { id: 'reaction_button', label: 'Reaction button on messages' },
                  { id: 'swipe_unread', label: 'Swipe to the next unread channel' },
                ].map(item => (
                  <div key={item.id} className="flex items-center gap-4 cursor-pointer" onClick={() => toggleSetting(item.id)}>
                    <TelegramCheckbox checked={toggles[item.id]} onClick={() => {}} />
                    <span className="text-[15px]">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={isLight ? 'bg-white shadow-sm' : 'bg-[#1c242d]'}>
              <SectionHeader title="Sensitive content" />
              <SettingItem id="show_18_content" label="Show 18+ Content" isToggle={true} />
              <FooterText text="Do not hide media that contains content suitable only for adults." />
            </div>
            
            {/* Bottom Padding */}
            <div className="h-4"></div>
          </div>
        </div>
      </div>

      {/* Font Family Sub-Modal */}
      {isFontModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setIsFontModalOpen(false)} />
          
          <div className={`relative w-full max-w-[340px] flex flex-col rounded-xl shadow-2xl z-10 ${bgModal} animate-in fade-in zoom-in-95 overflow-hidden`}>
            <div className={`p-4 ${bgHeader} border-b ${borderCol}`}>
              <h2 className="text-[16px] font-medium">Choose font family</h2>
            </div>
            
            {/* Preview Bubble */}
            <div className="p-4 flex flex-col gap-2 border-b border-black/10">
              <div className="bg-[#2b5278] rounded-xl rounded-tl-sm p-3 max-w-[90%] self-start relative">
                <div className="text-[#64b5ef] font-medium text-[13px] mb-1">Bob Harris</div>
                <div className="text-white text-[14px]" style={{ fontFamily }}>
                  I can't even take you seriously right...
                  <br/>
                  Ah, you kids today with techno music!
                  You should enjoy the classics, like
                  Hasselhoff!
                </div>
                <div className="absolute left-0 top-0 -ml-1.5 w-3 h-3 bg-[#2b5278]" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
              </div>
            </div>

            <div className={`p-2 border-b ${borderCol} flex items-center`}>
              <Search className={`w-5 h-5 ml-2 ${textSub}`} />
              <input 
                type="text" 
                placeholder="Search" 
                className="w-full bg-transparent border-none outline-none px-3 py-2 text-[15px]"
              />
            </div>

            <div className="flex-1 overflow-y-auto max-h-[300px]">
              {[
                { id: 'Default', style: 'sans-serif' },
                { id: 'System font', style: 'system-ui' },
                { id: 'Calibri Light', style: '"Calibri Light", Calibri, sans-serif' },
                { id: 'Arial', style: 'Arial, sans-serif' },
                { id: 'Times New Roman', style: '"Times New Roman", Times, serif' },
                { id: 'Courier New', style: '"Courier New", Courier, monospace' },
                { id: 'Verdana', style: 'Verdana, sans-serif' },
                { id: 'Georgia', style: 'Georgia, serif' },
                { id: 'Comic Sans MS', style: '"Comic Sans MS", cursive, sans-serif' },
                { id: 'Trebuchet MS', style: '"Trebuchet MS", Helvetica, sans-serif' },
                { id: 'Arial Black', style: '"Arial Black", Gadget, sans-serif' },
                { id: 'Impact', style: 'Impact, Charcoal, sans-serif' },
              ].map(font => (
                <div 
                  key={font.id} 
                  className={`flex items-center px-4 py-3 cursor-pointer ${isLight ? 'hover:bg-slate-100' : 'hover:bg-white/5'}`}
                  onClick={() => setFontFamily(font.id)}
                >
                  <TelegramRadio checked={fontFamily === font.id} onClick={() => {}} />
                  <span className="text-[15px] ml-4 flex-1" style={{ fontFamily: font.style }}>{font.id}</span>
                </div>
              ))}
            </div>
            
            <div className={`p-4 flex justify-end gap-6 ${isLight ? 'bg-white' : 'bg-[#1c242d]'}`}>
              <button className={`${textValue} font-medium hover:opacity-80`} onClick={() => setIsFontModalOpen(false)}>Cancel</button>
              <button className={`${textValue} font-medium hover:opacity-80`} onClick={() => setIsFontModalOpen(false)}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Wallpaper Sub-Modal */}
      {isWallpaperModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setIsWallpaperModalOpen(false)} />
          
          <div className={`relative w-full max-w-[340px] flex flex-col rounded-xl shadow-2xl z-10 ${bgModal} animate-in fade-in zoom-in-95 overflow-hidden`}>
            <div className={`h-14 px-4 ${bgHeader} flex items-center justify-between border-b ${borderCol}`}>
              <h2 className="text-[16px] font-medium">Choose a Wallpaper</h2>
              <button onClick={() => setIsWallpaperModalOpen(false)} className="p-1.5 rounded-full hover:bg-black/10 transition-colors">
                <X className="w-5 h-5 opacity-70" />
              </button>
            </div>
            
            <div 
              className={`flex items-center px-5 py-4 cursor-pointer transition-colors border-b ${borderCol} ${isLight ? 'hover:bg-black/5' : 'hover:bg-white/5'}`}
            >
              <ImageIcon className={`w-5 h-5 mr-4 ${textSub}`} />
              <span className="text-[15px] flex-1">Choose from file</span>
            </div>

            <div className="p-4 grid grid-cols-2 gap-2 overflow-y-auto max-h-[400px]">
              {Array.from({ length: 6 }).map((_, i) => (
                <div 
                  key={i}
                  className="w-full aspect-[2/3] bg-[#1a222c] rounded-md relative cursor-pointer overflow-hidden group border border-white/5"
                >
                  <img src={`https://picsum.photos/seed/${i + 10}/200/300`} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300" alt={`Wallpaper ${i}`} />
                </div>
              ))}
            </div>
            
            <div className="p-3 flex justify-end">
              <button className={`${textValue} font-medium hover:opacity-80 px-2 py-1`} onClick={() => setIsWallpaperModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
