'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header, VisibleFields } from '@/components/layout/Header';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { TaskTableView } from '@/components/tasks/TaskTableView';
import { TaskDetailView } from '@/components/tasks/TaskDetailView';
import { ProjectsOverview } from '@/components/dashboard/ProjectsOverview';
import { SettingsView } from '@/components/dashboard/SettingsView';
import { DashboardModals } from '@/components/dashboard/DashboardModals';
import { TaskItem } from '@/components/kanban/TaskCard';
import { fetchProjects, fetchTasks, updateTask, deleteTask } from '@/services/api';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [projects, setProjects] = useState<any[]>([]);
  const [currentProject, setCurrentProject] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'tasks' | 'projects' | 'settings'>('tasks');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [tasks, setTasks] = useState<TaskItem[]>([]);

  const [visibleFields, setVisibleFields] = useState<VisibleFields>({
    priority: true,
    members: true,
    dueDate: true,
    labels: true,
    status: false,
    reporter: false,
  });

  const handleToggleField = (field: keyof VisibleFields) => {
    setVisibleFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [addTaskStatus, setAddTaskStatus] = useState<string>('To Do');
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<TaskItem | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      const projData = await fetchProjects();
      setProjects(Array.isArray(projData) ? projData : []);
    } catch (err) {
      console.error('Failed to load projects from backend', err);
    }

    try {
      const activeUserId = user?._id || user?.email || 'guest-1';
      const taskData = await fetchTasks({
        projectId: currentProject || undefined,
        userId: activeUserId,
      });
      const list = Array.isArray(taskData) ? taskData : [];
      setTasks(list);

      setSelectedTask((prev) => {
        if (!prev) return null;
        const fresh = list.find((t) => t._id === prev._id);
        return fresh || prev;
      });
    } catch (err) {
      console.error('Failed to load tasks from backend', err);
    }
  }, [currentProject, user]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [loadData, user]);

  if (loading || !user) {
    return (
      <div className="h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center space-y-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 dark:border-white" />
        <p className="text-xs text-slate-500 font-medium">Authenticating session...</p>
      </div>
    );
  }

  const handleConfirmDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      await deleteTask(taskToDelete._id);
    } catch (err) {
      console.error('Failed to delete task', err);
    }
    setTasks((prev) => prev.filter((t) => t._id !== taskToDelete._id));
    setTaskToDelete(null);
  };

  const handleMoveTask = async (taskId: string, newStatus: string) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );
    try {
      await updateTask(taskId, { status: newStatus });
    } catch (err) {
      console.error('Failed to move task in DB', err);
      loadData();
    }
  };

  const activeUserId = user._id || user.email || 'guest-1';

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      !searchQuery ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesProject =
      !currentProject ||
      !t.projectId ||
      t.projectId === currentProject ||
      (typeof t.projectId === 'object' && (t.projectId as any)?._id === currentProject);

    const matchesUser =
      !t.userId ||
      t.userId === activeUserId ||
      t.userId === user.email ||
      t.userId === user._id;

    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;

    return matchesSearch && matchesProject && matchesUser && matchesStatus && matchesPriority;
  });

  const activeProjectObj = projects.find((p) => p._id === currentProject);
  const titleText = selectedTask
    ? `Tasks > ${selectedTask.title}`
    : activeView === 'settings'
    ? 'Settings'
    : currentProject
    ? `Projects > ${activeProjectObj?.name || 'Project'}`
    : activeView === 'projects'
    ? 'Projects'
    : 'Tasks';

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        currentProject={currentProject}
        onSelectProject={(id) => {
          setCurrentProject(id);
          setSelectedTask(null);
        }}
        projects={projects}
        onOpenAddProject={() => setShowAddProjectModal(true)}
        activeView={activeView}
        onSelectView={(v) => {
          setActiveView(v);
          setSelectedTask(null);
        }}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        collapsed={sidebarCollapsed}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {activeView !== 'settings' && (
          <Header
            title={titleText}
            viewMode={viewMode}
            onViewChange={(mode) => setViewMode(mode)}
            searchQuery={searchQuery}
            onSearchChange={(q) => setSearchQuery(q)}
            statusFilter={statusFilter}
            onStatusFilterChange={(s) => setStatusFilter(s)}
            priorityFilter={priorityFilter}
            onPriorityFilterChange={(p) => setPriorityFilter(p)}
            onOpenAddTask={() => {
              setAddTaskStatus('To Do');
              setShowAddTaskModal(true);
            }}
            onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
            onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
            visibleFields={visibleFields}
            onToggleField={handleToggleField}
          />
        )}

        <main className="flex-1 overflow-auto p-4 sm:p-6">
          {selectedTask ? (
            <TaskDetailView
              task={selectedTask}
              onClose={() => setSelectedTask(null)}
              onRefresh={loadData}
            />
          ) : activeView === 'settings' ? (
            <SettingsView onBackToApp={() => setActiveView('tasks')} />
          ) : activeView === 'projects' && !currentProject ? (
            <ProjectsOverview
              projects={projects}
              tasks={tasks}
              onSelectProject={(id) => setCurrentProject(id)}
              onSelectView={(v) => setActiveView(v)}
              onOpenAddProject={() => setShowAddProjectModal(true)}
            />
          ) : viewMode === 'kanban' ? (
            <KanbanBoard
              tasks={filteredTasks}
              onSelectTask={(task) => setSelectedTask(task)}
              onDeleteTask={(task) => setTaskToDelete(task)}
              onOpenAddTask={(status) => {
                setAddTaskStatus(status);
                setShowAddTaskModal(true);
              }}
              onMoveTask={handleMoveTask}
              visibleFields={visibleFields}
            />
          ) : (
            <TaskTableView
              tasks={filteredTasks}
              onSelectTask={(task) => setSelectedTask(task)}
              onDeleteTask={(task) => setTaskToDelete(task)}
              onOpenAddTask={(status) => {
                setAddTaskStatus(status);
                setShowAddTaskModal(true);
              }}
              visibleFields={visibleFields}
            />
          )}
        </main>
      </div>

      {/* Dashboard Modals */}
      <DashboardModals
        selectedTask={selectedTask}
        onCloseSelectedTask={() => setSelectedTask(null)}
        showAddTaskModal={showAddTaskModal}
        addTaskStatus={addTaskStatus}
        currentProject={currentProject}
        onCloseAddTaskModal={() => setShowAddTaskModal(false)}
        showAddProjectModal={showAddProjectModal}
        onCloseAddProjectModal={() => setShowAddProjectModal(false)}
        taskToDelete={taskToDelete}
        onConfirmDeleteTask={handleConfirmDeleteTask}
        onCloseDeleteTaskModal={() => setTaskToDelete(null)}
        onRefreshData={loadData}
      />
    </div>
  );
}

