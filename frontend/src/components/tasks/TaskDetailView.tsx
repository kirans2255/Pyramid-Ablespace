'use client';

import React, { useState } from 'react';
import { TaskItem } from '../kanban/TaskCard';
import {
  ArrowLeft,
  Calendar,
  Tag,
  Eye,
  Share2,
  MoreHorizontal,
  Lock,
  User,
  Plus,
  Paperclip,
  Send,
  CheckCircle2,
  Circle,
  Trash2,
  ChevronDown,
  ChevronRight,
  Signal,
  Clock,
  Settings,
  X
} from 'lucide-react';
import { updateTask } from '@/services/api';
import { useTaskDetailLogic } from '../modals/useTaskDetailLogic';

interface TaskDetailViewProps {
  task: TaskItem;
  onClose: () => void;
  onRefresh: () => void;
}

export function TaskDetailView({ task: initialTask, onClose, onRefresh }: TaskDetailViewProps) {
  const {
    task: dynamicTask,
    status,
    priority,
    newSubtaskTitle,
    setNewSubtaskTitle,
    newSubtaskPriority,
    setNewSubtaskPriority,
    newSubtaskDueDate,
    setNewSubtaskDueDate,
    showAddSubtask,
    setShowAddSubtask,
    commentText,
    setCommentText,
    showDatePicker,
    setShowDatePicker,
    handleStatusChange,
    handlePriorityChange,
    handleAddSubtaskSubmit,
    handleToggleSubtaskClick,
    handleDeleteSubtask,
    handleAddCommentSubmit,
    handleSelectDate,
  } = useTaskDetailLogic(initialTask, onRefresh);

  const task = dynamicTask || initialTask;

  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showDetailsSection, setShowDetailsSection] = useState(true);
  const [showUpdatesSection, setShowUpdatesSection] = useState(true);

  const [isLocked, setIsLocked] = useState((task as any).isLocked || false);
  const [isWatching, setIsWatching] = useState(true);
  const [watchCount, setWatchCount] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [startDate, setStartDate] = useState<string>('10 Jan 2026');
  const [endDate, setEndDate] = useState<string>(
    task.dueDate
      ? new Date(task.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      : '12 Sep 2026'
  );
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleLock = async () => {
    const nextLocked = !isLocked;
    setIsLocked(nextLocked);
    try {
      await updateTask(task._id, { isLocked: nextLocked });
    } catch (err) {
      console.error('Failed to toggle lock', err);
    }
    triggerToast(nextLocked ? 'Task locked (Read-only mode)' : 'Task unlocked');
  };

  const handleToggleWatch = () => {
    const nextWatch = !isWatching;
    setIsWatching(nextWatch);
    setWatchCount(nextWatch ? watchCount + 1 : Math.max(0, watchCount - 1));
    triggerToast(nextWatch ? 'You are now watching task updates' : 'Stopped watching task');
  };

  const handleShareTask = () => {
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/dashboard?task=${task._id}` : '';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
    }
    triggerToast('Task share link copied to clipboard!');
  };

  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
    : '31 Jul';

  const priorities = [
    { label: 'No Priority', color: 'text-slate-400', iconOpacity: 'opacity-30' },
    { label: 'Urgent', color: 'text-rose-600 font-semibold', iconOpacity: 'opacity-100' },
    { label: 'High', color: 'text-rose-500 font-medium', iconOpacity: 'opacity-90' },
    { label: 'Medium', color: 'text-amber-500 font-medium', iconOpacity: 'opacity-70' },
    { label: 'Low', color: 'text-slate-400 font-medium', iconOpacity: 'opacity-40' },
  ];

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-6 space-y-6 font-sans relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Action Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tasks</span>
        </button>

        <div className="flex items-center gap-3 text-slate-400 text-xs">
          <button
            onClick={handleToggleLock}
            className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${
              isLocked
                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 font-semibold'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600'
            }`}
            title={isLocked ? 'Task is locked (Click to unlock)' : 'Lock task'}
          >
            <Lock className="w-4 h-4" />
            {isLocked && <span className="text-[11px]">Locked</span>}
          </button>

          <button
            onClick={handleToggleWatch}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              isWatching
                ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
            title="Toggle watching task"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{watchCount}</span>
          </button>

          <button
            onClick={handleShareTask}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            title="Share Task Link"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors" title="Options">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (Main Details & Discussion) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Description */}
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2 leading-snug">
              {task.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {task.description ||
                'Create clear and detailed API documentation to guide developers in using the inventory and sales metrics features effectively.'}
            </p>
          </div>

          {/* Properties Row */}
          <div className="flex flex-wrap items-center gap-6 text-xs py-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-400">Properties</span>
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-md">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                  alt="Dexter"
                  className="w-4 h-4 rounded-full object-cover"
                />
                <span className="font-semibold text-slate-700 dark:text-slate-200">A Designer</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-rose-500 dark:text-rose-400 bg-rose-50/60 dark:bg-rose-950/40 px-2.5 py-1 rounded-md font-semibold border border-rose-200/60 dark:border-rose-900/60">
              <Calendar className="w-3.5 h-3.5 text-rose-500" />
              <span>{formattedDueDate}</span>
            </div>
          </div>

          {/* Labels Tags */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400">Labels</span>
            <div className="flex flex-wrap gap-2">
              {(task.labels && task.labels.length > 0
                ? task.labels
                : ['Research', 'Design', 'Development', 'Testing', 'Deployment']
              ).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80"
                >
                  <Tag className="w-3 h-3 text-slate-400" />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Resources Attachment Link */}
          <div className="space-y-1.5 pt-1">
            <span className="text-xs font-semibold text-slate-400">Resources</span>
            <button className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
              <Paperclip className="w-3.5 h-3.5 text-slate-400" />
              <span>Add document or link...</span>
            </button>
          </div>

          {/* Subtasks Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2">
              <ChevronDown className="w-4 h-4 text-slate-400" />
              <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">Subtasks</h3>
            </div>

            <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 font-semibold border-b border-slate-100 dark:border-slate-800">
                    <th className="py-2.5 px-4 font-semibold">Task</th>
                    <th className="py-2.5 px-4 font-semibold">Priority</th>
                    <th className="py-2.5 px-4 font-semibold">Members</th>
                    <th className="py-2.5 px-4 font-semibold">Due Date</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                  {task.subtasks && task.subtasks.length > 0 ? (
                    task.subtasks.map((st) => (
                      <tr key={st.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="py-2.5 px-4 flex items-center gap-2">
                          <button onClick={() => handleToggleSubtaskClick(st.id)}>
                            {st.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                            )}
                          </button>
                          <span className={st.completed ? 'line-through text-slate-400' : ''}>{st.title}</span>
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-1.5 text-rose-500 font-medium">
                            <Signal className="w-3.5 h-3.5" />
                            <span>{st.priority || 'Medium'}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4">
                          <img
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                            alt="Member"
                            className="w-5 h-5 rounded-full object-cover"
                          />
                        </td>
                        <td className="py-2.5 px-4 text-slate-500">{st.dueDate || '12 Sep 2026'}</td>
                        <td className="py-2.5 px-4 text-right">
                          <button
                            onClick={() => handleDeleteSubtask(st.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                            title="Delete Subtask"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-xs text-slate-400 font-medium">
                        No subtasks yet. Click "Add Subtask" below to create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Add Subtask Trigger / Form */}
            {!showAddSubtask ? (
              <button
                onClick={() => setShowAddSubtask(true)}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white pt-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-slate-400" />
                <span>Add Subtask</span>
              </button>
            ) : (
              <form onSubmit={handleAddSubtaskSubmit} className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3 font-sans mt-2">
                <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-2">
                  <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-200">New Subtask</h4>
                  <button type="button" onClick={() => setShowAddSubtask(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Subtask Title *</label>
                  <input
                    type="text"
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    placeholder="Enter subtask title..."
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
                    required
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Priority</label>
                    <select
                      value={newSubtaskPriority}
                      onChange={(e) => setNewSubtaskPriority(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Due Date</label>
                    <input
                      type="date"
                      value={newSubtaskDueDate}
                      onChange={(e) => setNewSubtaskDueDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddSubtask(false)}
                    className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Save Subtask
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Comments Section */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">Discussion</h3>

            {/* Existing Comments */}
            <div className="space-y-3">
              {task.comments && task.comments.length > 0 ? (
                task.comments.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-3 bg-slate-50/50 dark:bg-slate-800/30 p-3 rounded-xl">
                    <img
                      src={comment.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt={comment.userName}
                      className="w-6 h-6 rounded-full object-cover mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {comment.userName}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <span>
                            {comment.createdAt
                              ? typeof comment.createdAt === 'string'
                                ? comment.createdAt
                                : new Date(comment.createdAt).toLocaleDateString('en-GB')
                              : 'just now'}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{comment.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-400 font-medium bg-slate-50/50 dark:bg-slate-800/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                  No comments yet. Start the discussion below!
                </div>
              )}
            </div>

            {/* Reply Input Box */}
            <form onSubmit={handleAddCommentSubmit} className="flex items-center gap-2.5 pt-2">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                alt="Dexter"
                className="w-6 h-6 rounded-full object-cover shrink-0"
              />
              <div className="flex-1 relative flex items-center">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Leave a reply..."
                  className="w-full pl-3 pr-16 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300"
                />
                <div className="absolute right-2 flex items-center gap-1.5 text-slate-400">
                  <button type="button" className="p-1 hover:text-slate-600">
                    <Paperclip className="w-3.5 h-3.5" />
                  </button>
                  <button type="submit" className="p-1 hover:text-slate-900 dark:hover:text-white">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side Panel (Details & Updates Sidebar) */}
        <div className="space-y-6">
          {/* Details Collapsible Box */}
          <div className="bg-slate-50/70 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 space-y-4">
            <div
              onClick={() => setShowDetailsSection(!showDetailsSection)}
              className="flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-1.5">
                {showDetailsSection ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Details</h3>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Plus className="w-3.5 h-3.5 cursor-pointer hover:text-slate-600" />
                <Settings className="w-3.5 h-3.5 cursor-pointer hover:text-slate-600" />
              </div>
            </div>

            {showDetailsSection && (
              <div className="space-y-3.5 pt-1 text-xs">
                {/* Status Row */}
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-500">Status</span>
                  <div className="relative">
                    <select
                      value={status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="px-2.5 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
                    >
                      <option value="Backlog">Backlog</option>
                      <option value="To Do">To Do</option>
                      <option value="Doing">Doing</option>
                      <option value="Completed">Completed</option>
                      <option value="On Hold">On Hold</option>
                    </select>
                  </div>
                </div>

                {/* Priority Row */}
                <div className="flex items-center justify-between relative">
                  <span className="font-medium text-slate-500">Priority</span>
                  <div className="relative">
                    <button
                      onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                      className="flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md font-medium text-rose-500 cursor-pointer"
                    >
                      <Signal className="w-3.5 h-3.5" />
                      <span>{priority || 'High'}</span>
                      <ChevronDown className="w-3 h-3 text-slate-400 ml-1" />
                    </button>

                    {showPriorityDropdown && (
                      <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                        {priorities.map((p) => (
                          <button
                            key={p.label}
                            onClick={() => {
                              handlePriorityChange(p.label);
                              setShowPriorityDropdown(false);
                            }}
                            className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-slate-50 dark:hover:bg-slate-700/50 ${p.color}`}
                          >
                            <Signal className={`w-3.5 h-3.5 ${p.iconOpacity}`} />
                            <span>{p.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Members Row */}
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-500">Members</span>
                  <div className="flex items-center gap-1.5">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                      alt="Dexter"
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  </div>
                </div>

                {/* Start Date Row */}
                <div className="flex items-center justify-between relative">
                  <span className="font-medium text-slate-500">Start Date</span>
                  <div className="relative">
                    <button
                      onClick={() => {
                        setShowStartDatePicker(!showStartDatePicker);
                        setShowEndDatePicker(false);
                      }}
                      className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:underline flex items-center gap-1"
                    >
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{startDate}</span>
                    </button>

                    {showStartDatePicker && (
                      <div className="absolute right-0 top-full mt-2 w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-3 z-50 text-xs">
                        <p className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Select Start Date</p>
                        <input
                          type="date"
                          onChange={(e) => {
                            if (e.target.value) {
                              const d = new Date(e.target.value);
                              setStartDate(d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));
                              setShowStartDatePicker(false);
                            }
                          }}
                          className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* End Date Row */}
                <div className="flex items-center justify-between relative">
                  <span className="font-medium text-slate-500">End Date</span>
                  <div className="relative">
                    <button
                      onClick={() => {
                        setShowEndDatePicker(!showEndDatePicker);
                        setShowStartDatePicker(false);
                      }}
                      className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:underline flex items-center gap-1"
                    >
                      <Calendar className="w-3 h-3 text-rose-500" />
                      <span>{endDate}</span>
                    </button>

                    {showEndDatePicker && (
                      <div className="absolute right-0 top-full mt-2 w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-3 z-50 text-xs">
                        <p className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Select End Date</p>
                        <input
                          type="date"
                          onChange={async (e) => {
                            if (e.target.value) {
                              const d = new Date(e.target.value);
                              const formatted = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                              setEndDate(formatted);
                              await handleSelectDate(d.getDate());
                              setShowEndDatePicker(false);
                            }
                          }}
                          className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Labels Row */}
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-500">Labels</span>
                  <span className="text-slate-400 italic">None</span>
                </div>

                {/* Teams Row */}
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-500">Teams</span>
                  <span className="text-slate-400 italic">None</span>
                </div>

                {/* Reporter Row */}
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-500">Reporter</span>
                  <div className="flex items-center gap-1.5">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                      alt="Reporter"
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Updates Section */}
          <div className="bg-slate-50/70 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 space-y-3">
            <div
              onClick={() => setShowUpdatesSection(!showUpdatesSection)}
              className="flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-1.5">
                {showUpdatesSection ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Updates</h3>
              </div>
            </div>

            {showUpdatesSection && (
              <div className="space-y-3 pt-1 text-xs">
                {task.comments && task.comments.map((c) => (
                  <div key={`up-c-${c.id}`} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                    <img
                      src={c.userAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
                      alt={c.userName}
                      className="w-5 h-5 rounded-full object-cover shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="text-xs">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">{c.userName || 'You'}</span> posted a comment: <span className="italic text-slate-500 font-normal">"{c.content.length > 25 ? c.content.substring(0, 25) + '...' : c.content}"</span>
                      </p>
                    </div>
                  </div>
                ))}

                {task.subtasks && task.subtasks.map((st) => (
                  <div key={`up-st-${st.id}`} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                      alt="User"
                      className="w-5 h-5 rounded-full object-cover shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="text-xs">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">You</span> {st.completed ? 'completed' : 'created'} subtask <span className="font-semibold text-slate-800 dark:text-slate-200">"{st.title}"</span>
                      </p>
                    </div>
                  </div>
                ))}

                <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                    alt="User"
                    className="w-5 h-5 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-xs">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">You</span> set priority to <span className="font-semibold text-rose-500">{priority}</span> and status to <span className="font-semibold text-slate-800 dark:text-slate-200">{status}</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
