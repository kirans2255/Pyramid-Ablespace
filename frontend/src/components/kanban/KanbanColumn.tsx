import React, { useState } from 'react';
import { TaskCard, TaskItem } from './TaskCard';
import { Plus, MoreHorizontal, GripVertical } from 'lucide-react';
import { VisibleFields } from '../layout/Header';

interface KanbanColumnProps {
  status: string;
  tasks: TaskItem[];
  onSelectTask: (task: TaskItem) => void;
  onDeleteTask: (task: TaskItem) => void;
  onOpenAddTask: (status: string) => void;
  onMoveTask?: (taskId: string, newStatus: string) => void;
  visibleFields?: VisibleFields;
}

export function KanbanColumn({
  status,
  tasks,
  onSelectTask,
  onDeleteTask,
  onOpenAddTask,
  onMoveTask,
  visibleFields,
}: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const getStatusColor = (statusName: string) => {
    switch (statusName) {
      case 'To Do':
        return 'text-black';
      case 'Doing':
        return 'text-black';
      case 'Completed':
        return 'text-black';
      case 'On Hold':
        return 'text-black';
      default:
        return 'text-black';
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        const taskId = e.dataTransfer.getData('text/plain');
        if (taskId && onMoveTask) {
          onMoveTask(taskId, status);
        }
      }}
      className={`flex flex-col w-80 shrink-0 p-3 rounded-2xl border max-h-full transition-all ${
        isDragOver
          ? 'bg-blue-50/60 dark:bg-blue-950/30 border-2 border-dashed border-blue-500 shadow-md'
          : 'bg-slate-100/70 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-800/80'
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-1 mb-3">
        <div className="flex items-center gap-2">
          {/* 6 Dots Icon */}
          <GripVertical className={`w-4 h-4 ${getStatusColor(status)} shrink-0 cursor-grab`} />
          <h2 className="font-semibold text-sm text-slate-800 dark:text-slate-200">{status}</h2>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onOpenAddTask(status)}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            title="Add Task to this column"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-300">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Task Cards Container */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-0.5">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onClick={() => onSelectTask(task)}
            onDelete={(e) => {
              e.stopPropagation();
              onDeleteTask(task);
            }}
            visibleFields={visibleFields}
          />
        ))}

        {tasks.length === 0 && (
          <div className="h-24 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-xs text-slate-400 font-medium">
            No tasks in {status}
          </div>
        )}
      </div>

      {/* Column Footer Add Button */}
      <button
        onClick={() => onOpenAddTask(status)}
        className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 rounded-xl transition-all shadow-sm"
      >
        <Plus className="w-4 h-4" />
        <span>Add Task</span>
      </button>
    </div>
  );
}
