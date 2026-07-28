import React, { useState } from 'react';
import { X, QrCode, ArrowLeft, Camera, User as UserIcon, Phone, AtSign, Megaphone, Bot, Palette, Gift, Plus, BellOff, Sliders, LogOut, MoreHorizontal, Image as ImageIcon, FileText, UserPlus, MessageSquare } from 'lucide-react';
import { User } from '../../types/telegram';
import { useTelegram } from '../../context/TelegramContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

interface GroupMember {
  id: string;
  name: string;
  username?: string;
  avatar?: string;
  status?: string;
  role?: string;
}

const knownUserProfiles: Record<string, { name: string; username?: string; avatar?: string; status?: string; role?: string }> = {
  user_me: { name: 'Fayozchek Yusubhonov', username: 'fayozchek', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', status: 'online' },
  user_soliyev: { name: 'Soliyev Javlon', username: 'soliyev_j', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', status: 'last seen 12 minutes ago' },
  user_sayida: { name: 'Sayida 🐚', username: 'sayida_s', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', status: 'online' },
  user_deedo: { name: 'deedo', username: 'deedo_admin', avatar: 'https://ui-avatars.com/api/?name=D&background=ec4899&color=fff&font-size=0.4', status: 'online', role: 'owner' },
  user_tg_tips: { name: 'Telegram Tips', username: 'telegram', avatar: 'https://ui-avatars.com/api/?name=TT&background=000&color=fff&font-size=0.4', status: 'service notification' },
  user_islam: { name: '1slam', username: 'islam_owner', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', status: 'last seen 22 minutes ago', role: 'admin' },
  user_abdurahimov: { name: 'Yusuf Abdurahimov', username: 'yusuf_a', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', status: 'last seen 30 minutes ago' },
  user_abdulloh: { name: 'Abdulloh', username: 'abdulloh_m', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', status: 'last seen 1 hour ago' },
  user_khanxadjayeva: { name: 'khanxadjayeva_m', username: 'khanxadjayeva', avatar: 'https://ui-avatars.com/api/?name=KM&background=059669&color=fff&font-size=0.4', status: 'last seen 4 hours ago' },
};

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, user }) => {
  const { theme, globalUsers, toggleMute, leaveChat, joinChat, chats, startChatWithUser } = useTelegram();
  const { showToast } = useToast();
  const { user: authUser, updateUserProfile } = useAuth();
  
  const [selectedMemberUser, setSelectedMemberUser] = useState<User | null>(null);

  // Find live chat if user prop represents a group/channel chat
  const liveChat = chats?.find(c => c.id === user?.id || (user?.username && c.username?.toLowerCase() === user.username.toLowerCase()));
  const activeChatOrUser = liveChat || user;
  const myIds = [authUser?.id, 'user_me'].filter(Boolean) as string[];
  const isJoinedGroup = activeChatOrUser && (
    (activeChatOrUser.type !== 'group' && activeChatOrUser.type !== 'channel')
      ? true
      : Boolean(activeChatOrUser.memberIds && myIds.some(id => activeChatOrUser.memberIds?.includes(id)))
  );

  const displayUser = selectedMemberUser 
    ? (selectedMemberUser.id === authUser?.id ? authUser : (globalUsers?.[selectedMemberUser.id] || selectedMemberUser))
    : (user?.id === authUser?.id ? authUser : (user?.id && globalUsers?.[user.id] ? globalUsers[user.id] : activeChatOrUser));

  const [editNameFirst, setEditNameFirst] = useState(displayUser?.name?.split(' ')[0] || '');
  const [editNameLast, setEditNameLast] = useState(displayUser?.name?.split(' ').slice(1).join(' ') || '');
  const [editUsername, setEditUsername] = useState(displayUser?.username || '');
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeModal, setActiveModal] = useState<'none' | 'name' | 'username' | 'channel' | 'automation' | 'color' | 'birthday' | 'bio'>('none');
  const [editBio, setEditBio] = useState(displayUser?.bio || '');
  const [activeProfileColor, setActiveProfileColor] = useState(displayUser?.profileColor || 'bg-blue-500');
  const [activeNameColor, setActiveNameColor] = useState(displayUser?.nameColor || 'bg-yellow-500');
  const [editBirthday, setEditBirthday] = useState<Date | null>(displayUser?.birthday ? new Date(displayUser.birthday) : null);
  const [colorTab, setColorTab] = useState<'profile' | 'name'>('profile');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const isGroupOrChannel = (displayUser as any)?.type === 'group' || (displayUser as any)?.type === 'channel';

  const membersList: GroupMember[] = React.useMemo(() => {
    const rootTarget = liveChat || user;
    if (!rootTarget || ((rootTarget as any)?.type !== 'group' && (rootTarget as any)?.type !== 'channel')) return [];
    
    // Strictly take ONLY members who are actually in memberIds of this group/chat
    const rawIds: string[] = (rootTarget as any).memberIds || [];
    
    const resolvedList: GroupMember[] = [];
    const seenKeys = new Set<string>();

    const canonicalAuthId = authUser?.id || 'user_me';

    rawIds.forEach((id) => {
      // Check if this ID represents the current user
      const isMe = id === 'user_me' || id === authUser?.id || (globalUsers?.[id]?.email && authUser?.email && globalUsers[id].email === authUser.email);

      if (isMe) {
        if (seenKeys.has('CURRENT_USER_CANONICAL')) return;
        seenKeys.add('CURRENT_USER_CANONICAL');
        seenKeys.add('user_me');
        if (authUser?.id) seenKeys.add(authUser.id);

        resolvedList.push({
          id: canonicalAuthId,
          name: authUser?.name || 'Fayozchek Yusubhonov',
          username: authUser?.username || 'fayozchek',
          avatar: authUser?.avatar,
          status: 'online',
        });
        return;
      }

      if (seenKeys.has(id)) return;
      seenKeys.add(id);

      const gUser = globalUsers?.[id];
      if (gUser) {
        if (authUser?.email && gUser.email === authUser.email) return;
        resolvedList.push({
          id: gUser.id,
          name: gUser.name || gUser.username || id,
          username: gUser.username,
          avatar: gUser.avatar,
          status: gUser.status || 'last seen recently',
        });
        return;
      }

      const known = knownUserProfiles[id];
      if (known) {
        resolvedList.push({
          id,
          name: known.name,
          username: known.username,
          avatar: known.avatar,
          status: known.status,
          role: known.role,
        });
        return;
      }

      const cleanName = id === 'user_tg_tips' ? 'Telegram Tips' : id.replace(/^user_/, '');
      resolvedList.push({
        id,
        name: cleanName,
        username: cleanName.toLowerCase().replace(/\s+/g, '_'),
        status: 'last seen recently',
      });
    });

    return resolvedList;
  }, [liveChat, user, globalUsers, authUser]);

  React.useEffect(() => {
    if (isOpen) {
      setSelectedMemberUser(null);
      setEditNameFirst(displayUser?.name?.split(' ')[0] || '');
      setEditNameLast(displayUser?.name?.split(' ').slice(1).join(' ') || '');
      setEditUsername(displayUser?.username || '');
      setEditBio(displayUser?.bio || '');
      setActiveProfileColor(displayUser?.profileColor || 'bg-blue-500');
      setActiveNameColor(displayUser?.nameColor || 'bg-yellow-500');
      setEditBirthday(displayUser?.birthday ? new Date(displayUser.birthday) : null);
      setIsEditMode(false);
      setActiveModal('none');
    }
  }, [isOpen, user?.id]);

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
            <p className={`text-[13px] leading-tight mb-3 ${textSub}`}>You can choose a username on Telegram. If you do, other people will be able to find you by this username and contact you easily.</p>
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
      
      const currentActiveColor = colorTab === 'profile' ? activeProfileColor : activeNameColor;
      const setCurrentColor = colorTab === 'profile' ? setActiveProfileColor : setActiveNameColor;
      
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
              <button onClick={() => setColorTab('profile')} className={`flex-1 py-3 text-center font-medium ${colorTab === 'profile' ? 'text-sky-500 border-b-2 border-sky-500' : textSub}`}>Profile</button>
              <button onClick={() => setColorTab('name')} className={`flex-1 py-3 text-center font-medium ${colorTab === 'name' ? 'text-sky-500 border-b-2 border-sky-500' : textSub}`}>Name</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
              <div className="flex flex-col items-center mb-6">
                <div className={`w-20 h-20 rounded-full border-[3px] ${activeProfileColor.replace('bg-', 'border-')} p-1 mb-2`}>
                  <img src={displayUser.avatar || 'https://i.pravatar.cc/150'} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                </div>
                <h3 className={`font-medium ${activeNameColor.replace('bg-', 'text-')}`}>{displayUser.name}</h3>
                <span className="text-sky-500 text-sm">online</span>
              </div>
              
              <div className="flex flex-wrap gap-3 justify-center mb-6">
                {colors.map((c, i) => (
                  <div key={i} onClick={() => setCurrentColor(c)} className={`w-10 h-10 rounded-full ${c} cursor-pointer hover:scale-110 transition-transform ${currentActiveColor === c ? 'ring-[3px] ring-sky-500 ring-offset-[3px] ring-offset-[#17212b]' : ''}`} />
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
              <button className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors" onClick={() => { updateUserProfile({ profileColor: activeProfileColor, nameColor: activeNameColor }); setActiveModal('none'); }}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/></svg>
                APPLY STYLE
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    
    if (activeModal === 'birthday') {
      const currentDate = editBirthday || new Date(2000, 0, 1);
      const day = currentDate.getDate();
      const month = currentDate.getMonth(); // 0-11
      const year = currentDate.getFullYear();
      
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

      const setBirthdayPart = (type: 'day' | 'month' | 'year', val: number) => {
        let y = year;
        let m = month;
        let d = day;
        if (type === 'year') y = val;
        if (type === 'month') m = val;
        if (type === 'day') d = val;

        const maxDays = new Date(y, m + 1, 0).getDate();
        if (d > maxDays) d = maxDays;

        setEditBirthday(new Date(y, m, d));
      };

      const dateInputValue = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      return (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setActiveModal('none')} />
          <div className={`relative w-full max-w-[320px] rounded-xl shadow-2xl z-10 ${bgModal} p-5 animate-in fade-in zoom-in-95`}>
            <h3 className="text-[17px] font-medium mb-4">Set your Birthday</h3>

            {/* Dropdown Selectors */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {/* Day */}
              <div className="flex flex-col items-center">
                <span className={`text-[11px] mb-1 font-medium ${textSub}`}>Day</span>
                <select
                  value={day}
                  onChange={(e) => setBirthdayPart('day', parseInt(e.target.value))}
                  className={`w-full py-2 px-1 rounded-lg border text-sm font-semibold text-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                    isLight ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-[#242f3d] border-gray-700 text-white'
                  }`}
                >
                  {Array.from({ length: new Date(year, month + 1, 0).getDate() }, (_, i) => i + 1).map((dNum) => (
                    <option key={dNum} value={dNum}>{dNum}</option>
                  ))}
                </select>
              </div>

              {/* Month */}
              <div className="flex flex-col items-center">
                <span className={`text-[11px] mb-1 font-medium ${textSub}`}>Month</span>
                <select
                  value={month}
                  onChange={(e) => setBirthdayPart('month', parseInt(e.target.value))}
                  className={`w-full py-2 px-1 rounded-lg border text-sm font-semibold text-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                    isLight ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-[#242f3d] border-gray-700 text-white'
                  }`}
                >
                  {monthNames.map((mName, idx) => (
                    <option key={mName} value={idx}>{mName.slice(0, 3)}</option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div className="flex flex-col items-center">
                <span className={`text-[11px] mb-1 font-medium ${textSub}`}>Year</span>
                <select
                  value={year}
                  onChange={(e) => setBirthdayPart('year', parseInt(e.target.value))}
                  className={`w-full py-2 px-1 rounded-lg border text-sm font-semibold text-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                    isLight ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-[#242f3d] border-gray-700 text-white'
                  }`}
                >
                  {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map((yNum) => (
                    <option key={yNum} value={yNum}>{yNum}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Visual Wheel Preview Bar */}
            <div className="relative flex justify-between items-center h-[90px] mb-4 px-3 rounded-lg overflow-hidden border border-black/10 bg-black/5">
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-8 border-y border-sky-500/30 bg-sky-500/10 pointer-events-none"></div>

              {/* Day Wheel Column */}
              <div className="flex flex-col items-center gap-1 text-[13px] z-10 flex-1">
                <button type="button" onClick={() => setBirthdayPart('day', day > 1 ? day - 1 : 31)} className={`${textSub} opacity-50 hover:opacity-100`}>
                  {day - 1 > 0 ? day - 1 : 31}
                </button>
                <span className="font-bold text-sky-400">{day}</span>
                <button type="button" onClick={() => setBirthdayPart('day', day < 31 ? day + 1 : 1)} className={`${textSub} opacity-50 hover:opacity-100`}>
                  {day + 1 <= 31 ? day + 1 : 1}
                </button>
              </div>

              {/* Month Wheel Column */}
              <div className="flex flex-col items-center gap-1 text-[13px] z-10 flex-1">
                <button type="button" onClick={() => setBirthdayPart('month', (month + 11) % 12)} className={`${textSub} opacity-50 hover:opacity-100`}>
                  {monthNames[(month + 11) % 12].slice(0, 3)}
                </button>
                <span className="font-bold text-sky-400">{monthNames[month].slice(0, 3)}</span>
                <button type="button" onClick={() => setBirthdayPart('month', (month + 1) % 12)} className={`${textSub} opacity-50 hover:opacity-100`}>
                  {monthNames[(month + 1) % 12].slice(0, 3)}
                </button>
              </div>

              {/* Year Wheel Column */}
              <div className="flex flex-col items-center gap-1 text-[13px] z-10 flex-1">
                <button type="button" onClick={() => setBirthdayPart('year', year - 1)} className={`${textSub} opacity-50 hover:opacity-100`}>
                  {year - 1}
                </button>
                <span className="font-bold text-sky-400">{year}</span>
                <button type="button" onClick={() => setBirthdayPart('year', year + 1)} className={`${textSub} opacity-50 hover:opacity-100`}>
                  {year + 1}
                </button>
              </div>
            </div>

            {/* Native Calendar Picker Input */}
            <div className="mb-5">
              <input
                type="date"
                value={dateInputValue}
                onChange={(e) => {
                  if (e.target.value) {
                    const [y, m, d] = e.target.value.split('-').map(Number);
                    setEditBirthday(new Date(y, m - 1, d));
                  } else {
                    setEditBirthday(null);
                  }
                }}
                className={`w-full py-2 px-3 rounded-lg border text-sm font-medium focus:outline-none focus:border-sky-500 ${
                  isLight ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-[#242f3d] border-gray-700 text-white'
                }`}
              />
            </div>

            <div className="flex justify-end gap-4">
              <button onClick={() => setActiveModal('none')} className="text-sky-500 font-medium hover:text-sky-600">Cancel</button>
              <button onClick={() => {
                if (editBirthday) {
                  const formatted = editBirthday.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
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
    }
  };

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
              <div className={`relative w-20 h-20 rounded-full flex items-center justify-center text-4xl font-bold mb-3 border-[3px] p-[2px] ${displayUser.profileColor ? displayUser.profileColor.replace('bg-', 'border-') : 'border-blue-500'}`}>
                {displayUser.avatar ? (
                  <img src={displayUser.avatar} alt={displayUser.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  (displayUser.name || 'U')[0]
                )}
                <div onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-blue-500 p-1.5 rounded-full border-2 border-[#17212b] cursor-pointer hover:bg-blue-600 transition-colors">
                  <Camera className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <h2 className={`text-lg font-medium mb-0.5 ${displayUser.nameColor ? displayUser.nameColor.replace('bg-', 'text-') : (displayUser.profileColor ? displayUser.profileColor.replace('bg-', 'text-') : '')}`}>{displayUser.name}</h2>
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
                  Username lets people contact you on Telegram easily.
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
      <div className={`relative w-[360px] max-h-[85vh] rounded-xl shadow-2xl z-10 animate-in fade-in zoom-in-95 flex flex-col overflow-hidden ${bgModal}`}>
        
        {/* Top Controls */}
        <div className="absolute top-3 left-3 flex items-center gap-2 z-20">
          {selectedMemberUser && (
            <button 
              onClick={() => setSelectedMemberUser(null)} 
              className="p-1.5 rounded-full hover:bg-black/10 transition-colors flex items-center gap-1 text-white"
              title="Back to group"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          )}
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
          {!isGroupOrChannel && (displayUser.id === authUser?.id) && (
            <button onClick={() => setIsEditMode(true)} className="p-1.5 rounded-full hover:bg-black/10 transition-colors" title="Edit Profile">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white">
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
              </svg>
            </button>
          )}
          <button onClick={handleClose} className="p-1.5 rounded-full hover:bg-black/10 transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Header with Avatar, Name, Subtitle, and Group Action buttons */}
        <div className={`pt-6 pb-4 px-4 relative flex flex-col items-center ${bgHeader}`}>
          <div className="w-20 h-20 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center text-3xl font-bold mb-3 border-2 border-[#1e2c3a] shrink-0 shadow-md">
            {displayUser.avatar ? (
              <img src={displayUser.avatar} alt={displayUser.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-white">{(displayUser.name || 'U')[0]}</span>
            )}
          </div>
          <h2 className="text-lg font-semibold text-white mb-0.5 text-center px-4 line-clamp-1">{displayUser.name}</h2>
          <p className="text-xs text-sky-300 mb-3">
            {isGroupOrChannel ? `${membersList.length} ${membersList.length === 1 ? 'member' : 'members'}` : (displayUser.status || 'online')}
          </p>

          {/* Group Action Buttons (Mute, Manage, Leave, More) */}
          {isGroupOrChannel && (
            <div className="flex items-center justify-center gap-6 w-full pt-2 pb-1">
              <button
                onClick={() => {
                  toggleMute(displayUser.id);
                  showToast("Mute settings updated");
                }}
                className="flex flex-col items-center gap-1.5 text-white/80 hover:text-white transition-colors group"
              >
                <div className="p-2.5 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                  <BellOff className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium">Mute</span>
              </button>

              <button
                onClick={() => showToast("Manage group settings")}
                className="flex flex-col items-center gap-1.5 text-white/80 hover:text-white transition-colors group"
              >
                <div className="p-2.5 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                  <Sliders className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium">Manage</span>
              </button>

              {isJoinedGroup ? (
                <button
                  onClick={() => {
                    const targetGroupId = liveChat?.id || user?.id;
                    if (targetGroupId) {
                      leaveChat(targetGroupId);
                      showToast("Left group");
                      handleClose();
                    }
                  }}
                  className="flex flex-col items-center gap-1.5 text-white/80 hover:text-white transition-colors group cursor-pointer"
                >
                  <div className="p-2.5 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                    <LogOut className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium">Leave</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    const targetGroupId = liveChat?.id || user?.id;
                    if (targetGroupId) {
                      joinChat(targetGroupId);
                      showToast("Joined group");
                    }
                  }}
                  className="flex flex-col items-center gap-1.5 text-sky-300 hover:text-white transition-colors group cursor-pointer"
                >
                  <div className="p-2.5 rounded-full bg-sky-500 group-hover:bg-sky-400 text-white transition-colors">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-sky-300">Join</span>
                </button>
              )}

              <button
                onClick={() => showToast("More options")}
                className="flex flex-col items-center gap-1.5 text-white/80 hover:text-white transition-colors group"
              >
                <div className="p-2.5 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium">More</span>
              </button>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className={`p-4 flex flex-col flex-1 overflow-y-auto no-scrollbar divide-y ${isLight ? 'bg-white divide-slate-100' : 'bg-[#17212b] divide-gray-800/40'}`}>
          
          {/* Description or Bio */}
          {displayUser.bio && (
            <div className="pb-3">
              <span className={`text-[15px] font-medium ${isLight ? 'text-slate-800' : 'text-gray-100'} block`}>
                {displayUser.bio}
              </span>
              <span className={`text-xs ${textSub} mt-0.5 block`}>
                {isGroupOrChannel ? 'Description' : 'Bio'}
              </span>
            </div>
          )}

          {/* Media counters for groups */}
          {isGroupOrChannel && (
            <div className="py-3 flex items-center gap-6 text-sm">
              <div onClick={() => showToast("1 photo in media gallery")} className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                <ImageIcon className="w-4.5 h-4.5 text-sky-500" />
                <span className={`font-medium ${isLight ? 'text-slate-800' : 'text-gray-200'}`}>1 photo</span>
              </div>
              <div onClick={() => showToast("1 file shared")} className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                <FileText className="w-4.5 h-4.5 text-sky-500" />
                <span className={`font-medium ${isLight ? 'text-slate-800' : 'text-gray-200'}`}>1 file</span>
              </div>
            </div>
          )}

          {/* Members list section */}
          {isGroupOrChannel ? (
            <div className="pt-3 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-sky-500 uppercase tracking-wider">
                  {membersList.length} {membersList.length === 1 ? 'MEMBER' : 'MEMBERS'}
                </span>
                <button
                  onClick={() => showToast("Add member wizard coming soon")}
                  className="p-1 rounded hover:bg-black/10 text-sky-500 transition-colors flex items-center gap-1 text-xs font-semibold"
                  title="Add member"
                >
                  <UserPlus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col gap-1.5">
                {membersList.map((member) => (
                  <div 
                    key={member.id} 
                    onClick={() => {
                      let u: User;
                      if (member.id === authUser?.id) {
                        u = authUser;
                      } else if (globalUsers?.[member.id]) {
                        u = globalUsers[member.id];
                      } else {
                        u = {
                          id: member.id,
                          name: member.name,
                          username: member.username || member.name.toLowerCase().replace(/\s+/g, '_'),
                          avatar: member.avatar,
                          bio: member.id === authUser?.id ? authUser?.bio : 'Group member',
                          status: member.status || 'online',
                        } as User;
                      }
                      setSelectedMemberUser(u);
                    }}
                    className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center shrink-0">
                        {member.avatar ? (
                          <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white font-semibold">{(member.name || 'U')[0]}</span>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className={`text-sm font-medium truncate ${isLight ? 'text-slate-800' : 'text-gray-100'}`}>
                          {member.name}
                        </span>
                        <span className={`text-xs ${member.status === 'online' ? 'text-sky-400 font-medium' : textSub}`}>
                          {member.status || 'last seen recently'}
                        </span>
                      </div>
                    </div>

                    {member.role === 'owner' && (
                      <span className="text-[10px] uppercase font-bold text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded shrink-0">
                        owner
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* User profile info */
            <div className="py-2 flex flex-col gap-3">
              {displayUser.id !== authUser?.id && (
                <button
                  type="button"
                  onClick={() => {
                    startChatWithUser(displayUser);
                    handleClose();
                  }}
                  className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-medium text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer mb-2 active:scale-98"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              )}
              {displayUser.email && (
                <div className="flex flex-col">
                  <span className={`text-[15px] font-medium ${isLight ? 'text-slate-800' : 'text-gray-100'}`}>
                    {displayUser.email}
                  </span>
                  <span className={`text-[13px] ${textSub}`}>Google (Email)</span>
                </div>
              )}

              <div className="flex items-center justify-between cursor-pointer group">
                <div className="flex flex-col">
                  <span className="text-[15px] text-sky-400 font-medium group-hover:underline">
                    @{displayUser.username || 'fayozchek'}
                  </span>
                  <span className={`text-[13px] ${textSub}`}>Username</span>
                </div>
                <button className={`p-2 rounded-lg transition-colors ${isLight ? 'hover:bg-slate-100' : 'hover:bg-[#202b36]'}`}>
                  <QrCode className="w-6 h-6 text-sky-400" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
