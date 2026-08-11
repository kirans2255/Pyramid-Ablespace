# Pyramid Task Manager

A full-stack task and project management application built with Next.js 14, Tailwind CSS, NestJS, and MongoDB.

## Features

- **Kanban Board & Table Views**: Switch between board view and list view with column filtering. Drag and drop cards between status columns to update state in MongoDB.
- **Header Field & Filter Customization**: Toggle visible fields (Priority, Members, Due Date, Labels, Status, Reporter) and apply multi-level filters across views.
- **Task Detail View**: View task properties, lock editing, toggle task watching, copy shareable task links, manage subtasks with priority and due dates, and post comments.
- **Profile & Account Settings**: Dedicated `/profile` route to view and update user profile details (Name, Title, Username, Avatar).
- **Guest Access**: Quick guest login that generates random creative aliases and non-face avatars.
- **Theme Support**: Light/Dark theme toggle and accent color modes.

## Architecture & Design Decisions

- **Nested Subtasks & Comments**: Subtasks and comments are stored directly on task documents in MongoDB for fast retrieval and single-query operations.
- **Optimistic State Updates**: Frontend updates local UI state immediately while persisting changes asynchronously to the NestJS API.
- **NestJS DTO Validation**: API endpoints use NestJS `ValidationPipe` with `class-validator` DTOs (`CreateTaskDto`, `UpdateTaskDto`, `CreateSubtaskDto`, `CreateCommentDto`).
- **MongoDB Fallback**: The backend connects to a local MongoDB database by default, falling back to `mongodb-memory-server` if no local MongoDB instance is running.

## Project Structure

```
Pyramid/
├── backend/
│   └── src/
│       ├── auth/          # Authentication & user profile endpoints
│       ├── projects/      # Project endpoints
│       ├── tasks/         # Task, subtask, and comment endpoints
│       └── schemas/       # Mongoose schemas (User, Project, Task)
└── frontend/
    └── src/
        ├── app/           # Next.js App Router (/login, /dashboard, /profile)
        ├── components/    # Layout, Kanban, Task Table, Detail, UI components
        ├── context/       # Auth and Theme context providers
        └── services/      # REST API client handlers
```

## Local Setup

### 1. Backend

```bash
cd backend
npm install
npm run start:dev
```

To seed initial sample data:
```bash
npm run seed
```

The NestJS server runs on `http://localhost:4000/api`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The Next.js application runs on `http://localhost:3000`.
