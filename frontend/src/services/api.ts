const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export async function guestLoginApi() {
  const res = await fetch(`${API_BASE}/auth/guest`, { method: 'POST' });
  if (!res.ok) throw new Error('Guest login failed');
  return res.json();
}

export async function googleLoginApi(data: { email: string; name: string; avatar?: string; googleId?: string }) {
  const res = await fetch(`${API_BASE}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Google login failed');
  return res.json();
}

export async function updateProfileApi(
  userId: string,
  data: { name?: string; title?: string; username?: string; email?: string; avatar?: string },
) {
  const res = await fetch(`${API_BASE}/auth/profile/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
}

export async function fetchProjects() {
  const res = await fetch(`${API_BASE}/projects`);
  if (!res.ok) throw new Error('Failed to fetch projects from backend');
  return await res.json();
}

export async function createProject(data: { name: string; description?: string; color?: string; userId?: string }) {
  const res = await fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create project');
  return res.json();
}

export async function deleteProject(id: string) {
  const res = await fetch(`${API_BASE}/projects/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete project');
  return res.json();
}

export async function fetchTasks(params?: { projectId?: string; status?: string; search?: string; userId?: string; priority?: string }) {
  const cleanParams: any = {};
  if (params?.projectId) cleanParams.projectId = params.projectId;
  if (params?.status) cleanParams.status = params.status;
  if (params?.search) cleanParams.search = params.search;
  if (params?.userId) cleanParams.userId = params.userId;
  if (params?.priority) cleanParams.priority = params.priority;

  const query = new URLSearchParams(cleanParams).toString();
  const res = await fetch(`${API_BASE}/tasks?${query}`);
  if (!res.ok) throw new Error('Failed to fetch tasks from backend');
  return await res.json();
}

export async function fetchTaskById(id: string) {
  const res = await fetch(`${API_BASE}/tasks/${id}`);
  if (!res.ok) throw new Error('Failed to fetch task');
  return res.json();
}

export async function createTask(data: any) {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create task');
  return res.json();
}

export async function updateTask(id: string, data: any) {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update task');
  return res.json();
}

export async function deleteTask(id: string) {
  const res = await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete task');
  return res.json();
}

export async function addSubtask(taskId: string, subtask: { title: string; priority?: string; dueDate?: string }) {
  const res = await fetch(`${API_BASE}/tasks/${taskId}/subtasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subtask),
  });
  if (!res.ok) throw new Error('Failed to add subtask');
  return res.json();
}

export async function toggleSubtask(taskId: string, subtaskId: string) {
  const res = await fetch(`${API_BASE}/tasks/${taskId}/subtasks/${subtaskId}/toggle`, {
    method: 'PATCH',
  });
  if (!res.ok) throw new Error('Failed to toggle subtask');
  return res.json();
}

export async function deleteSubtask(taskId: string, subtaskId: string) {
  const res = await fetch(`${API_BASE}/tasks/${taskId}/subtasks/${subtaskId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete subtask');
  return res.json();
}

export async function addComment(taskId: string, comment: { content: string; userId?: string; userName?: string; userAvatar?: string }) {
  const res = await fetch(`${API_BASE}/tasks/${taskId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(comment),
  });
  if (!res.ok) throw new Error('Failed to add comment');
  return res.json();
}
