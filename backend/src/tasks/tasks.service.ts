import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument } from '../schemas/task.schema';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async findAll(query?: { projectId?: string; status?: string; priority?: string; search?: string; userId?: string }) {
    const filter: any = {};

    if (query?.userId) {
      filter.$or = [
        { userId: query.userId },
        { userId: { $exists: false } },
        { userId: null },
      ];
    }

    if (query?.projectId && query.projectId !== 'null' && query.projectId !== 'undefined') {
      const projFilter: any[] = [{ projectId: query.projectId }];
      if (Types.ObjectId.isValid(query.projectId)) {
        projFilter.push({ projectId: new Types.ObjectId(query.projectId) });
      }
      if (filter.$or) {
        filter.projectId = { $in: [query.projectId, Types.ObjectId.isValid(query.projectId) ? new Types.ObjectId(query.projectId) : null].filter(Boolean) };
      } else {
        filter.$or = projFilter;
      }
    }

    if (query?.status) filter.status = query.status;
    if (query?.priority) filter.priority = query.priority;
    if (query?.search) {
      filter.title = { $regex: query.search, $options: 'i' };
    }
    return this.taskModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    const task = await this.taskModel.findById(id).exec();
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async create(data: Partial<Task>) {
    return this.taskModel.create(data);
  }

  async update(id: string, data: Partial<Task>) {
    const updated = await this.taskModel.findByIdAndUpdate(id, data, { new: true }).exec();
    if (!updated) throw new NotFoundException('Task not found');
    return updated;
  }

  async remove(id: string) {
    const res = await this.taskModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Task not found');
    return { success: true, id };
  }

  async addSubtask(taskId: string, subtask: { title: string; priority?: string; dueDate?: string }) {
    const task = await this.taskModel.findById(taskId);
    if (!task) throw new NotFoundException('Task not found');

    const newSubtask = {
      id: Math.random().toString(36).substring(2, 9),
      title: subtask.title,
      completed: false,
      priority: subtask.priority || 'Medium',
      dueDate: subtask.dueDate || '',
    };

    task.subtasks = task.subtasks || [];
    task.subtasks.push(newSubtask as any);
    task.markModified('subtasks');
    await task.save();
    return task;
  }

  async toggleSubtask(taskId: string, subtaskId: string) {
    const task = await this.taskModel.findById(taskId);
    if (!task) throw new NotFoundException('Task not found');

    const sub = task.subtasks.find((s) => s.id === subtaskId);
    if (sub) {
      sub.completed = !sub.completed;
      task.markModified('subtasks');
      await task.save();
    }
    return task;
  }

  async deleteSubtask(taskId: string, subtaskId: string) {
    const task = await this.taskModel.findById(taskId);
    if (!task) throw new NotFoundException('Task not found');

    task.subtasks = task.subtasks.filter((s) => s.id !== subtaskId);
    task.markModified('subtasks');
    await task.save();
    return task;
  }

  async addComment(taskId: string, comment: { content: string; userId?: string; userName?: string; userAvatar?: string }) {
    const task = await this.taskModel.findById(taskId);
    if (!task) throw new NotFoundException('Task not found');

    const newComment = {
      id: Math.random().toString(36).substring(2, 9),
      content: comment.content,
      userId: comment.userId || 'guest-1',
      userName: comment.userName || 'Dexter',
      userAvatar: comment.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      createdAt: new Date(),
    };

    task.comments.push(newComment as any);
    task.markModified('comments');
    await task.save();
    return task;
  }
}
