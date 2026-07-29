import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/telegram';
import { currentUserDefault } from '../data/initialData';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../lib/firebase';

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
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.id === 'user_me') {
          localStorage.removeItem('tg_user');
          return null;
        }
        return parsed;
      } catch (e) {
        return null;
      }
    }
    return null;
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
        isVerified: true,
        isPremium: true,
        status: 'online', lastSeen: Date.now(),
      };
      setUser(newUser);
    }
  };

  const loginWithGoogleOAuth = async () => {
    console.log("loginWithGoogleOAuth called");
    try {
      if (isFirebaseConfigured() && auth) {
        console.log("Firebase is configured, calling signInWithPopup...");
        const result = await signInWithPopup(auth, googleProvider);
        console.log("signInWithPopup succeeded!", result);
        const fbUser = result.user;
        const newUser: User = {
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
          email: fbUser.email || '',
          username: fbUser.email?.split('@')[0] || 'user',
          avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${fbUser.email}`,
          bio: `Authenticated via Google`,
          isVerified: true,
          isPremium: true,
          status: 'online', lastSeen: Date.now(),
        };
        setUser(newUser);
      } else {
        console.warn('Firebase config missing');
        throw new Error('Firebase configuration is missing.');
      }
    } catch (err) {
      console.error('Firebase Auth error:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (auth && isFirebaseConfigured()) {
      const unsubscribe = auth.onAuthStateChanged((fbUser) => {
        if (fbUser) {
           setUser((prev) => {
              if (prev && prev.id === fbUser.uid) return prev;
              return {
                id: fbUser.uid,
                name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
                email: fbUser.email || '',
                username: fbUser.email?.split('@')[0] || 'user',
                avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${fbUser.email}`,
                bio: `Authenticated via Google`,
                isVerified: true,
                isPremium: true,
                status: 'online', lastSeen: Date.now(),
              };
           });
        }
      });
      return () => unsubscribe();
    }
  }, []);

  const logout = async () => {
    if (auth && isFirebaseConfigured()) {
       await auth.signOut();
    }
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
