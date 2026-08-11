'use client';

import React from 'react';
import { CheckSquare, Plus } from 'lucide-react';
import { SubtaskItem } from '../kanban/TaskCard';

interface Props {
  subtasks: SubtaskItem[];
  showAddSubtask: boolean;
  setShowAddSubtask: (show: boolean) => void;
  newSubtaskTitle: string;
  setNewSubtaskTitle: (title: string) => void;
  onAddSubtaskSubmit: (e: React.FormEvent) => void;
  onToggleSubtask: (subtaskId: string) => void;
}

export function TaskSubtasksTable({
  subtasks,
  showAddSubtask,
  setShowAddSubtask,
  newSubtaskTitle,
  setNewSubtaskTitle,
  onAddSubtaskSubmit,
  onToggleSubtask,
}: Props) {
  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-brand-500" />
          <span>Subtasks</span>
        </h3>
      </div>

      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-800/30">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[10px] font-semibold bg-slate-100/60 dark:bg-slate-800/60">
              <th className="py-2 px-3">Task</th>
              <th className="py-2 px-3">Priority</th>
              <th className="py-2 px-3">Members</th>
              <th className="py-2 px-3">Due Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {subtasks?.map((sub) => (
              <tr key={sub.id} className="hover:bg-slate-100/50 dark:hover:bg-slate-800/50">
                <td className="py-2.5 px-3">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sub.completed}
                      onChange={() => onToggleSubtask(sub.id)}
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span
                      className={`font-medium ${
                        sub.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {sub.title}
                    </span>
                  </label>
                </td>
                <td className="py-2.5 px-3 text-rose-500 font-semibold">{sub.priority || 'Medium'}</td>
                <td className="py-2.5 px-3">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                    className="w-5 h-5 rounded-full object-cover"
                    alt="Avatar"
                  />
                </td>
                <td className="py-2.5 px-3 text-slate-500">{sub.dueDate || '12 Sep 2026'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {showAddSubtask ? (
          <form onSubmit={onAddSubtaskSubmit} className="p-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
            <input
              type="text"
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              placeholder="Subtask title..."
              className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100"
              autoFocus
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-lg"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setShowAddSubtask(false)}
              className="px-2 py-1.5 text-xs text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
          </form>
        ) : (
          <button
            onClick={() => setShowAddSubtask(true)}
            className="w-full py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 flex items-center justify-center gap-1 border-t border-slate-200 dark:border-slate-800 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Subtask</span>
          </button>
        )}
      </div>
    </div>
  );
}
