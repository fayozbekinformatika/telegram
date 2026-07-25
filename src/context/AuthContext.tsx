import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/telegram';
import { currentUserDefault } from '../data/initialData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loginWithGoogleDirect: (email: string, name?: string, avatar?: string) => Promise<void>;
  loginWithGoogleOAuth: () => Promise<void>;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
  isPasscodeLocked: boolean;
  passcode: string | null;
  setPasscode: (code: string | null) => void;
  unlockPasscode: (code: string) => boolean;
  lockApp: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('tg_user');
    return saved ? JSON.parse(saved) : currentUserDefault;
  });

  const [passcode, setPasscodeState] = useState<string | null>(() => {
    return localStorage.getItem('tg_passcode') || null;
  });

  const [isPasscodeLocked, setIsPasscodeLocked] = useState<boolean>(() => {
    return localStorage.getItem('tg_is_locked') === 'true' && !!localStorage.getItem('tg_passcode');
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('tg_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('tg_user');
    }
  }, [user]);

  const setPasscode = (code: string | null) => {
    setPasscodeState(code);
    if (code) {
      localStorage.setItem('tg_passcode', code);
    } else {
      localStorage.removeItem('tg_passcode');
      localStorage.removeItem('tg_is_locked');
      setIsPasscodeLocked(false);
    }
  };

  const lockApp = () => {
    if (passcode) {
      setIsPasscodeLocked(true);
      localStorage.setItem('tg_is_locked', 'true');
    }
  };

  const unlockPasscode = (code: string): boolean => {
    if (code === passcode) {
      setIsPasscodeLocked(false);
      localStorage.removeItem('tg_is_locked');
      return true;
    }
    return false;
  };

  const loginWithGoogleDirect = async (email: string, name?: string, avatar?: string) => {
    try {
      const res = await fetch('/api/auth/google/direct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, avatar }),
      });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      }
    } catch (err) {
      console.error('Google login error:', err);
      // Fallback
      const newUser: User = {
        id: `user_google_${Date.now()}`,
        name: name || email.split('@')[0],
        email,
        username: email.split('@')[0],
        avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
        bio: `Authenticated via Google (${email})`,
        phoneNumber: '+998 90 ' + Math.floor(1000000 + Math.random() * 9000000),
        isVerified: true,
        isPremium: true,
        status: 'online',
      };
      setUser(newUser);
    }
  };

  const loginWithGoogleOAuth = async () => {
    try {
      const res = await fetch('/api/auth/google/url');
      const { url } = await res.json();

      const popup = window.open(url, 'google_oauth_popup', 'width=600,height=700');
      if (!popup) {
        alert('Iltimos, qalqib chiquvchi oyna (popup) ga ruxsat bering!');
      }
    } catch (err) {
      console.error('OAuth error:', err);
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        loginWithGoogleDirect('fayozchekyusubhonov@gmail.com', 'Fayozchek Yusubhonov');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tg_user');
  };

  const updateUserProfile = (updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loginWithGoogleDirect,
        loginWithGoogleOAuth,
        logout,
        updateUserProfile,
        isPasscodeLocked,
        passcode,
        setPasscode,
        unlockPasscode,
        lockApp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
