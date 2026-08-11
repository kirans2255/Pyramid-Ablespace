'use client';

import React from 'react';
import { Calendar, User, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  status: string;
  onStatusChange: (status: string) => void;
  priority: string;
  onPriorityChange: (priority: string) => void;
  showDatePicker: boolean;
  setShowDatePicker: (show: boolean) => void;
  onSelectDate: (day: number) => void;
}

export function TaskRightSidebar({
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  showDatePicker,
  setShowDatePicker,
  onSelectDate,
}: Props) {
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="space-y-5 bg-slate-50/70 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
      <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Details</h3>

      {/* Status Dropdown */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Status</label>
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-semibold"
        >
          <option value="Backlog">Backlog</option>
          <option value="To Do">To Do</option>
          <option value="Doing">Doing</option>
          <option value="Completed">Completed</option>
          <option value="On Hold">On Hold</option>
        </select>
      </div>

      {/* Priority Dropdown */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Priority</label>
        <select
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-semibold"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      {/* Members Section */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Members</label>
        <button className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
          <User className="w-3.5 h-3.5 text-slate-400" />
          <span>+ Add members</span>
        </button>
      </div>

      {/* Dates Popover Widget */}
      <div className="space-y-1.5 relative">
        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Dates</label>
        <button
          onClick={() => setShowDatePicker(!showDatePicker)}
          className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-medium"
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-brand-500" />
            <span>Jan 10 → End</span>
          </div>
        </button>

        {showDatePicker && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-3 z-50 text-xs">
            <div className="flex items-center justify-between mb-3 font-semibold text-slate-800 dark:text-slate-200">
              <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span>January 2026</span>
              <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center font-semibold text-[10px] text-slate-400 mb-1">
              <span>Su</span>
              <span>Mo</span>
              <span>Tu</span>
              <span>We</span>
              <span>Th</span>
              <span>Fr</span>
              <span>Sa</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center font-medium">
              {daysInMonth.map((day) => (
                <button
                  key={day}
                  onClick={() => onSelectDate(day)}
                  className={`p-1.5 rounded-full transition-colors text-xs ${
                    day === 10
                      ? 'bg-slate-900 text-white font-bold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
