import React, { useState } from 'react';
import { X, QrCode, ArrowLeft, Camera, User as UserIcon, Phone, AtSign, Megaphone, Bot, Palette, Gift, Plus } from 'lucide-react';
import { User } from '../../types/telegram';
import { useTelegram } from '../../context/TelegramContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, user }) => {
  const { theme } = useTelegram();
  const { showToast } = useToast();
  const { user: authUser, updateUserProfile } = useAuth();
  // Use authUser if available to show real updated data
  const displayUser = authUser ? { ...user, ...authUser } : user;
  
  const [editNameFirst, setEditNameFirst] = useState(displayUser?.name?.split(' ')[0] || '');
  const [editNameLast, setEditNameLast] = useState(displayUser?.name?.split(' ').slice(1).join(' ') || '');
  const [editUsername, setEditUsername] = useState(displayUser?.username || '');

  const [isEditMode, setIsEditMode] = useState(false);
  const [activeModal, setActiveModal] = useState<'none' | 'name' | 'username' | 'channel' | 'automation' | 'color' | 'birthday' | 'bio'>('none');
  const [editBio, setEditBio] = useState(displayUser?.bio || '');
  const [activeColor, setActiveColor] = useState(displayUser?.profileColor || 'bg-blue-500');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        updateUserProfile({ avatar: url });
      };
      reader.readAsDataURL(file);
    }
  };
  const isLight = theme === 'light';

  if (!isOpen || !user) return null;

  const handleClose = () => {
    setIsEditMode(false);
    onClose();
  };

  const bgModal = isLight ? 'bg-white text-slate-800' : 'bg-[#17212b] text-white';
  const bgHeader = isLight ? 'bg-blue-500' : 'bg-[#1e2c3a]';
  const textSub = isLight ? 'text-slate-500' : 'text-gray-400';
  const borderCol = isLight ? 'border-slate-100' : 'border-black/20';

  if (isEditMode) {
    const renderSubModal = () => {
    if (activeModal === 'none') return null;

    if (activeModal === 'bio') {
      return (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setActiveModal('none')} />
          <div className={`relative w-full max-w-[300px] rounded-xl shadow-2xl z-10 ${bgModal} p-5 animate-in fade-in zoom-in-95`}>
            <h3 className="text-[17px] font-medium mb-4">Bio</h3>
            <div className="relative mb-4">
              <textarea value={editBio} onChange={(e) => setEditBio(e.target.value)} maxLength={70} className={`w-full bg-transparent border-b border-sky-500 focus:outline-none pb-1 text-[15px] resize-none ${isLight ? 'text-slate-800' : 'text-white'}`} rows={3} placeholder="Any details such as age, occupation or city." />
              <div className="absolute bottom-2 right-2 text-xs text-slate-400">{editBio.length}/70</div>
            </div>
            <p className={`text-[13px] leading-tight mb-6 ${textSub}`}>Any details such as age, occupation or city.<br/>Example: 23 y.o. designer from San Francisco</p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setActiveModal('none')} className="text-sky-500 font-medium hover:text-sky-600">Cancel</button>
              <button onClick={() => {
                updateUserProfile({ bio: editBio });
                setActiveModal('none');
              }} className="text-sky-500 font-medium hover:text-sky-600">Save</button>
            </div>
          </div>
        </div>
      );
    }
    if (activeModal === 'name') {
      return (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setActiveModal('none')} />
          <div className={`relative w-full max-w-[300px] rounded-xl shadow-2xl z-10 ${bgModal} p-5 animate-in fade-in zoom-in-95`}>
            <h3 className="text-[17px] font-medium mb-4">Edit your name</h3>
            <div className="space-y-4">
              <div className="relative">
                <input type="text" value={editNameFirst} onChange={(e) => setEditNameFirst(e.target.value)} className={`w-full bg-transparent border-b border-sky-500 focus:outline-none pb-1 text-[15px] ${isLight ? 'text-slate-800' : 'text-white'}`} />
                <label className="absolute -top-3 left-0 text-xs text-sky-500">First name</label>
              </div>
              <div className="relative pt-2">
                <input type="text" value={editNameLast} onChange={(e) => setEditNameLast(e.target.value)} className={`w-full bg-transparent border-b ${isLight ? 'border-slate-300' : 'border-gray-600'} focus:border-sky-500 focus:outline-none pb-1 text-[15px] ${isLight ? 'text-slate-800' : 'text-white'}`} />
                <label className={`absolute -top-1 left-0 text-xs ${textSub}`}>Last name</label>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button onClick={() => setActiveModal('none')} className="text-sky-500 font-medium hover:text-sky-600">Cancel</button>
              <button onClick={() => {
                updateUserProfile({ name: (editNameFirst + ' ' + editNameLast).trim() });
                setActiveModal('none');
              }} className="text-sky-500 font-medium hover:text-sky-600">Save</button>
            </div>
          </div>
        </div>
      );
    }
    
    if (activeModal === 'username') {
      return (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setActiveModal('none')} />
          <div className={`relative w-full max-w-[300px] rounded-xl shadow-2xl z-10 ${bgModal} p-5 animate-in fade-in zoom-in-95`}>
            <h3 className="text-[17px] font-medium mb-4">Username</h3>
            <div className="relative mb-4">
              <input type="text" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} className={`w-full bg-transparent border-b border-sky-500 focus:outline-none pb-1 text-[15px] ${isLight ? 'text-slate-800' : 'text-white'}`} />
              <label className="absolute -top-3 left-0 text-xs text-sky-500">@username</label>
            </div>
            <p className={`text-[13px] leading-tight mb-3 ${textSub}`}>You can choose a username on Telegram. If you do, other people will be able to find you by this username and contact you without knowing your phone number.</p>
            <p className={`text-[13px] leading-tight mb-6 ${textSub}`}>You can use a-z, 0-9 and underscores. Minimum length is 5 characters.</p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setActiveModal('none')} className="text-sky-500 font-medium hover:text-sky-600">Cancel</button>
              <button onClick={() => {
                updateUserProfile({ username: editUsername.replace('@', '') });
                setActiveModal('none');
              }} className="text-sky-500 font-medium hover:text-sky-600">Save</button>
            </div>
          </div>
        </div>
      );
    }
    
    if (activeModal === 'channel') {
      return (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setActiveModal('none')} />
          <div className={`relative w-full max-w-[300px] rounded-xl shadow-2xl z-10 ${bgModal} p-5 flex flex-col items-center justify-center min-h-[300px] animate-in fade-in zoom-in-95`}>
            <h3 className="absolute top-4 left-5 text-[17px] font-medium">Personal channel</h3>
            <div className="flex flex-col items-center justify-center flex-1 w-full mt-8">
              <p className={`text-[15px] mb-2 ${textSub}`}>You don't have any public channels yet.</p>
              <button onClick={() => showToast("Start channel wizard coming soon")} className="text-sky-500 font-medium hover:underline">Start a Channel</button>
            </div>
            <div className="w-full flex justify-end mt-4">
              <button onClick={() => {
                updateUserProfile({ personalChannel: 'Started' });
                setActiveModal('none');
              }} className="text-sky-500 font-medium hover:text-sky-600">Done</button>
            </div>
          </div>
        </div>
      );
    }
    
    if (activeModal === 'automation') {
      return (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setActiveModal('none')} />
          <div className={`relative w-full max-w-[300px] rounded-xl shadow-2xl z-10 ${bgModal} flex flex-col overflow-hidden animate-in fade-in zoom-in-95`}>
            <div className={`flex items-center justify-between p-3 border-b ${borderCol}`}>
              <div className="flex items-center gap-3">
                <button onClick={() => setActiveModal('none')} className="p-1 rounded-full hover:bg-black/10 transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="font-medium text-[17px]">Chat Automation</h2>
              </div>
              <button onClick={() => {
                updateUserProfile({ automationEnabled: true });
                setActiveModal('none');
              }} className="text-sky-500 font-medium hover:text-sky-600">Save</button>
            </div>
            <div className="p-5 flex flex-col items-center">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mb-4">
                 <Bot className="w-8 h-8 text-sky-500" />
              </div>
              <p className={`text-[14px] text-center mb-4 ${textSub}`}>Add a bot to answer messages on your behalf.</p>
              
              <div className="w-full">
                <input type="text" placeholder="Enter bot URL or username" className={`w-full bg-transparent border-b ${isLight ? 'border-slate-300' : 'border-gray-600'} focus:border-sky-500 focus:outline-none pb-2 mb-2 text-[15px] ${isLight ? 'text-slate-800' : 'text-white'}`} />
                <p className={`text-[12px] mb-4 ${textSub}`}>Choose a bot to manage your chats automatically.</p>
                
                <h4 className="text-sky-500 text-[13px] font-medium mb-3">Chats the bot can access</h4>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-4 h-4 rounded-full border-[5px] border-sky-500"></div>
                  <span className="text-[15px]">All Private Chats Except...</span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-4 h-4 rounded-full border-2 ${isLight ? 'border-slate-300' : 'border-gray-500'}`}></div>
                  <span className="text-[15px]">Only Selected Chats</span>
                </div>
                
                <h4 className="text-sky-500 text-[13px] font-medium mb-3">Excluded chats</h4>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold">-</div>
                  <span className="text-[15px]">Exclude Chats</span>
                </div>
                <p className={`text-[12px] ${textSub}`}>Select chats or entire chat categories which the bot will not have access to.</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    if (activeModal === 'color') {
      const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-cyan-500', 'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-rose-500'];
      return (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setActiveModal('none')} />
          <div className={`relative w-full max-w-[320px] rounded-xl shadow-2xl z-10 ${bgModal} flex flex-col overflow-hidden animate-in fade-in zoom-in-95 max-h-[90vh]`}>
            <div className={`flex items-center justify-between p-3 border-b ${borderCol}`}>
              <h2 className="font-medium text-[17px] pl-2">Color preview</h2>
              <button onClick={() => setActiveModal('none')} className="p-1 rounded-full hover:bg-black/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex border-b border-black/10">
              <button className="flex-1 py-3 text-center text-sky-500 font-medium border-b-2 border-sky-500">Profile</button>
              <button className={`flex-1 py-3 text-center ${textSub}`}>Name</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
              <div className="flex flex-col items-center mb-6">
                <div className={`w-20 h-20 rounded-full border-4 ${activeColor.replace('bg-', 'border-')} p-1 mb-2`}>
                  <img src={displayUser.avatar || 'https://i.pravatar.cc/150'} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                </div>
                <h3 className={`font-medium ${activeColor.replace('bg-', 'text-')}`}>{displayUser.name}</h3>
                <span className="text-sky-500 text-sm">online</span>
              </div>
              
              <div className="flex flex-wrap gap-3 justify-center mb-6">
                {colors.map((c, i) => (
                  <div key={i} onClick={() => setActiveColor(c)} className={`w-8 h-8 rounded-full ${c} cursor-pointer hover:scale-110 transition-transform ${activeColor === c ? 'ring-2 ring-sky-500 ring-offset-2 ring-offset-transparent' : ''}`} />
                ))}
              </div>
              
              <div onClick={() => showToast("Icons library coming soon")} className={`flex items-center justify-between py-3 border-y ${borderCol} cursor-pointer`}>
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-black/5 rounded"><Gift className="w-4 h-4 text-sky-500" /></div>
                  <span>Add icons to Profile</span>
                </div>
                <span className="text-sky-500">Off</span>
              </div>
              
              <p className={`text-[13px] my-3 ${textSub}`}>You can change the color of your name and customize replies to you. <span onClick={() => showToast("Change color scheme coming soon")} className="text-sky-500 cursor-pointer">Change {'>'}</span></p>
              
              <div className="flex gap-4 text-[13px] font-medium mb-4">
                <span className={`border-b-2 border-slate-400 pb-1`}>My Gifts</span>
                <span className={`${textSub}`}>🌪️ Chill Flame</span>
                <span className={`${textSub}`}>🍦 Vice Cream</span>
              </div>
              
              <div className="flex flex-col items-center justify-center py-6">
                 <div className="text-6xl mb-2">🦆</div>
                 <p className="text-[14px] text-center font-medium">You don't have any gifts you<br/>can use as a profile cover.</p>
                 <button className="text-sky-500 text-[14px] mt-2">Browse gifts available for purchase {'>'}</button>
              </div>
            </div>
            
            <div className="p-4 border-t border-black/10">
              <button className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors" onClick={() => { updateUserProfile({ profileColor: activeColor }); setActiveModal('none'); }}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/></svg>
                APPLY STYLE
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    if (activeModal === 'birthday') {
      return (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setActiveModal('none')} />
          <div className={`relative w-full max-w-[300px] rounded-xl shadow-2xl z-10 ${bgModal} p-5 animate-in fade-in zoom-in-95`}>
            <h3 className="text-[17px] font-medium mb-4">Set your Birthday</h3>
            
            <div className="mb-6">
              <input
                type="date"
                defaultValue={(() => { try { return displayUser.birthday ? new Date(displayUser.birthday).toISOString().split('T')[0] : ''; } catch (e) { return ''; } })()}
                className={`w-full bg-transparent border-b border-sky-500 focus:outline-none pb-1 text-[15px] ${isLight ? 'text-slate-800' : 'text-white'}`}
                onChange={(e) => {
                   // We'll store it directly to avoid adding a new state, and access it via ID.
                   // A better way is using a ref, but let's just add an ID.
                }}
                id="birthday-input"
              />
            </div>
            
            <div className="flex justify-end gap-4">
              <button onClick={() => setActiveModal('none')} className="text-sky-500 font-medium hover:text-sky-600">Cancel</button>
              <button onClick={() => {
                const dateVal = (document.getElementById('birthday-input') as HTMLInputElement)?.value;
                if (dateVal) {
                  const d = new Date(dateVal);
                  const formatted = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                  updateUserProfile({ birthday: formatted });
                } else {
                   updateUserProfile({ birthday: '' });
                }
                setActiveModal('none');
              }} className="text-sky-500 font-medium hover:text-sky-600">Save</button>
            </div>
          </div>
        </div>
      );
    }  };

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center">
        <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} accept="image/*" className="hidden" />
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={handleClose} />
        <div className={`relative w-[340px] h-[580px] rounded-xl shadow-2xl z-10 animate-in fade-in zoom-in-95 flex flex-col overflow-hidden ${bgModal}`}>
          {renderSubModal()}
          {/* Header */}
          <div className={`flex items-center justify-between p-3 border-b ${borderCol}`}>
            <div className="flex items-center gap-3">
              <button onClick={() => setIsEditMode(false)} className="p-1 rounded-full hover:bg-black/10 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="font-medium text-[17px]">Info</h2>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1 rounded-full hover:bg-black/10 transition-colors">
                <QrCode className="w-5 h-5" />
              </button>
              <button onClick={handleClose} className="p-1 rounded-full hover:bg-black/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar pb-4">
            {/* Avatar section */}
            <div className="flex flex-col items-center pt-5 pb-3">
              <div className="relative w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-4xl font-bold mb-3">
                {displayUser.avatar ? (
                  <img src={displayUser.avatar} alt={displayUser.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  (displayUser.name || 'U')[0]
                )}
                <div onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-blue-500 p-1.5 rounded-full border-2 border-[#17212b] cursor-pointer hover:bg-blue-600 transition-colors">
                  <Camera className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <h2 className={`text-lg font-medium mb-0.5 ${displayUser.profileColor ? displayUser.profileColor.replace('bg-', 'text-') : ''}`}>{displayUser.name}</h2>
              <p className="text-sm text-sky-400">online</p>
            </div>

            {/* Bio */}
            <div className={`px-4 py-3 border-b border-t ${borderCol} cursor-pointer hover:bg-black/5`} onClick={() => setActiveModal('bio')}>
              <div className="flex justify-between items-center mb-1">
                <span className={textSub}>Bio</span>
                <span className={textSub}>{displayUser.bio ? 70 - displayUser.bio.length : 70}</span>
              </div>
              <p className={`text-[15px] leading-tight ${isLight ? 'text-slate-800' : 'text-white'} mb-1`}>
                {displayUser.bio || 'Add a few words about yourself'}
              </p>
              <p className={`text-xs ${textSub} leading-tight`}>
                Any details such as age, occupation or city.
              </p>
            </div>

            {/* User Info List */}
            <div className="flex flex-col">
              <div className={`flex items-center px-4 py-3 cursor-pointer hover:bg-black/5`} onClick={() => setActiveModal('name')}>
                <UserIcon className={`w-5 h-5 mr-4 ${textSub}`} />
                <div className="flex-1 flex justify-between items-center">
                  <span className={textSub}>Name</span>
                  <span className="text-sky-400">{displayUser.name}</span>
                </div>
              </div>
              <div onClick={() => showToast("Change phone number wizard coming soon")} className={`flex items-center px-4 py-3 cursor-pointer hover:bg-black/5`}>
                <Phone className={`w-5 h-5 mr-4 ${textSub}`} />
                <div className="flex-1 flex justify-between items-center">
                  <span className={textSub}>Phone number</span>
                  <span className="text-sky-400">{displayUser.phone || '+998 77 400 11 25'}</span>
                </div>
              </div>
              <div className={`flex items-center px-4 py-3 cursor-pointer hover:bg-black/5`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-5 h-5 mr-4 ${textSub}`}>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <div className="flex-1 flex justify-between items-center">
                  <span className={textSub}>Email</span>
                  <span className="text-sky-400 text-[13px]">fayozchekyusubhonov@gmail.com</span>
                </div>
              </div>
              <div className={`flex items-center px-4 py-3 cursor-pointer hover:bg-black/5`} onClick={() => setActiveModal('username')}>
                <AtSign className={`w-5 h-5 mr-4 ${textSub}`} />
                <div className="flex-1 flex justify-between items-center">
                  <span className={textSub}>Username</span>
                  <span className="text-sky-400">@{displayUser.username || 'fayozchek'}</span>
                </div>
              </div>
              <div className={`px-4 pb-3 pt-1 border-b ${borderCol}`}>
                <p className={`text-[11px] ${textSub} leading-tight`}>
                  Username lets people contact you on Telegram without needing your phone number.
                </p>
              </div>

              {/* Extra settings */}
              <div className={`flex items-center px-4 py-3 cursor-pointer hover:bg-black/5`} onClick={() => setActiveModal('channel')}>
                <Megaphone className={`w-5 h-5 mr-4 ${textSub}`} />
                <div className="flex-1 flex justify-between items-center">
                  <span className={textSub}>Personal channel</span>
                  <span className="text-sky-400">{displayUser.personalChannel || 'Add'}</span>
                </div>
              </div>
              <div className={`flex items-center px-4 py-3 cursor-pointer hover:bg-black/5`} onClick={() => setActiveModal('automation')}>
                <Bot className={`w-5 h-5 mr-4 ${textSub}`} />
                <div className="flex-1 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className={textSub}>Chat automation</span>
                    <span className="bg-sky-500 text-white text-[9px] font-bold px-1 rounded uppercase">New</span>
                  </div>
                  <span className="text-sky-400">{displayUser.automationEnabled ? 'On' : 'Off'}</span>
                </div>
              </div>
              <div className={`flex items-center px-4 py-3 cursor-pointer hover:bg-black/5`} onClick={() => setActiveModal('color')}>
                <Palette className={`w-5 h-5 mr-4 ${textSub}`} />
                <div className="flex-1 flex justify-between items-center">
                  <span className={textSub}>Your name color</span>
                  <span className="text-sky-400">{displayUser.profileColor || 'Fayozbek'}</span>
                </div>
              </div>
              <div className={`flex items-center px-4 py-3 cursor-pointer hover:bg-black/5 border-b ${borderCol}`} onClick={() => setActiveModal('birthday')}>
                <Gift className={`w-5 h-5 mr-4 ${textSub}`} />
                <div className="flex-1 flex justify-between items-center">
                  <span className={textSub}>Birthday</span>
                  <span className="text-sky-400">{displayUser.birthday || 'Add'}</span>
                </div>
              </div>
              
              {/* Add Account */}
              <div onClick={() => showToast("Add Account wizard coming soon")} className={`flex items-center px-4 py-4 cursor-pointer hover:bg-black/5 text-sky-400`}>
                <Plus className="w-5 h-5 mr-4" />
                <span>Add Account</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={handleClose} />
      <div className={`relative w-[340px] rounded-xl shadow-2xl z-10 animate-in fade-in zoom-in-95 flex flex-col overflow-hidden ${bgModal}`}>
        <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
          <button onClick={() => setIsEditMode(true)} className="p-2 rounded-full hover:bg-black/10 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
          </button>
          <button onClick={handleClose} className="p-2 rounded-full hover:bg-black/10 transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        <div className={`pt-6 pb-4 px-4 relative flex flex-col items-center ${bgHeader}`}>
          <div className="w-24 h-24 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center text-4xl font-bold mb-3 border-2 border-[#1e2c3a]">
            {displayUser.avatar ? (
              <img src={displayUser.avatar} alt={displayUser.name} className="w-full h-full object-cover" />
            ) : (
              (displayUser.name || 'U')[0]
            )}
          </div>
          <h2 className="text-xl font-medium text-white mb-0.5">{displayUser.name}</h2>
          <p className="text-sm text-sky-400">online</p>
        </div>
        <div className={`p-4 flex flex-col ${isLight ? 'bg-white' : 'bg-[#17212b]'}`}>
          <div className="flex flex-col py-2">
            <span className={`text-[15px] font-medium ${isLight ? 'text-slate-800' : 'text-gray-100'}`}>
              {displayUser.bio || 'Bio'}
            </span>
            <span className={`text-[13px] ${textSub}`}>
              Bio
            </span>
          </div>
          <div className="flex flex-col py-2">
            <span className={`text-[15px] font-medium ${isLight ? 'text-slate-800' : 'text-gray-100'}`}>
              fayozchekyusubhonov@gmail.com
            </span>
            <span className={`text-[13px] ${textSub}`}>
              Google (Email)
            </span>
          </div>
          <div className="flex flex-col py-2">
            <span className={`text-[15px] font-medium ${isLight ? 'text-slate-800' : 'text-gray-100'}`}>
              {displayUser.phone || '+998 77 400 11 25'}
            </span>
            <span className={`text-[13px] ${textSub}`}>
              Mobile
            </span>
          </div>
          <div className="flex items-center justify-between py-2 cursor-pointer group">
            <div className="flex flex-col">
              <span className="text-[15px] text-sky-400 font-medium group-hover:underline">
                @{displayUser.username || 'fayozchek'}
              </span>
              <span className={`text-[13px] ${textSub}`}>
                Username
              </span>
            </div>
            <button className={`p-2 rounded-lg transition-colors ${isLight ? 'hover:bg-slate-100' : 'hover:bg-[#202b36]'}`}>
              <QrCode className="w-6 h-6 text-sky-400" />
            </button>
          </div>
        </div>
        <div className={`px-4 py-8 text-center border-t ${borderCol}`}>
           <p className={`text-sm ${textSub}`}>
             Your stories will be here.
           </p>
        </div>
      </div>
    </div>
  );
};
