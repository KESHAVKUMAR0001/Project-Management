# Project Management System

A MERN stack application for managing projects, tracking tasks, and team collaboration.

## Features
- User Authentication (JWT Login & Registration)
- Project Creation & Member Management
- Task Management with Priority & Status
- Responsive Dashboard UI

## Tech Stack
- Frontend: React, Vite, Axios
- Backend: Node.js, Express.js
- Database: MongoDB

## Getting Started

### Backend Setup
```bash
cd backend
npm install
npm run dev
```
Server: `http://localhost:5000`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
App: `http://localhost:5173`

## Main API Endpoints
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - User login
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/tasks/my-tasks` - View user tasks

## License
MIT
