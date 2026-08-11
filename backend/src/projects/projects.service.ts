import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from '../schemas/project.schema';

@Injectable()
export class ProjectsService {
  constructor(@InjectModel(Project.name) private projectModel: Model<ProjectDocument>) {}

  async findAll() {
    return this.projectModel.find().exec();
  }

  async create(data: { name: string; description?: string; color?: string; userId?: string }) {
    return this.projectModel.create(data);
  }

  async update(id: string, data: Partial<Project>) {
    const updated = await this.projectModel.findByIdAndUpdate(id, data, { new: true }).exec();
    if (!updated) throw new NotFoundException('Project not found');
    return updated;
  }

  async remove(id: string) {
    const res = await this.projectModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException('Project not found');
    return { success: true, id };
  }
}
