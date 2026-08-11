'use client';

import React from 'react';
import { Plus, ArrowRight } from 'lucide-react';
import { TaskItem } from '@/components/kanban/TaskCard';

interface ProjectsOverviewProps {
  projects: any[];
  tasks: TaskItem[];
  onSelectProject: (id: string) => void;
  onSelectView: (view: 'tasks' | 'projects') => void;
  onOpenAddProject: () => void;
}

export function ProjectsOverview({
  projects,
  tasks,
  onSelectProject,
  onSelectView,
  onOpenAddProject,
}: ProjectsOverviewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Projects Overview</h2>
          <p className="text-xs text-slate-500 mt-1">Select a project to view its associated tasks.</p>
        </div>
        <button
          onClick={onOpenAddProject}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-2"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Project</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl p-8 text-center">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">No projects created yet</p>
          <button
            onClick={onOpenAddProject}
            className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Your First Project</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((proj) => {
            const projTaskCount = tasks.filter(
              (t) =>
                t.projectId === proj._id ||
                (typeof t.projectId === 'object' && (t.projectId as any)?._id === proj._id)
            ).length;

            return (
              <div
                key={proj._id}
                onClick={() => {
                  onSelectProject(proj._id);
                  onSelectView('tasks');
                }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-slate-400 dark:hover:border-slate-600 transition-all shadow-xs cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0"
                      style={{ backgroundColor: proj.color || '#3b82f6' }}
                    />
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {proj.name}
                    </h3>
                  </div>
                  {proj.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                      {proj.description}
                    </p>
                  )}
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>{projTaskCount} tasks</span>
                  <span className="font-medium text-slate-600 dark:text-slate-300 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    View Board <ArrowRight className="w-3 h-3 inline" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
