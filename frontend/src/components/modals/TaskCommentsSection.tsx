'use client';

import React from 'react';
import { Paperclip, Send } from 'lucide-react';
import { CommentItem } from '../kanban/TaskCard';

interface Props {
  comments: CommentItem[];
  commentText: string;
  setCommentText: (v: string) => void;
  onAddCommentSubmit: (e: React.FormEvent) => void;
}

export function TaskCommentsSection({
  comments,
  commentText,
  setCommentText,
  onAddCommentSubmit,
}: Props) {
  return (
    <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
      <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
        Comments
      </h3>

      <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
        {comments?.map((c) => (
          <div key={c.id} className="flex gap-3 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
            <img
              src={c.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={c.userName}
              className="w-7 h-7 rounded-full object-cover shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {c.userName}
                </span>
                <span className="text-[10px] text-slate-400">just now</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{c.content}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={onAddCommentSubmit} className="relative flex items-center gap-2">
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
          alt="Dexter"
          className="w-7 h-7 rounded-full object-cover shrink-0"
        />
        <div className="relative flex-1">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Leave a reply..."
            className="w-full pl-3 pr-16 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-400">
            <button type="button" className="p-1 hover:text-slate-600 dark:hover:text-slate-200">
              <Paperclip className="w-3.5 h-3.5" />
            </button>
            <button
              type="submit"
              className="p-1 text-brand-600 hover:text-brand-700 font-semibold"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
