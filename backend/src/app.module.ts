import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Project, ProjectSchema } from './schemas/project.schema';
import { Task, TaskSchema } from './schemas/task.schema';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { ProjectsController } from './projects/projects.controller';
import { ProjectsService } from './projects/projects.service';
import { TasksController } from './tasks/tasks.controller';
import { TasksService } from './tasks/tasks.service';

const mongoUri = process.env.MONGODB_URI || (global as any).__MONGO_URI__ || 'mongodb://127.0.0.1:27017/pyramid_task_db';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGODB_URI || (global as any).__MONGO_URI__ || 'mongodb://127.0.0.1:27017/pyramid_task_db',
      }),
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: Task.name, schema: TaskSchema },
    ]),
  ],
  controllers: [AuthController, ProjectsController, TasksController],
  providers: [AuthService, ProjectsService, TasksService],
})
export class AppModule {}
