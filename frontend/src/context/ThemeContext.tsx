'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark';
export type ColorMode = 'amber' | 'blue' | 'pink' | 'rose' | 'emerald' | 'black';

interface ThemeContextType {
  theme: ThemeMode;
  colorMode: ColorMode;
  setTheme: (theme: ThemeMode) => void;
  setColorMode: (colorMode: ColorMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>('light');
  const [colorMode, setColorModeState] = useState<ColorMode>('blue');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = (localStorage.getItem('app_theme') as ThemeMode) || 'light';
    const savedColor = (localStorage.getItem('app_color_mode') as ColorMode) || 'blue';
    setThemeState(savedTheme);
    setColorModeState(savedColor);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('app_theme', theme);
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.setAttribute('data-color-mode', colorMode);
    localStorage.setItem('app_color_mode', colorMode);
  }, [colorMode, mounted]);

  const setTheme = (t: ThemeMode) => setThemeState(t);
  const setColorMode = (c: ColorMode) => setColorModeState(c);
  const toggleTheme = () => setThemeState(prev => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, colorMode, setTheme, setColorMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
