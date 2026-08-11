import React, { useState } from 'react';
import { TaskItem } from '../kanban/TaskCard';
import { ChevronDown, ChevronRight, MoreHorizontal, Plus, Signal, Pencil, Trash2 } from 'lucide-react';
import { VisibleFields } from '../layout/Header';

interface TaskTableViewProps {
  tasks: TaskItem[];
  onSelectTask: (task: TaskItem) => void;
  onDeleteTask: (task: TaskItem) => void;
  onOpenAddTask: (status: string) => void;
  visibleFields?: VisibleFields;
}

export function TaskTableView({
  tasks,
  onSelectTask,
  onDeleteTask,
  onOpenAddTask,
  visibleFields,
}: TaskTableViewProps) {
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const groups = ['To Do', 'Doing', 'Completed'];

  const toggleGroup = (group: string) => {
    setCollapsedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const getPriorityBadge = (priority: string) => {
    const p = priority.toLowerCase();
    if (p === 'high') {
      return (
        <div className="flex items-center gap-1.5 text-xs font-medium text-rose-500">
          <Signal className="w-3.5 h-3.5" />
          <span>High</span>
        </div>
      );
    }
    if (p === 'medium') {
      return (
        <div className="flex items-center gap-1.5 text-xs font-medium text-amber-500">
          <Signal className="w-3.5 h-3.5 opacity-70" />
          <span>Medium</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
        <Signal className="w-3.5 h-3.5 opacity-40" />
        <span>Low</span>
      </div>
    );
  };

  const showPriority = visibleFields ? visibleFields.priority : true;
  const showMembers = visibleFields ? visibleFields.members : true;
  const showDueDate = visibleFields ? visibleFields.dueDate : true;
  const showLabels = visibleFields ? visibleFields.labels : false;
  const showStatus = visibleFields ? visibleFields.status : false;
  const showReporter = visibleFields ? visibleFields.reporter : false;

  return (
    <div className="space-y-8 pb-12 w-full overflow-x-auto font-sans">
      {groups.map(group => {
        const groupTasks = tasks.filter(t => t.status === group);
        const isCollapsed = collapsedGroups[group];

        return (
          <div key={group} className="space-y-3">
            {/* Group Header Title */}
            <div
              onClick={() => toggleGroup(group)}
              className="flex items-center gap-2 cursor-pointer select-none py-1"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              )}
              <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">{group}</h3>
            </div>

            {/* Table */}
            {!isCollapsed && (
              <div className="overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100/70 dark:bg-slate-800/50 text-[12px] font-semibold text-slate-700 dark:text-slate-300">
                      <th className="py-2.5 px-4 rounded-l-md font-semibold w-1/3">Task</th>
                      {showStatus && <th className="py-2.5 px-4 font-semibold">Status</th>}
                      {showPriority && <th className="py-2.5 px-4 font-semibold">Priority</th>}
                      {showMembers && <th className="py-2.5 px-4 font-semibold">Members</th>}
                      {showDueDate && <th className="py-2.5 px-4 font-semibold">Due Date</th>}
                      {showLabels && <th className="py-2.5 px-4 font-semibold">Labels</th>}
                      {showReporter && <th className="py-2.5 px-4 font-semibold">Reporter</th>}
                      <th className="py-2.5 px-4 rounded-r-md font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-300">
                    {groupTasks.map(task => (
                      <tr
                        key={task._id}
                        onClick={() => onSelectTask(task)}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                      >
                        <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                          {task.title}
                        </td>
                        {showStatus && (
                          <td className="py-3 px-4 font-semibold text-slate-600 dark:text-slate-400">
                            {task.status}
                          </td>
                        )}
                        {showPriority && <td className="py-3 px-4">{getPriorityBadge(task.priority)}</td>}
                        {showMembers && (
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5">
                              <img
                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                                alt="Member"
                                className="w-5 h-5 rounded-full object-cover"
                              />
                            </div>
                          </td>
                        )}
                        {showDueDate && (
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">
                            {task.dueDate
                              ? new Date(task.dueDate).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })
                              : '12 Sep 2026'}
                          </td>
                        )}
                        {showLabels && (
                          <td className="py-3 px-4">
                            {task.labels && task.labels.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {task.labels.map((l, i) => (
                                  <span key={i} className="px-1.5 py-0.5 text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 rounded">
                                    {l}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-slate-400 text-xs">-</span>
                            )}
                          </td>
                        )}
                        {showReporter && (
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">
                            Dexter (Admin)
                          </td>
                        )}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectTask(task);
                              }}
                              className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Edit Task"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteTask(task);
                              }}
                              className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                              title="Delete Task"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {/* Bottom Add Task Row */}
                    <tr>
                      <td colSpan={5} className="py-2 px-4">
                        <button
                          onClick={() => onOpenAddTask(group)}
                          className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Task</span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}