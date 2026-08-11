'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme, ThemeMode, ColorMode } from '@/context/ThemeContext';
import { Sun, Moon, Check, Palette, ChevronRight } from 'lucide-react';

export function ThemeDropdown() {
  const { theme, colorMode, setTheme, setColorMode } = useTheme();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'main' | 'theme' | 'color'>('main');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
        setActiveTab('main');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const colorOptions: { id: ColorMode; label: string; bgHex: string }[] = [
    { id: 'amber', label: 'Amber', bgHex: '#D97706' },
    { id: 'blue', label: 'Blue', bgHex: '#3B82F6' },
    { id: 'pink', label: 'Pink', bgHex: '#EC4899' },
    { id: 'rose', label: 'Rose', bgHex: '#E11D48' },
    { id: 'emerald', label: 'Emerald', bgHex: '#10B981' },
    { id: 'black', label: 'Black', bgHex: '#18181B' },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        title="Customize Theme & Color Mode"
      >
        <Palette className="w-4 h-4 text-brand-500" />
        <span className="hidden sm:inline">Theme</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl z-50 p-1.5 text-sm">
          {activeTab === 'main' && (
            <div className="space-y-1">
              <div className="px-3 py-2 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                Preferences
              </div>
              <button
                onClick={() => setActiveTab('theme')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  <span>Theme</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <span className="capitalize text-xs">{theme}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>

              <button
                onClick={() => setActiveTab('color')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: colorOptions.find(c => c.id === colorMode)?.bgHex }}
                  />
                  <span>Color Mode</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <span className="capitalize text-xs">{colorMode}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          )}

          {activeTab === 'theme' && (
            <div>
              <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 dark:border-gray-800 mb-1">
                <button
                  onClick={() => setActiveTab('main')}
                  className="text-xs text-brand-500 font-medium hover:underline"
                >
                  ← Back
                </button>
                <span className="font-semibold text-xs text-gray-700 dark:text-gray-200">Theme</span>
                <div className="w-8" />
              </div>
              <button
                onClick={() => setTheme('light')}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Light</span>
                </div>
                {theme === 'light' && <Check className="w-4 h-4 text-brand-500" />}
              </button>
              <button
                onClick={() => setTheme('dark')}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Moon className="w-4 h-4 text-indigo-400" />
                  <span>Dark</span>
                </div>
                {theme === 'dark' && <Check className="w-4 h-4 text-brand-500" />}
              </button>
            </div>
          )}

          {activeTab === 'color' && (
            <div>
              <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 dark:border-gray-800 mb-1">
                <button
                  onClick={() => setActiveTab('main')}
                  className="text-xs text-brand-500 font-medium hover:underline"
                >
                  ← Back
                </button>
                <span className="font-semibold text-xs text-gray-700 dark:text-gray-200">Color Mode</span>
                <div className="w-8" />
              </div>
              <div className="space-y-0.5 max-h-56 overflow-y-auto">
                {colorOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => setColorMode(option.id)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full inline-block"
                        style={{ backgroundColor: option.bgHex }}
                      />
                      <span>{option.label}</span>
                    </div>
                    {colorMode === option.id && <Check className="w-4 h-4 text-brand-500" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
