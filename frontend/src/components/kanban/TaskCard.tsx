import React, { useState, useRef, useEffect } from 'react';
import { Calendar, CheckSquare, MoreHorizontal, Tag, Pencil, Trash2, Signal } from 'lucide-react';
import { VisibleFields } from '../layout/Header';

export interface SubtaskItem {
  id: string;
  title: string;
  completed: boolean;
  priority?: string;
  dueDate?: string;
}

export interface CommentItem {
  id: string;
  content: string;
  userId?: string;
  userName?: string;
  userAvatar?: string;
  createdAt?: string | Date;
}

export interface TaskItem {
  _id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: string;
  labels?: string[];
  projectId?: string;
  userId?: any;
  subtasks?: SubtaskItem[];
  comments?: CommentItem[];
  assigneeId?: any;
}

interface TaskCardProps {
  task: TaskItem;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
  visibleFields?: VisibleFields;
}

export function TaskCard({ task, onClick, onDelete, visibleFields }: TaskCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showMenu) return;
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const completedSubtasks = task.subtasks?.filter(s => s.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
    : '29 Jul';

  const showMembers = visibleFields ? visibleFields.members : true;
  const showDueDate = visibleFields ? visibleFields.dueDate : true;
  const showPriority = visibleFields ? visibleFields.priority : true;
  const showLabels = visibleFields ? visibleFields.labels : false;

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', task._id);
        e.dataTransfer.effectAllowed = 'move';
      }}
      onClick={onClick}
      className="group bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-700/80 shadow-sm hover:shadow transition-all cursor-grab active:cursor-grabbing relative"
    >
      {/* Title & Options Header */}
      <div className="flex items-start justify-between gap-2 mb-2 relative">
        <h3 className="font-semibold text-md text-slate-800 dark:text-slate-100 group-hover:text-brand-600 transition-colors line-clamp-2">
          {task.title}
        </h3>

        {/* Action Options Button & Dropdown Menu */}
        <div className="relative shrink-0" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
            title="Actions"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  onClick();
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left"
              >
                <Pencil className="w-3.5 h-3.5 text-slate-400" />
                <span>Edit Task</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  onDelete(e);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Task</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Assignee & Due Date Row */}
      <div className="flex items-center justify-between mb-2.5 text-xs">
        {showMembers ? (
          <div className="flex items-center gap-1.5">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
              alt="Assignee"
              className="w-5 h-5 rounded-full object-cover"
            />
            <span className="text-[12px] font-medium text-slate-600 dark:text-slate-300">
              Admin
            </span>
          </div>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2">
          {showDueDate && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-500 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/30 px-2 py-0.5 rounded-md border border-rose-200/80 dark:border-rose-900/60">
              <Calendar className="w-3 h-3 text-rose-500" />
              {formattedDate}
            </span>
          )}
        </div>
      </div>

      {/* Tags / Labels */}
      {showLabels && task.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {task.labels.map((label, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[12px] font-semibold bg-gray-100 dark:bg-slate-700/50 text-black dark:text-slate-300 border border-slate-200/80 dark:border-slate-600/60"
            >
              <Tag className="w-3 h-3 text-black" />
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}