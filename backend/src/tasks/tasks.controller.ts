import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async findAll(@Query() query: { projectId?: string; status?: string; priority?: string; search?: string; userId?: string }) {
    return this.tasksService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }

  @Post(':id/subtasks')
  async addSubtask(@Param('id') id: string, @Body() createSubtaskDto: CreateSubtaskDto) {
    return this.tasksService.addSubtask(id, createSubtaskDto);
  }

  @Patch(':id/subtasks/:subtaskId/toggle')
  async toggleSubtask(@Param('id') id: string, @Param('subtaskId') subtaskId: string) {
    return this.tasksService.toggleSubtask(id, subtaskId);
  }

  @Delete(':id/subtasks/:subtaskId')
  async deleteSubtask(@Param('id') id: string, @Param('subtaskId') subtaskId: string) {
    return this.tasksService.deleteSubtask(id, subtaskId);
  }

  @Post(':id/comments')
  async addComment(@Param('id') id: string, @Body() createCommentDto: CreateCommentDto) {
    return this.tasksService.addComment(id, createCommentDto);
  }
}
