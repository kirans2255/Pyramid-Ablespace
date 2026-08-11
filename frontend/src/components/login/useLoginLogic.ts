'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useGoogleLogin } from '@react-oauth/google';

export function useLoginLogic() {
  const { loginAsGuest, loginWithGoogle } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showAccountChooser, setShowAccountChooser] = useState(false);
  const [customEmailInput, setCustomEmailInput] = useState('');
  const [customNameInput, setCustomNameInput] = useState('');
  const [showAddAccountForm, setShowAddAccountForm] = useState(false);

  const handleGuestLogin = async () => {
    setLoading(true);
    await loginAsGuest();
    router.replace('/dashboard');
  };

  const triggerGoogleOAuth = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const profile = await res.json();
        await loginWithGoogle({
          email: profile.email,
          name: profile.name,
          avatar: profile.picture,
          googleId: profile.sub,
        });
        router.replace('/dashboard');
      } catch (err) {
        console.error('Google profile fetch error:', err);
        setShowAccountChooser(true);
      } finally {
        setLoading(false);
      }
    },
    onError: (errorResponse) => {
      console.warn('Google OAuth error or fallback:', errorResponse);
      setShowAccountChooser(true);
    },
  });

  const handleGoogleButtonClick = () => {
    try {
      triggerGoogleOAuth();
    } catch (err) {
      setShowAccountChooser(true);
    }
  };

  const handleAccountSelect = async (account: { name: string; email: string; avatar?: string }) => {
    setLoading(true);
    setShowAccountChooser(false);
    await loginWithGoogle({
      email: account.email,
      name: account.name,
      avatar: account.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${account.email}`,
      googleId: `google-${account.email}`,
    });
    setLoading(false);
    router.replace('/dashboard');
  };

  const handleAddAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmailInput.trim()) return;
    const name = customNameInput.trim() || customEmailInput.split('@')[0];
    await handleAccountSelect({
      name,
      email: customEmailInput.trim(),
    });
  };

  return {
    loading,
    showAccountChooser,
    setShowAccountChooser,
    customEmailInput,
    setCustomEmailInput,
    customNameInput,
    setCustomNameInput,
    showAddAccountForm,
    setShowAddAccountForm,
    handleGuestLogin,
    handleGoogleButtonClick,
    handleAccountSelect,
    handleAddAccountSubmit,
  };
}
