'use client';

import React from 'react';
import { TaskItem } from '../kanban/TaskCard';
import { X, Calendar, Tag, Eye, Share2, MoreHorizontal } from 'lucide-react';
import { useTaskDetailLogic } from './useTaskDetailLogic';
import { TaskSubtasksTable } from './TaskSubtasksTable';
import { TaskCommentsSection } from './TaskCommentsSection';
import { TaskRightSidebar } from './TaskRightSidebar';

interface TaskDetailModalProps {
  task: TaskItem | null;
  onClose: () => void;
  onRefresh: () => void;
}

export function TaskDetailModal({ task, onClose, onRefresh }: TaskDetailModalProps) {
  if (!task) return null;

  const {
    status,
    priority,
    newSubtaskTitle,
    setNewSubtaskTitle,
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
    handleAddCommentSubmit,
    handleSelectDate,
  } = useTaskDetailLogic(task, onRefresh);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Top Header Controls Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2 text-slate-400">
            <button className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700">
              <Eye className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold">1</span>
            <button className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 ml-2">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Content */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 leading-tight">
                {task.title}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {task.description ||
                  'Create clear and detailed API documentation to guide developers in using features effectively.'}
              </p>
            </div>

            {/* Properties Badges */}
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <span className="font-semibold">Properties:</span>
                <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-slate-700 dark:text-slate-300 font-medium">
                  A Designer
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-md font-semibold border border-rose-200 dark:border-rose-900">
                <Calendar className="w-3.5 h-3.5" />
                <span>31 Jul</span>
              </div>
            </div>

            {/* Labels Tags */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Labels
              </span>
              <div className="flex flex-wrap gap-2">
                {['Research', 'Design', 'Development', 'Testing', 'Deployment'].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    <Tag className="w-3 h-3 text-slate-400" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Subtasks Section */}
            <TaskSubtasksTable
              subtasks={task.subtasks || []}
              showAddSubtask={showAddSubtask}
              setShowAddSubtask={setShowAddSubtask}
              newSubtaskTitle={newSubtaskTitle}
              setNewSubtaskTitle={setNewSubtaskTitle}
              onAddSubtaskSubmit={handleAddSubtaskSubmit}
              onToggleSubtask={handleToggleSubtaskClick}
            />

            {/* Comments Section */}
            <TaskCommentsSection
              comments={task.comments || []}
              commentText={commentText}
              setCommentText={setCommentText}
              onAddCommentSubmit={handleAddCommentSubmit}
            />
          </div>

          {/* Right Column Details Panel */}
          <TaskRightSidebar
            status={status}
            onStatusChange={handleStatusChange}
            priority={priority}
            onPriorityChange={handlePriorityChange}
            showDatePicker={showDatePicker}
            setShowDatePicker={setShowDatePicker}
            onSelectDate={handleSelectDate}
          />
        </div>
      </div>
    </div>
  );
}
