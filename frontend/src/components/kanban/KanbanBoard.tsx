import React from 'react';
import { KanbanColumn } from './KanbanColumn';
import { TaskItem } from './TaskCard';
import { VisibleFields } from '../layout/Header';

interface KanbanBoardProps {
  tasks: TaskItem[];
  onSelectTask: (task: TaskItem) => void;
  onDeleteTask: (task: TaskItem) => void;
  onOpenAddTask: (status: string) => void;
  onMoveTask?: (taskId: string, newStatus: string) => void;
  visibleFields?: VisibleFields;
}

export function KanbanBoard({
  tasks,
  onSelectTask,
  onDeleteTask,
  onOpenAddTask,
  onMoveTask,
  visibleFields,
}: KanbanBoardProps) {
  const columns = ['To Do', 'Doing', 'Completed', 'On Hold'];

  return (
    <div className="flex gap-4 overflow-x-auto pb-6 pt-1 items-start h-[calc(100vh-7rem)]">
      {columns.map((status) => {
        const columnTasks = tasks.filter((t) => t.status === status);
        return (
          <KanbanColumn
            key={status}
            status={status}
            tasks={columnTasks}
            onSelectTask={onSelectTask}
            onDeleteTask={onDeleteTask}
            onOpenAddTask={onOpenAddTask}
            onMoveTask={onMoveTask}
            visibleFields={visibleFields}
          />
        );
      })}
    </div>
  );
}
