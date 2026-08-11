import React from 'react';

export interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({
  src,
  name = 'User',
  size = 'md',
  className = '',
}: AvatarProps) {
  const sizes = {
    sm: 'w-5 h-5 text-[10px]',
    md: 'w-7 h-7 text-xs',
    lg: 'w-10 h-10 text-sm',
  };

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';

  return src || defaultAvatar ? (
    <img
      src={src || defaultAvatar}
      alt={name}
      className={`${sizes[size]} rounded-full object-cover shrink-0 border border-slate-200/60 dark:border-slate-700/60 ${className}`}
    />
  ) : (
    <div
      className={`${sizes[size]} rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center shrink-0 ${className}`}
    >
      {initials}
    </div>
  );
}
