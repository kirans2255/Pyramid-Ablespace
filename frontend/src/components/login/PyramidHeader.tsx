'use client';

import React from 'react';

export function PyramidHeader() {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      <div className="w-6 h-6 rounded-md bg-black text-white flex items-center justify-center shadow-sm">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L3 19H21L12 2Z" fill="white" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M12 7L7 17H17L12 7Z" fill="black" />
        </svg>
      </div>
      <span className="font-semibold text-sm tracking-tight text-slate-900 dark:text-white">
        Pyramid
      </span>
    </div>
  );
}
