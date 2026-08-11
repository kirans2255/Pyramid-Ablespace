'use client';

import React from 'react';
import { TaskItem } from '@/components/kanban/TaskCard';
import { TaskDetailModal } from '@/components/modals/TaskDetailModal';
import { CreateTaskModal } from '@/components/modals/CreateTaskModal';
import { CreateProjectModal } from '@/components/modals/CreateProjectModal';
import { DeleteConfirmModal } from '@/components/modals/DeleteConfirmModal';

interface DashboardModalsProps {
  selectedTask: TaskItem | null;
  onCloseSelectedTask: () => void;
  showAddTaskModal: boolean;
  addTaskStatus: string;
  currentProject: string | null;
  onCloseAddTaskModal: () => void;
  showAddProjectModal: boolean;
  onCloseAddProjectModal: () => void;
  taskToDelete: TaskItem | null;
  onConfirmDeleteTask: () => void;
  onCloseDeleteTaskModal: () => void;
  onRefreshData: () => void;
}

export function DashboardModals({
  showAddTaskModal,
  addTaskStatus,
  currentProject,
  onCloseAddTaskModal,
  showAddProjectModal,
  onCloseAddProjectModal,
  taskToDelete,
  onConfirmDeleteTask,
  onCloseDeleteTaskModal,
  onRefreshData,
}: DashboardModalsProps) {
  return (
    <>

      {/* Create Task Modal */}
      {showAddTaskModal && (
        <CreateTaskModal
          initialStatus={addTaskStatus}
          projectId={currentProject}
          onClose={onCloseAddTaskModal}
          onRefresh={onRefreshData}
        />
      )}

      {/* Create Project Modal */}
      {showAddProjectModal && (
        <CreateProjectModal
          onClose={onCloseAddProjectModal}
          onRefresh={onRefreshData}
        />
      )}

      {/* Delete Task Confirmation Modal */}
      {taskToDelete && (
        <DeleteConfirmModal
          title="Delete Task"
          itemTitle={taskToDelete.title}
          onConfirm={onConfirmDeleteTask}
          onClose={onCloseDeleteTaskModal}
        />
      )}
    </>
  );
}
