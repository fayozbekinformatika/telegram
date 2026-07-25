import React, { useState } from 'react';
import { Lock, Key, X, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface PasscodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PasscodeModal: React.FC<PasscodeModalProps> = ({ isOpen, onClose }) => {
  const { passcode, setPasscode, isPasscodeLocked, unlockPasscode } = useAuth();
  const [code, setCodeText] = useState('');
  const [error, setError] = useState('');

  if (!isOpen && !isPasscodeLocked) return null;

  const handleSetPasscode = () => {
    if (code.length < 4) {
      setError('Passcode minimum 4 digits');
      return;
    }
    setPasscode(code);
    setCodeText('');
    setError('');
    alert('Passcode lock set successfully!');
    onClose();
  };

  const handleUnlock = () => {
    if (unlockPasscode(code)) {
      setCodeText('');
      setError('');
      onClose();
    } else {
      setError('Incorrect passcode! Please try again.');
    }
  };

  const handleRemovePasscode = () => {
    setPasscode(null);
    setCodeText('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#17212b] text-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-gray-800 p-6 flex flex-col items-center text-center">
        {!isPasscodeLocked && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="w-16 h-16 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4 border border-purple-500/40">
          <Lock className="w-8 h-8" />
        </div>

        <h2 className="text-lg font-bold text-white mb-1">
          {isPasscodeLocked ? 'Telegram Web Locked' : passcode ? 'Manage Passcode' : 'Set Passcode Lock'}
        </h2>
        <p className="text-xs text-gray-400 mb-6">
          {isPasscodeLocked
            ? 'Enter your 4-digit PIN code to unlock Telegram Web.'
            : passcode
            ? 'Your application is currently protected by a passcode.'
            : 'Enter a 4-digit PIN code to protect your chats.'}
        </p>

        {error && (
          <div className="w-full bg-red-500/10 text-red-400 border border-red-500/30 text-xs p-2.5 rounded-xl mb-4 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <input
          type="password"
          maxLength={8}
          placeholder="••••"
          value={code}
          onChange={(e) => {
            setCodeText(e.target.value);
            setError('');
          }}
          className="w-full bg-[#0e1621] text-center text-xl tracking-widest text-white py-3 px-4 rounded-2xl border border-gray-700 focus:outline-none focus:border-purple-500 mb-6 font-mono"
        />

        <div className="w-full space-y-2">
          {isPasscodeLocked ? (
            <button
              onClick={handleUnlock}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl text-xs font-bold shadow-lg"
            >
              Unlock Application
            </button>
          ) : (
            <>
              <button
                onClick={handleSetPasscode}
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl text-xs font-bold shadow-lg"
              >
                {passcode ? 'Update Passcode' : 'Enable Passcode'}
              </button>

              {passcode && (
                <button
                  onClick={handleRemovePasscode}
                  className="w-full py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-2xl text-xs font-bold"
                >
                  Turn Off Passcode
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
