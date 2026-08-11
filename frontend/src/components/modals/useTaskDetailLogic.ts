'use client';

import { useState, useEffect } from 'react';
import { TaskItem } from '../kanban/TaskCard';
import { updateTask, addSubtask, toggleSubtask, deleteSubtask, addComment } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

export function useTaskDetailLogic(initialTask: TaskItem | null, onRefresh: () => void) {
  const { user } = useAuth();
  const [task, setTask] = useState<TaskItem | null>(initialTask);
  const [status, setStatus] = useState(initialTask?.status || 'To Do');
  const [priority, setPriority] = useState(initialTask?.priority || 'Medium');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newSubtaskPriority, setNewSubtaskPriority] = useState('Medium');
  const [newSubtaskDueDate, setNewSubtaskDueDate] = useState('');
  const [showAddSubtask, setShowAddSubtask] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(
    initialTask?.dueDate ? new Date(initialTask.dueDate) : new Date()
  );

  useEffect(() => {
    setTask(initialTask);
    if (initialTask) {
      setStatus(initialTask.status || 'To Do');
      setPriority(initialTask.priority || 'Medium');
    }
  }, [initialTask]);

  const handleStatusChange = async (newStatus: string) => {
    if (!task) return;
    setStatus(newStatus);
    const updated = await updateTask(task._id, { status: newStatus });
    if (updated) setTask(updated);
    onRefresh();
  };

  const handlePriorityChange = async (newPriority: string) => {
    if (!task) return;
    setPriority(newPriority);
    const updated = await updateTask(task._id, { priority: newPriority });
    if (updated) setTask(updated);
    onRefresh();
  };

  const handleAddSubtaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task || !newSubtaskTitle.trim()) return;
    const formattedDueDate = newSubtaskDueDate
      ? new Date(newSubtaskDueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      : '18 Sep 2026';

    const tempSubtask = {
      id: Math.random().toString(36).substring(2, 9),
      title: newSubtaskTitle.trim(),
      completed: false,
      priority: newSubtaskPriority,
      dueDate: formattedDueDate,
    };

    // Optimistic UI update
    const optimisticTask = {
      ...task,
      subtasks: [...(task.subtasks || []), tempSubtask],
    };
    setTask(optimisticTask);

    setNewSubtaskTitle('');
    setNewSubtaskPriority('Medium');
    setNewSubtaskDueDate('');
    setShowAddSubtask(false);

    try {
      const updated = await addSubtask(task._id, {
        title: tempSubtask.title,
        priority: tempSubtask.priority,
        dueDate: tempSubtask.dueDate,
      });
      if (updated) setTask(updated);
    } catch (err) {
      console.error('Failed to save subtask to database', err);
    }
    onRefresh();
  };

  const handleToggleSubtaskClick = async (subtaskId: string) => {
    if (!task) return;
    const optimisticSubtasks = (task.subtasks || []).map((st) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    setTask({ ...task, subtasks: optimisticSubtasks });

    try {
      const updated = await toggleSubtask(task._id, subtaskId);
      if (updated) setTask(updated);
    } catch (err) {
      console.error('Failed to toggle subtask in database', err);
    }
    onRefresh();
  };

  const handleDeleteSubtask = async (subtaskId: string) => {
    if (!task) return;
    const optimisticSubtasks = (task.subtasks || []).filter((st) => st.id !== subtaskId);
    setTask({ ...task, subtasks: optimisticSubtasks });

    try {
      const updated = await deleteSubtask(task._id, subtaskId);
      if (updated) setTask(updated);
    } catch (err) {
      console.error('Failed to delete subtask from database', err);
    }
    onRefresh();
  };

  const handleAddCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task || !commentText.trim()) return;

    const tempComment = {
      id: Math.random().toString(36).substring(2, 9),
      content: commentText.trim(),
      userName: user?.name || user?.email?.split('@')[0] || 'Dexter',
      userAvatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      createdAt: new Date(),
    };

    const optimisticTask = {
      ...task,
      comments: [...(task.comments || []), tempComment],
    };
    setTask(optimisticTask);
    setCommentText('');

    try {
      const updated = await addComment(task._id, {
        content: tempComment.content,
        userName: tempComment.userName,
        userAvatar: tempComment.userAvatar,
      });
      if (updated) setTask(updated);
    } catch (err) {
      console.error('Failed to save comment to database', err);
    }
    onRefresh();
  };

  const handleSelectDate = async (day: number) => {
    if (!task) return;
    const d = new Date(selectedDate);
    d.setDate(day);
    setSelectedDate(d);
    const updated = await updateTask(task._id, { dueDate: d });
    if (updated) setTask(updated);
    setShowDatePicker(false);
    onRefresh();
  };

  return {
    task: task || initialTask,
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
    selectedDate,
    handleStatusChange,
    handlePriorityChange,
    handleAddSubtaskSubmit,
    handleToggleSubtaskClick,
    handleDeleteSubtask,
    handleAddCommentSubmit,
    handleSelectDate,
  };
}
