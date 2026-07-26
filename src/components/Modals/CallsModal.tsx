import React from 'react';
import { Link2 } from 'lucide-react';
import { useTelegram } from '../../context/TelegramContext';
import { useToast } from '../../context/ToastContext';

interface CallsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CallsModal: React.FC<CallsModalProps> = ({ isOpen, onClose }) => {
  const { theme, startCall } = useTelegram();
  const { showToast } = useToast();

  const isLight = theme === 'light';
  
  if (!isOpen) return null;

  const bgModal = isLight ? 'bg-white text-slate-800' : 'bg-[#17212b] text-white';
  const textSub = isLight ? 'text-slate-500' : 'text-gray-400';
  const borderCol = isLight ? 'border-slate-100' : 'border-black/20';
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className={`relative w-full max-w-[340px] h-[500px] max-h-[85vh] flex flex-col rounded-xl shadow-2xl z-10 ${bgModal} animate-in fade-in zoom-in-95`}>
        {/* Header */}
        <div className={`flex items-center px-5 py-4`}>
          <h2 className="font-medium text-[17px] flex-1">Calls</h2>
        </div>
        
        {/* List */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div onClick={() => { startCall('New Group Call', 'https://ui-avatars.com/api/?name=GC&background=0D8ABC&color=fff', false); onClose(); showToast('Started new call'); }} className="flex items-center px-4 py-3 hover:bg-black/5 cursor-pointer transition-colors">
             <Link2 className="w-5 h-5 text-sky-500 mr-4" />
             <span className="text-sky-500 font-medium flex-1">Start New Call</span>
          </div>
          <div className={`px-4 py-2 ${textSub} text-[13px]`}>
            You can add up to 200 participants to a call.
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-end p-4 border-t border-black/10">
          <button onClick={onClose} className="text-sky-500 font-medium hover:text-sky-600">Close</button>
        </div>
      </div>
    </div>
  );
};
