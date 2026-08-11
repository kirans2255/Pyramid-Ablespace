'use client';

import React from 'react';
import { X, UserPlus } from 'lucide-react';

interface Props {
  onClose: () => void;
  onAccountSelect: (account: { name: string; email: string; avatar?: string }) => void;
  showAddAccountForm: boolean;
  setShowAddAccountForm: (show: boolean) => void;
  customEmailInput: string;
  setCustomEmailInput: (v: string) => void;
  customNameInput: string;
  setCustomNameInput: (v: string) => void;
  onAddAccountSubmit: (e: React.FormEvent) => void;
}

export function GoogleAccountChooserModal({
  onClose,
  onAccountSelect,
  showAddAccountForm,
  setShowAddAccountForm,
  customEmailInput,
  setCustomEmailInput,
  customNameInput,
  setCustomNameInput,
  onAddAccountSubmit,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#18181B] text-white border border-zinc-800 w-full max-w-[380px] rounded-2xl shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-zinc-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Google Header */}
        <div className="flex items-center gap-2 mb-6">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.35 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.21 0 10.05 0 12s.47 3.79 1.29 5.42l3.99-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span className="text-xs font-semibold text-zinc-300">Sign in with Google</span>
        </div>

        <h2 className="text-xl font-bold mb-1">Choose an account</h2>
        <p className="text-xs text-zinc-400 mb-6">to continue to <span className="font-semibold text-white">Pyramid</span></p>

        {!showAddAccountForm ? (
          <div className="space-y-3">
            {/* Account Item 1 (Pheonix Phi) */}
            <button
              onClick={() =>
                onAccountSelect({
                  name: 'Pheonix Phi',
                  email: 'phepheonix@gmail.com',
                  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                })
              }
              className="w-full flex items-center justify-between p-3 rounded-xl border border-zinc-800 hover:bg-zinc-800/60 transition-colors text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-700 text-zinc-200 font-semibold flex items-center justify-center text-xs">
                  P
                </div>
                <div>
                  <p className="text-xs font-semibold text-white group-hover:text-brand-400 transition-colors">
                    Pheonix Phi
                  </p>
                  <p className="text-[11px] text-zinc-400">phepheonix@gmail.com</p>
                </div>
              </div>
              <span className="text-[10px] text-zinc-500">Signed out</span>
            </button>

            {/* Account Item 2 (Dexter Admin) */}
            <button
              onClick={() =>
                onAccountSelect({
                  name: 'Dexter Admin',
                  email: 'dexter@pyramid.app',
                  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
                })
              }
              className="w-full flex items-center justify-between p-3 rounded-xl border border-zinc-800 hover:bg-zinc-800/60 transition-colors text-left group"
            >
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
                  alt="Dexter"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="text-xs font-semibold text-white group-hover:text-brand-400 transition-colors">
                    Dexter Admin
                  </p>
                  <p className="text-[11px] text-zinc-400">dexter@pyramid.app</p>
                </div>
              </div>
            </button>

            {/* Use another account option */}
            <button
              onClick={() => setShowAddAccountForm(true)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-800/60 transition-colors text-left text-xs font-medium text-zinc-300"
            >
              <UserPlus className="w-4 h-4 text-zinc-400" />
              <span>Use another account</span>
            </button>
          </div>
        ) : (
          /* Custom Account Form */
          <form onSubmit={onAddAccountSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Google Email Address *
              </label>
              <input
                type="email"
                required
                value={customEmailInput}
                onChange={(e) => setCustomEmailInput(e.target.value)}
                placeholder="user@gmail.com"
                className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Name</label>
              <input
                type="text"
                value={customNameInput}
                onChange={(e) => setCustomNameInput(e.target.value)}
                placeholder="User Name"
                className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddAccountForm(false)}
                className="flex-1 py-2 text-xs font-medium text-zinc-400 hover:text-white"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-white text-black font-semibold text-xs rounded-xl hover:bg-zinc-200"
              >
                Continue
              </button>
            </div>
          </form>
        )}

        <p className="mt-6 text-[10px] text-zinc-500 leading-normal border-t border-zinc-800/80 pt-4">
          Before using this app, you can review Pyramid&apos;s{' '}
          <a href="#" className="underline text-zinc-400 hover:text-white">
            Privacy Policy
          </a>{' '}
          and{' '}
          <a href="#" className="underline text-zinc-400 hover:text-white">
            Terms of Service
          </a>
          .
        </p>
      </div>
    </div>
  );
}
