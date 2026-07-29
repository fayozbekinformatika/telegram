import React, { useState } from 'react';
import { Search, SortAsc, X } from 'lucide-react';
import { useTelegram } from '../../context/TelegramContext';

interface ContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactsModal: React.FC<ContactsModalProps> = ({ isOpen, onClose }) => {
  const { theme, chats, createNewChat, setActiveChatId } = useTelegram();
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const isLight = theme === 'light';
  
  if (!isOpen) return null;

  const bgModal = isLight ? 'bg-white text-slate-800' : 'bg-[#17212b] text-white';
  const textSub = isLight ? 'text-slate-500' : 'text-gray-400';
  const borderCol = isLight ? 'border-slate-100' : 'border-black/20';
  const inputBg = isLight ? 'bg-slate-100' : 'bg-[#242f3d]';
  const inputBorder = isLight ? 'border-transparent' : 'border-[#17212b]';

  if (isAdding) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setIsAdding(false)} />
        <div className={`relative w-full max-w-[340px] flex flex-col rounded-xl shadow-2xl z-10 ${bgModal} animate-in fade-in zoom-in-95 p-5`}>
          <h2 className="font-medium text-[17px] mb-4">Add Contact</h2>
          <div className="space-y-4 mb-6">
            <div className="relative">
              <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={`w-full bg-transparent border-b ${borderCol} focus:border-sky-500 focus:outline-none pb-1 text-[15px]`} />
            </div>
            <div className="relative">
              <input type="text" placeholder="Last Name (optional)" value={lastName} onChange={(e) => setLastName(e.target.value)} className={`w-full bg-transparent border-b ${borderCol} focus:border-sky-500 focus:outline-none pb-1 text-[15px]`} />
            </div>
            <div className="relative">
              <input type="text" placeholder="Email or Username" value={email} onChange={(e) => setEmail(e.target.value)} className={`w-full bg-transparent border-b ${borderCol} focus:border-sky-500 focus:outline-none pb-1 text-[15px]`} />
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <button onClick={() => setIsAdding(false)} className="text-sky-500 font-medium hover:text-sky-600">Cancel</button>
            <button onClick={() => {
              if (firstName.trim() || email.trim()) {
                const name = (firstName + ' ' + lastName).trim() || email;
                // Add to contacts by creating a private chat (in our mock structure)
                // Assuming we can access createNewChat from context
                createNewChat(name, 'private', email, 'Added from contacts');
              }
              setIsAdding(false);
              setFirstName('');
              setLastName('');
              setEmail('');
            }} className="text-sky-500 font-medium hover:text-sky-600">Done</button>
          </div>
        </div>
      </div>
    );
  }



  const contacts = chats.filter(chat => chat.type === 'private');
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className={`relative w-full max-w-[340px] h-[500px] max-h-[85vh] flex flex-col rounded-xl shadow-2xl z-10 ${bgModal} animate-in fade-in zoom-in-95`}>
        {/* Header */}
        <div className={`flex items-center px-5 py-4`}>
          <h2 className="font-medium text-[17px] flex-1">Contacts</h2>
          <button className="p-2 hover:bg-black/5 rounded-full transition-colors mr-1 text-gray-400 hover:text-inherit">
            <SortAsc className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-black/5 rounded-full transition-colors hidden text-gray-400 hover:text-inherit">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Search */}
        <div className="px-3 pb-3">
          <div className={`flex items-center px-3 py-1.5 rounded-xl border-2 ${inputBorder} ${inputBg} focus-within:border-sky-500 focus-within:bg-transparent transition-colors`}>
            <Search className={`w-4 h-4 mr-2 ${textSub}`} />
            <input 
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent focus:outline-none text-[15px]"
            />
          </div>
        </div>
        
        {/* List */}
        <div className="flex-1 overflow-y-auto no-scrollbar py-2">
          {contacts.map((contact, i) => (
            <div key={contact.id} className="flex items-center px-4 py-2 hover:bg-black/5 cursor-pointer transition-colors" onClick={() => { setActiveChatId(contact.id); onClose(); }}>
              <div className="w-12 h-12 rounded-full bg-sky-500 overflow-hidden flex items-center justify-center font-bold text-white mr-3">
                {contact.avatar ? (
                  <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
                ) : (
                  contact.name.charAt(0)
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-[15px] truncate">{contact.name}</h3>
                <p className={`text-[13px] ${textSub}`}>
                  {'last seen recently'}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-black/10">
          <button onClick={() => setIsAdding(true)} className="text-sky-500 font-medium hover:text-sky-600">Add Contact</button>
          <button onClick={onClose} className="text-sky-500 font-medium hover:text-sky-600">Close</button>
        </div>
      </div>
    </div>
  );
};
