import React, { useState } from 'react';
import { X, Plus, Trash2, BarChart2 } from 'lucide-react';
import { useTelegram } from '../../context/TelegramContext';
import { Poll } from '../../types/telegram';

interface PollCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PollCreateModal: React.FC<PollCreateModalProps> = ({ isOpen, onClose }) => {
  const { sendMessage, activeChatId } = useTelegram();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(['Option 1', 'Option 2']);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [allowsMultiple, setAllowsMultiple] = useState(false);

  if (!isOpen) return null;

  const handleAddOption = () => {
    if (options.length < 10) {
      setOptions([...options, `Option ${options.length + 1}`]);
    }
  };

  const handleOptionChange = (index: number, val: string) => {
    const newOpts = [...options];
    newOptionVal(index, val, newOpts);
    setOptions(newOpts);
  };

  const newOptionVal = (index: number, val: string, arr: string[]) => {
    arr[index] = val;
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleCreatePoll = () => {
    if (!question.trim() || !activeChatId) return;

    const pollObj: Poll = {
      id: `poll_${Date.now()}`,
      question: question.trim(),
      options: options.map((optText, i) => ({
        id: `opt_${i}`,
        text: optText || `Option ${i + 1}`,
        votes: 0,
        voters: [],
      })),
      isAnonymous,
      allowsMultiple,
    };

    sendMessage(activeChatId, '', 'poll', undefined, pollObj);
    setQuestion('');
    setOptions(['Option 1', 'Option 2']);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#17212b] text-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
        <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-[#0e1621]">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-emerald-400" />
            <span>New Poll</span>
          </h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">Poll Question</label>
            <input
              type="text"
              placeholder="Ask a question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full bg-[#0e1621] text-xs text-white p-3 rounded-xl border border-gray-700 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-400">Poll Options</label>
            {options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => handleOptionChange(i, e.target.value)}
                  className="flex-1 bg-[#0e1621] text-xs text-white p-2.5 rounded-xl border border-gray-700 focus:outline-none focus:border-sky-500"
                />
                {options.length > 2 && (
                  <button
                    onClick={() => handleRemoveOption(i)}
                    className="p-2 text-red-400 hover:bg-gray-800 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}

            {options.length < 10 && (
              <button
                onClick={handleAddOption}
                className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 mt-1"
              >
                <Plus className="w-4 h-4" /> Add an option
              </button>
            )}
          </div>

          <div className="pt-2 border-t border-gray-800 space-y-2">
            <label className="flex items-center justify-between text-xs text-gray-300 cursor-pointer">
              <span>Anonymous Voting</span>
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 rounded text-sky-500 bg-gray-800 border-gray-700 focus:ring-0"
              />
            </label>
            <label className="flex items-center justify-between text-xs text-gray-300 cursor-pointer">
              <span>Allow Multiple Answers</span>
              <input
                type="checkbox"
                checked={allowsMultiple}
                onChange={(e) => setAllowsMultiple(e.target.checked)}
                className="w-4 h-4 rounded text-sky-500 bg-gray-800 border-gray-700 focus:ring-0"
              />
            </label>
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
            onClick={handleCreatePoll}
            className="px-5 py-2 text-xs font-bold bg-sky-500 hover:bg-sky-400 text-white rounded-xl"
          >
            Create Poll
          </button>
        </div>
      </div>
    </div>
  );
};
