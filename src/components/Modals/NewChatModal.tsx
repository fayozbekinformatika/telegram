import React, { useState } from 'react';
import { X, Users, Radio, Lock, Plus } from 'lucide-react';
import { useTelegram } from '../../context/TelegramContext';
import { ChatType } from '../../types/telegram';

interface NewChatModalProps {
  isOpen: boolean;
  type: 'group' | 'channel' | 'secret' | null;
  onClose: () => void;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({ isOpen, type, onClose }) => {
  const { createNewChat } = useTelegram();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen || !type) return null;

  const handleCreate = () => {
    if (!name.trim()) return;
    createNewChat(name.trim(), type as ChatType, username.trim(), description.trim());
    setName('');
    setUsername('');
    setDescription('');
    onClose();
  };

  const getTitle = () => {
    if (type === 'group') return 'Create New Group';
    if (type === 'channel') return 'Create New Channel';
    return 'Start New Secret Chat';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#17212b] text-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-[#0e1621]">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            {type === 'group' && <Users className="w-5 h-5 text-emerald-400" />}
            {type === 'channel' && <Radio className="w-5 h-5 text-blue-400" />}
            {type === 'secret' && <Lock className="w-5 h-5 text-purple-400" />}
            <span>{getTitle()}</span>
          </h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">
              {type === 'secret' ? 'Contact Name' : `${type === 'group' ? 'Group' : 'Channel'} Name`}
            </label>
            <input
              type="text"
              placeholder={type === 'group' ? 'e.g. My Team' : 'e.g. Daily Tech News'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0e1621] text-xs text-white p-3 rounded-xl border border-gray-700 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Username (@link)</label>
            <input
              type="text"
              placeholder="e.g. my_public_link"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#0e1621] text-xs text-white p-3 rounded-xl border border-gray-700 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Description (Optional)</label>
            <textarea
              placeholder="Describe purpose..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full bg-[#0e1621] text-xs text-white p-3 rounded-xl border border-gray-700 focus:outline-none focus:border-sky-500 resize-none"
            />
          </div>
        </div>

        <div className="p-4 border-t border-gray-800 flex justify-end gap-2 bg-[#0e1621]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white rounded-xl hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-5 py-2 text-xs font-bold bg-sky-500 hover:bg-sky-400 text-white rounded-xl flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Create
          </button>
        </div>
      </div>
    </div>
  );
};
