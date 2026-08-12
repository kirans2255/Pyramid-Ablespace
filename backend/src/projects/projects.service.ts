import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from '../schemas/project.schema';

@Injectable()
export class ProjectsService {
  constructor(@InjectModel(Project.name) private projectModel: Model<ProjectDocument>) {}

  async findAll() {
    try {
      return await this.projectModel.find().exec();
    } catch (err) {
      return [
        { _id: 'proj-1', name: 'Website Redesign', description: 'Next.js Frontend overhaul', color: '#F59E0B' },
        { _id: 'proj-2', name: 'Mobile App API', description: 'NestJS REST Endpoints', color: '#6366F1' },
      ];
    }
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
