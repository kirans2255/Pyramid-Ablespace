'use client';

import React from 'react';
import { useLoginLogic } from './useLoginLogic';
import { GoogleAccountChooserModal } from './GoogleAccountChooserModal';

// Brand Header with custom Pyramid logo (Triangle with center dividing line)
export function PyramidHeader() {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {/* Black shield/rounded icon box containing triangle with vertical center line */}
      <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center">
        <svg
          className="w-4 h-4 text-white fill-none stroke-current"
          viewBox="0 0 24 24"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Outer Triangle */}
          <polygon points="12 3 3 20 21 20" />
          {/* Center Dividing Line */}
          <line x1="12" y1="3" x2="12" y2="20" />
        </svg>
      </div>
      <span className="font-semibold text-base text-black tracking-tight">
        Pyramid
      </span>
    </div>
  );
}

export function LoginPage() {
  const {
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
  } = useLoginLogic();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-slate-900">
      {/* Top Brand Header */}
      <PyramidHeader />

      {/* Auth Card Frame */}
      <div className="w-full max-w-[420px] bg-white border border-gray-200/80 rounded-3xl px-7 py-7 text-center shadow-sm">
        {/* Increased title size slightly from text-lg to text-xl */}
        <h1 className="text-xl font-bold text-gray-900 mb-1.5 tracking-tight">
          Let&apos;s get back on track
        </h1>
        {/* Increased subtitle size slightly from text-xs to text-sm */}
        <p className="text-sm text-gray-500 mb-6">
          Enter your email below to login to your account.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleGuestLogin}
            disabled={loading}
            /* Increased button text size slightly from text-xs to text-sm */
            className="w-full py-2.5 px-4 bg-[#18181B] hover:bg-black text-white text-sm font-semibold rounded-full transition-colors disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Continue as Guest'}
          </button>

          <button
            onClick={handleGoogleButtonClick}
            disabled={loading}
            /* Increased button text size slightly from text-xs to text-sm */
            className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 text-sm font-semibold rounded-full flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {/* Black Google "G" Icon */}
            <svg className="w-4 h-4 fill-black" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Login with Google</span>
          </button>
        </div>
      </div>

      {/* Footer Legal Text - Wrapped in 3 lines with slightly larger text-xs font */}
      <div className="mt-6 text-center text-xs text-gray-500 leading-relaxed">
        By clicking continue, you agree to
        <br />
        our{' '}
        <a href="#" className="underline font-semibold text-gray-600 hover:text-black">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="#" className="underline font-semibold text-gray-600 hover:text-black">
          Privacy
        </a>
        <br />
        <a href="#" className="underline font-semibold text-gray-600 hover:text-black">
          Policy
        </a>
      </div>

      {/* Google Account Chooser Modal */}
      {showAccountChooser && (
        <GoogleAccountChooserModal
          onClose={() => setShowAccountChooser(false)}
          onAccountSelect={handleAccountSelect}
          showAddAccountForm={showAddAccountForm}
          setShowAddAccountForm={setShowAddAccountForm}
          customEmailInput={customEmailInput}
          setCustomEmailInput={setCustomEmailInput}
          customNameInput={customNameInput}
          setCustomNameInput={setCustomNameInput}
          onAddAccountSubmit={handleAddAccountSubmit}
        />
      )}

      {/* Engaging Full-screen Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-md flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-200">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-4 border-slate-700 border-t-white animate-spin" />
            <div className="absolute w-7 h-7 bg-white rounded-lg flex items-center justify-center shadow-xl">
              <svg className="w-4 h-4 text-black fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5">
                <polygon points="12 3 3 20 21 20" />
                <line x1="12" y1="3" x2="12" y2="20" />
              </svg>
            </div>
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-bold text-white tracking-wide">Authenticating Session</p>
            <p className="text-xs text-slate-300 animate-pulse font-medium">Setting up workspace environment...</p>
          </div>
        </div>
      )}
    </div>
  );
}