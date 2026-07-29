import React, { useState } from 'react';
import { 
  User as UserIcon, Bell, Lock, MessageCircle, Folder, Settings2, 
  Video, Battery, Languages, Star, Briefcase, Gift, HelpCircle, 
  Search, MoreVertical, X, Check, ScanLine, CreditCard, LogOut, Pencil
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTelegram } from '../../context/TelegramContext';
import { useToast } from '../../context/ToastContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPasscodeModal: () => void;
  onOpenMyProfile?: () => void;
  onOpenNotifications?: () => void;
  onOpenPrivacySecurity?: () => void;
  onOpenChatSettings?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onOpenPasscodeModal,
  onOpenMyProfile,
  onOpenNotifications,
  onOpenPrivacySecurity,
  onOpenChatSettings,
}) => {
  const { user, logout } = useAuth();
  const { theme } = useTelegram();
  const { showToast } = useToast();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  if (!isOpen) return null;

  const isLight = theme === 'light';
  const bgModal = isLight ? 'bg-white text-slate-800' : 'bg-[#17212b] text-white';
  const bgHeader = isLight ? 'bg-blue-500 text-white' : 'bg-[#17212b] text-white';
  const borderCol = isLight ? 'border-slate-100' : 'border-black/20';
  const textSub = isLight ? 'text-slate-500' : 'text-gray-400';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className={`relative w-full max-w-[340px] h-[600px] max-h-[85vh] flex flex-col rounded-xl shadow-2xl z-10 ${bgModal} animate-in fade-in zoom-in-95`}>
        
        {/* Header Profile */}
        <div className={`p-4 ${bgHeader} border-b ${isLight ? 'border-blue-600' : 'border-black/20'} flex flex-col`}>
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-[17px] font-medium">Settings</h2>
            <div className="flex items-center gap-3">
              <button onClick={() => showToast("Search settings...")} className="hover:bg-black/10 p-1.5 rounded-full transition-colors"><Search className="w-5 h-5" /></button>
              <div className="relative">
                <button onClick={() => setShowMoreMenu(!showMoreMenu)} className="hover:bg-black/10 p-1.5 rounded-full transition-colors"><MoreVertical className="w-5 h-5" /></button>
                {showMoreMenu && (
                  <div className={`absolute right-0 top-full mt-1 w-48 rounded-lg shadow-xl z-50 overflow-hidden ${isLight ? 'bg-white border border-slate-200' : 'bg-[#2b3541] border border-black/20'}`}>
                    <div 
                      className={`flex items-center px-4 py-3 cursor-pointer ${isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-black/20 text-white'}`}
                      onClick={() => {
                        setShowMoreMenu(false);
                        if (onOpenMyProfile) {
                          onClose();
                          onOpenMyProfile();
                        }
                      }}
                    >
                      <Pencil className="w-4 h-4 mr-3 opacity-70" />
                      <span className="text-[14px]">Edit profile</span>
                    </div>
                    <div 
                      className={`flex items-center px-4 py-3 cursor-pointer ${isLight ? 'hover:bg-slate-100 text-red-500' : 'hover:bg-black/20 text-red-400'}`}
                      onClick={() => {
                        setShowMoreMenu(false);
                        logout();
                        onClose();
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-3 opacity-70" />
                      <span className="text-[14px]">Log out</span>
                    </div>
                  </div>
                )}
                {/* Invisible overlay to close menu */}
                {showMoreMenu && (
                  <div className="fixed inset-0 z-40" onClick={() => setShowMoreMenu(false)} />
                )}
              </div>
              <button onClick={onClose} className="hover:bg-black/10 p-1.5 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>
          </div>
          
          <div className="flex items-center mt-2">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center text-xl font-bold mr-4">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                (user?.name || 'T')[0]
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-[16px]">{user?.name || 'Fayozbek Yusubjonov'}</h3>
                            <p className="text-[13px] opacity-80">@{user?.username || 'fayozchek'}</p>
            </div>
            <button onClick={() => showToast("Scan QR Code")} className="p-2 hover:bg-black/10 rounded-full transition-colors self-start">
               <ScanLine className="w-5 h-5 opacity-70" />
            </button>
          </div>
        </div>
        
        {/* Settings List */}
        <div className="flex-1 overflow-y-auto no-scrollbar py-2">
          
          {/* Group 1 */}
          <div onClick={() => { if (onOpenMyProfile) { onClose(); onOpenMyProfile(); } else { showToast("Feature coming soon"); } }} className="flex items-center px-5 py-3 hover:bg-black/5 cursor-pointer transition-colors">
            <UserIcon className={`w-5 h-5 mr-4 ${textSub}`} />
            <span className="text-[15px] flex-1">My Account</span>
          </div>
          <div onClick={() => { if (onOpenNotifications) { onClose(); onOpenNotifications(); } else { showToast("Feature coming soon"); } }} className="flex items-center px-5 py-3 hover:bg-black/5 cursor-pointer transition-colors">
            <Bell className={`w-5 h-5 mr-4 ${textSub}`} />
            <span className="text-[15px] flex-1">Notifications and Sounds</span>
          </div>
          <div onClick={() => { if (onOpenPrivacySecurity) { onClose(); onOpenPrivacySecurity(); } else { showToast("Feature coming soon"); } }} className="flex items-center px-5 py-3 hover:bg-black/5 cursor-pointer transition-colors">
            <Lock className={`w-5 h-5 mr-4 ${textSub}`} />
            <span className="text-[15px] flex-1">Privacy and Security</span>
          </div>
          <div onClick={() => { if (onOpenChatSettings) { onClose(); onOpenChatSettings(); } else { showToast("Feature coming soon"); } }} className="flex items-center px-5 py-3 hover:bg-black/5 cursor-pointer transition-colors">
            <MessageCircle className={`w-5 h-5 mr-4 ${textSub}`} />
            <span className="text-[15px] flex-1">Chat Settings</span>
          </div>
          <div onClick={(e) => showToast(e.currentTarget.textContent || "Feature coming soon")} className="flex items-center px-5 py-3 hover:bg-black/5 cursor-pointer transition-colors">
            <Folder className={`w-5 h-5 mr-4 ${textSub}`} />
            <span className="text-[15px] flex-1">Folders</span>
          </div>
          <div onClick={(e) => showToast(e.currentTarget.textContent || "Feature coming soon")} className="flex items-center px-5 py-3 hover:bg-black/5 cursor-pointer transition-colors">
            <Settings2 className={`w-5 h-5 mr-4 ${textSub}`} />
            <span className="text-[15px] flex-1">Advanced</span>
          </div>
          <div onClick={(e) => showToast(e.currentTarget.textContent || "Feature coming soon")} className="flex items-center px-5 py-3 hover:bg-black/5 cursor-pointer transition-colors">
            <Video className={`w-5 h-5 mr-4 ${textSub}`} />
            <span className="text-[15px] flex-1">Speakers and Camera</span>
          </div>
          <div onClick={(e) => showToast(e.currentTarget.textContent || "Feature coming soon")} className="flex items-center px-5 py-3 hover:bg-black/5 cursor-pointer transition-colors">
            <Battery className={`w-5 h-5 mr-4 ${textSub}`} />
            <span className="text-[15px] flex-1">Battery and Animations</span>
          </div>
          <div onClick={(e) => showToast(e.currentTarget.textContent || "Feature coming soon")} className="flex items-center px-5 py-3 hover:bg-black/5 cursor-pointer transition-colors">
            <Languages className={`w-5 h-5 mr-4 ${textSub}`} />
            <span className="text-[15px] flex-1">Language</span>
            <span className="text-[15px] text-sky-500">English</span>
          </div>
          
          <div className={`my-2 border-t ${borderCol}`} />
          
          <div className="px-5 py-3 flex items-center justify-between">
            <span className="text-[15px] flex-1">Default interface scale</span>
            <div className="w-8 h-4 rounded-full relative transition-colors bg-sky-500">
              <div className="absolute top-0.5 bottom-0.5 w-3 bg-white rounded-full transition-transform translate-x-4" />
            </div>
          </div>
          <div className="px-5 pb-3">
             <div className="relative w-full h-1 bg-black/10 rounded-full mt-2">
                <div className="absolute left-0 top-0 bottom-0 bg-sky-500 w-[60%] rounded-full"></div>
                <div className="absolute left-[60%] top-1/2 -translate-y-1/2 -ml-2 w-4 h-4 bg-sky-500 rounded-full border-2 border-white shadow"></div>
             </div>
             <div className="flex justify-end mt-1">
               <span className={`text-[13px] ${textSub}`}>125%</span>
             </div>
          </div>
          
          <div className={`my-2 border-t ${borderCol}`} />
          
          {/* Group 3 */}
          <div onClick={(e) => showToast(e.currentTarget.textContent || "Feature coming soon")} className="flex items-center px-5 py-3 hover:bg-black/5 cursor-pointer transition-colors">
            <Star className="w-5 h-5 mr-4 text-purple-500" />
            <span className="text-[15px] flex-1">Telegram Premium</span>
          </div>
          <div onClick={(e) => showToast(e.currentTarget.textContent || "Feature coming soon")} className="flex items-center px-5 py-3 hover:bg-black/5 cursor-pointer transition-colors">
            <Star className="w-5 h-5 mr-4 text-yellow-500" />
            <span className="text-[15px] flex-1">My Stars</span>
          </div>
          <div onClick={(e) => showToast(e.currentTarget.textContent || "Feature coming soon")} className="flex items-center px-5 py-3 hover:bg-black/5 cursor-pointer transition-colors">
            <Briefcase className={`w-5 h-5 mr-4 ${textSub}`} />
            <span className="text-[15px] flex-1">Telegram Business</span>
          </div>
          <div onClick={(e) => showToast(e.currentTarget.textContent || "Feature coming soon")} className="flex items-center px-5 py-3 hover:bg-black/5 cursor-pointer transition-colors">
            <Gift className={`w-5 h-5 mr-4 ${textSub}`} />
            <span className="text-[15px] flex-1">Send a Gift</span>
          </div>
          
          <div className={`my-2 border-t ${borderCol}`} />
          
          {/* Group 4 */}
          <div onClick={(e) => showToast(e.currentTarget.textContent || "Feature coming soon")} className="flex items-center px-5 py-3 hover:bg-black/5 cursor-pointer transition-colors">
            <HelpCircle className={`w-5 h-5 mr-4 ${textSub}`} />
            <span className="text-[15px] flex-1">Telegram FAQ</span>
          </div>
        </div>
        
      </div>
    </div>
  );
};
