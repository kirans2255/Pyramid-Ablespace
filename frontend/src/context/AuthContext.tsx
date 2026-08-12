'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { guestLoginApi, googleLoginApi } from '@/services/api';

export interface UserProfile {
  _id?: string;
  id?: string;
  email: string;
  name: string;
  title?: string;
  avatar?: string;
  role: string;
  username?: string;
  isGuest: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  loginAsGuest: () => Promise<void>;
  loginWithGoogle: (data: { email: string; name: string; avatar?: string; googleId?: string }) => Promise<void>;
  updateUser: (updatedFields: Partial<UserProfile>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const sessionUser = sessionStorage.getItem('app_user');
      const sessionToken = sessionStorage.getItem('app_token');
      if (sessionUser && sessionToken) {
        setUser(JSON.parse(sessionUser));
        setToken(sessionToken);
      } else {
        const savedUser = localStorage.getItem('app_user');
        const savedToken = localStorage.getItem('app_token');
        if (savedUser && savedToken) {
          const parsed = JSON.parse(savedUser);
          if (!parsed.isGuest) {
            setUser(parsed);
            setToken(savedToken);
          } else {
            localStorage.removeItem('app_user');
            localStorage.removeItem('app_token');
          }
        }
      }
    } catch (err) {
      console.error('Failed to parse auth token', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loginAsGuest = async () => {
    localStorage.removeItem('app_user');
    localStorage.removeItem('app_token');
    try {
      const data = await guestLoginApi();
      setUser(data.user);
      setToken(data.token);
      sessionStorage.setItem('app_user', JSON.stringify(data.user));
      sessionStorage.setItem('app_token', data.token);
    } catch (err) {
      const names = ['Cosmic Explorer', 'Pixel Wanderer', 'Starlight Pioneer', 'Digital Voyager', 'Neon Architect', 'Quantum Rover'];
      const avatars = [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=150',
        'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=150',
        'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=150',
      ];
      const rName = names[Math.floor(Math.random() * names.length)];
      const rAvatar = avatars[Math.floor(Math.random() * avatars.length)];
      const rCode = Math.random().toString(36).substring(2, 7);

      const defaultUser = {
        _id: `guest-${rCode}`,
        email: `guest_${rCode}@pyramid.app`,
        name: rName,
        avatar: rAvatar,
        role: 'Guest Explorer',
        username: rName.toLowerCase().replace(/\s+/g, '_'),
        isGuest: true,
      };
      setUser(defaultUser);
      setToken(`guest-session-token-${rCode}`);
      sessionStorage.setItem('app_user', JSON.stringify(defaultUser));
      sessionStorage.setItem('app_token', `guest-session-token-${rCode}`);
    }
  };

  const loginWithGoogle = async (googleData: { email: string; name: string; avatar?: string; googleId?: string }) => {
    sessionStorage.removeItem('app_user');
    sessionStorage.removeItem('app_token');
    try {
      const data = await googleLoginApi(googleData);
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('app_user', JSON.stringify(data.user));
      localStorage.setItem('app_token', data.token);
    } catch (err) {
      const gUser = {
        _id: googleData.googleId || `google-${googleData.email}`,
        email: googleData.email,
        name: googleData.name,
        avatar: googleData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        role: 'Admin',
        username: googleData.email.split('@')[0],
        isGuest: false,
      };
      setUser(gUser);
      setToken(`google-token-${googleData.email}`);
      localStorage.setItem('app_user', JSON.stringify(gUser));
      localStorage.setItem('app_token', `google-token-${googleData.email}`);
    }
  };

  const updateUser = (updatedFields: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedFields };
      if (prev.isGuest) {
        sessionStorage.setItem('app_user', JSON.stringify(updated));
      } else {
        localStorage.setItem('app_user', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem('app_user');
    sessionStorage.removeItem('app_token');
    localStorage.removeItem('app_user');
    localStorage.removeItem('app_token');
    window.location.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, loginAsGuest, loginWithGoogle, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
