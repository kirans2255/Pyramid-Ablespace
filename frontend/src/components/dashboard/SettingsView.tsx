'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme, ColorMode } from '@/context/ThemeContext';
import { ArrowLeft, Search, User, Sun, Square, Edit2, Check, Save } from 'lucide-react';
import { updateProfileApi } from '@/services/api';

interface SettingsViewProps {
  onBackToApp: () => void;
}

export function SettingsView({ onBackToApp }: SettingsViewProps) {
  const { user, updateUser, logout } = useAuth();
  const { theme, colorMode, setTheme, setColorMode } = useTheme();

  const [activeTab, setActiveTab] = useState<'profile' | 'theme' | 'color'>('profile');
  const [searchQuery, setSearchQuery] = useState('');

  // Profile Form States
  const [fullName, setFullName] = useState(user?.name || 'Dexter');
  const [jobTitle, setJobTitle] = useState(user?.title || 'Designer');
  const [username, setUsername] = useState(user?.username || 'Dexter');
  const [email] = useState(user?.email || 'dexter@gmail.com');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const userAvatar =
    user?.avatar ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    try {
      const activeUserId = user?._id || user?.id || 'guest-1';
      await updateProfileApi(activeUserId, {
        name: fullName.trim(),
        title: jobTitle.trim(),
        username: username.trim(),
        email,
      });

      updateUser({
        name: fullName.trim(),
        title: jobTitle.trim(),
        username: username.trim(),
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update profile in DB', err);
    } finally {
      setSaving(false);
    }
  };

  const colorModes: { id: ColorMode; name: string; bgClass: string }[] = [
    { id: 'amber', name: 'Amber', bgClass: 'bg-amber-500' },
    { id: 'blue', name: 'Blue', bgClass: 'bg-indigo-600' },
    { id: 'pink', name: 'Pink', bgClass: 'bg-pink-500' },
    { id: 'rose', name: 'Rose', bgClass: 'bg-rose-500' },
    { id: 'emerald', name: 'Emerald', bgClass: 'bg-emerald-500' },
    { id: 'black', name: 'Black', bgClass: 'bg-zinc-900' },
  ];

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen p-4 sm:p-8 font-sans">
      <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-8 items-start">

        {/* Right Content Area */}
        <div className="flex-1 w-full max-w-2xl space-y-6">
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Profile</h1>
                {saveSuccess && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold animate-in fade-in">
                    <Check className="w-4 h-4" />
                    <span>Saved to Database!</span>
                  </div>
                )}
              </div>

              {/* Card 1: User Info Fields */}
              <form onSubmit={handleSaveProfile} className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
                {/* Profile Picture Row */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Profile picture</span>
                  <img
                    src={userAvatar}
                    alt={fullName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                </div>

                {/* Email Row */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{email}</span>
                    <button type="button" className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Full Name Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Full name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-slate-300"
                  />
                </div>

                {/* Title Input */}
                <div className="space-y-1.5">
                  <div className="flex items-baseline justify-between">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Title</label>
                    <span className="text-[11px] text-slate-400">Your job title or role</span>
                  </div>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-slate-300"
                  />
                </div>

                {/* Username Input */}
                <div className="space-y-1.5">
                  <div className="flex items-baseline justify-between">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Username</label>
                    <span className="text-[11px] text-slate-400">One word, like a nickname or first name</span>
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-slate-300"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-semibold shadow-xs hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{saving ? 'Saving...' : 'Save Profile'}</span>
                  </button>
                </div>
              </form>

              {/* Card 2: Workspace Access */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Workspace access</h3>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Remove yourself from the workspace</span>
                  <button
                    type="button"
                    onClick={() => logout?.()}
                    className="px-3.5 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl hover:bg-rose-100 transition-colors"
                  >
                    Leave Workspace
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Theme Preferences</h1>
              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Choose interface appearance mode</p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setTheme('light')}
                    className={`p-4 rounded-xl border text-left flex flex-col justify-between h-28 transition-all ${theme === 'light'
                      ? 'border-slate-900 dark:border-slate-100 ring-2 ring-slate-900/10 bg-slate-50'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <Sun className="w-5 h-5 text-slate-700" />
                      {theme === 'light' && <Check className="w-4 h-4 text-slate-900" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Light Mode</p>
                      <p className="text-[11px] text-slate-500">Default bright interface</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setTheme('dark')}
                    className={`p-4 rounded-xl border text-left flex flex-col justify-between h-28 transition-all ${theme === 'dark'
                      ? 'border-slate-100 ring-2 ring-slate-100/20 bg-slate-800'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-700'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <Sun className="w-5 h-5 text-slate-200 rotate-180" />
                      {theme === 'dark' && <Check className="w-4 h-4 text-slate-100" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-100">Dark Mode</p>
                      <p className="text-[11px] text-slate-400">Sleek dark interface</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'color' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Color Accent Mode</h1>
              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Select your preferred accent color theme</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {colorModes.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setColorMode(mode.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all ${colorMode === mode.id
                        ? 'border-slate-900 dark:border-slate-100 ring-2 ring-slate-400/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-4 h-4 rounded-full ${mode.bgClass}`} />
                        <span className="text-slate-800 dark:text-slate-200">{mode.name}</span>
                      </div>
                      {colorMode === mode.id && <Check className="w-3.5 h-3.5 text-slate-700 dark:text-slate-200" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
