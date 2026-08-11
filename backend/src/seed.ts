import mongoose from 'mongoose';
import { UserSchema } from './schemas/user.schema';
import { ProjectSchema } from './schemas/project.schema';
import { TaskSchema } from './schemas/task.schema';

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pyramid_task_db';
  console.log('Seeding database at:', uri);
  
  const conn = await mongoose.createConnection(uri).asPromise();
  
  const UserModel = conn.model('User', UserSchema);
  const ProjectModel = conn.model('Project', ProjectSchema);
  const TaskModel = conn.model('Task', TaskSchema);

  await UserModel.deleteMany({});
  await ProjectModel.deleteMany({});
  await TaskModel.deleteMany({});

  const guest = await UserModel.create({
    email: 'dexter@pyramid.app',
    name: 'Dexter',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    role: 'Admin',
    username: 'dexter_admin',
    isGuest: true,
  });

  const proj1 = await ProjectModel.create({
    name: 'Design Homepage',
    description: 'Main web design and user interface task group',
    color: '#3B82F6',
    userId: guest._id,
  });

  const proj2 = await ProjectModel.create({
    name: 'API Documentation',
    description: 'Backend REST API endpoints & schemas',
    color: '#10B981',
    userId: guest._id,
  });

  const initialTasks = [
    {
      title: 'Write API Documentation',
      description: 'Create clear and detailed API documentation to guide developers in using inventory and sales features.',
      status: 'To Do',
      priority: 'High',
      dueDate: new Date('2026-07-29'),
      labels: ['Deployment', 'Deployment'],
      projectId: proj2._id,
      assigneeId: guest._id,
      subtasks: [
        { id: 'st-1', title: 'Subtask 1', completed: true, priority: 'High', dueDate: '12 Sep 2026' },
        { id: 'st-2', title: 'Subtask 2', completed: false, priority: 'Low', dueDate: '15 Sep 2026' },
        { id: 'st-3', title: 'Subtask 3', completed: false, priority: 'Medium', dueDate: '18 Sep 2026' },
      ],
      comments: [
        {
          id: 'c-1',
          content: 'dsds',
          userId: guest._id.toString(),
          userName: 'Ankit Dutta',
          userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
          createdAt: new Date(),
        },
      ],
    },
    {
      title: 'Implement Search Function',
      description: 'Add full-text search capabilities across projects and task titles.',
      status: 'To Do',
      priority: 'Low',
      dueDate: new Date('2026-07-29'),
      labels: ['Deployment', 'Deployment'],
      projectId: proj1._id,
      assigneeId: guest._id,
      subtasks: [],
      comments: [],
    },
    {
      title: 'Deploy to Production',
      description: 'Set up CI/CD pipeline and release initial build.',
      status: 'To Do',
      priority: 'Medium',
      dueDate: new Date('2026-07-29'),
      labels: ['Deployment', 'Deployment'],
      projectId: proj1._id,
      assigneeId: guest._id,
      subtasks: [],
      comments: [],
    },
    {
      title: 'Code Review Completed',
      description: 'Review backend NestJS modules and data structures.',
      status: 'Doing',
      priority: 'High',
      dueDate: new Date('2026-07-29'),
      labels: ['Deployment', 'Deployment'],
      projectId: proj2._id,
      assigneeId: guest._id,
      subtasks: [],
      comments: [],
    },
    {
      title: 'Design Mockups Finalized',
      description: 'Finalize Figma design components and theme palette options.',
      status: 'Doing',
      priority: 'Medium',
      dueDate: new Date('2026-07-29'),
      labels: ['Deployment', 'Deployment'],
      projectId: proj1._id,
      assigneeId: guest._id,
      subtasks: [],
      comments: [],
    },
    {
      title: 'Feature Testing Passed',
      description: 'QA testing across browsers and tablet/mobile viewports.',
      status: 'Completed',
      priority: 'Low',
      dueDate: new Date('2026-07-30'),
      labels: ['Testing', 'Passed'],
      projectId: proj1._id,
      assigneeId: guest._id,
      subtasks: [],
      comments: [],
    },
    {
      title: 'UI Design Updated',
      description: 'Refine theme color accents and card components.',
      status: 'Completed',
      priority: 'Medium',
      dueDate: new Date('2026-07-31'),
      labels: ['Design', 'Updated'],
      projectId: proj1._id,
      assigneeId: guest._id,
      subtasks: [],
      comments: [],
    },
    {
      title: 'Security Audit Scheduled',
      description: 'Conduct security vulnerability audit and dependency checks.',
      status: 'Completed',
      priority: 'High',
      dueDate: new Date('2026-08-01'),
      labels: ['Audit', 'Scheduled'],
      projectId: proj2._id,
      assigneeId: guest._id,
      subtasks: [],
      comments: [],
    },
  ];

  await TaskModel.insertMany(initialTasks);
  console.log('Seeding completed successfully!');
  await conn.close();
}

seed().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
