import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type TaskDocument = Task & Document;

export class Subtask {
  id: string;
  title: string;
  completed: boolean;
  priority?: string;
  dueDate?: string;
}

export class Comment {
  id: string;
  content: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  createdAt: Date;
}

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ default: 'To Do' })
  status: string; // 'To Do' | 'Doing' | 'Completed' | 'On Hold'

  @Prop({ default: 'Medium' })
  priority: string; // 'Low' | 'Medium' | 'High'

  @Prop()
  dueDate?: Date;

  @Prop({ type: [String], default: [] })
  labels: string[];

  @Prop({ type: [Object], default: [] })
  resources: { name: string; url: string }[];

  @Prop({ type: MongooseSchema.Types.Mixed })
  projectId?: any;

  @Prop({ type: MongooseSchema.Types.Mixed })
  userId?: any;

  @Prop({ type: MongooseSchema.Types.Mixed })
  assigneeId?: any;

  @Prop({ type: Array, default: [] })
  subtasks: Subtask[];

  @Prop({ type: Array, default: [] })
  comments: Comment[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);
