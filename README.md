# 📁 College Project Management Platform (MERN Stack)

A clean, beginner-friendly **Project Management Platform** designed specifically for college students to learn and explain modern web development fundamentals in viva/interviews.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Running locally on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI)

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```
The backend server will start on **`http://localhost:5000`**.

### 2. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The React frontend application will start on **`http://localhost:5173`**.

---

## 🛠️ Tech Stack & Dependencies

- **Backend**: Node.js, Express.js
- **Database**: MongoDB + Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens - Access Token & Refresh Token)
- **Password Hashing**: `bcryptjs`
- **Frontend**: React.js (Vite, Axios)

---

## 📂 Project Structure & Architecture

```text
Project Management/
├── backend/
│   ├── config/
│   │   └── db.js                # MongoDB connection setup using Mongoose
│   ├── models/
│   │   ├── User.js              # User schema (name, email, password, role, tokens)
│   │   ├── Project.js           # Project schema (name, description, owner, members)
│   │   ├── Task.js              # Task schema (title, project, assignedTo, status, priority)
│   │   └── Comment.js           # Comment schema (text, user, task, createdAt)
│   ├── controllers/
│   │   ├── authController.js    # Register, Login, Logout, Refresh Token, Forgot/Reset Password
│   │   ├── userController.js    # Get all users & update profile
│   │   ├── projectController.js # Create, View, Update, Delete projects & manage members
│   │   ├── taskController.js    # Create, View, Update, Delete tasks & My Tasks
│   │   └── commentController.js # Add comments & view task comments
│   ├── middleware/
│   │   └── authMiddleware.js    # Protect routes (JWT verification) & authorize roles
│   ├── routes/
│   │   ├── authRoutes.js        # /api/auth routes
│   │   ├── userRoutes.js        # /api/users routes
│   │   ├── projectRoutes.js     # /api/projects routes
│   │   ├── taskRoutes.js        # /api/tasks routes
│   │   └── commentRoutes.js     # /api/comments routes
│   ├── utils/
│   │   └── generateTokens.js    # Helper functions to sign JWT access and refresh tokens
│   ├── .env                     # Sensitive environment configuration
│   ├── server.js                # Express app entry point
│   └── package.json
│
├── frontend/                    # Simple React demonstration frontend (Vite)
│   ├── src/
│   │   ├── api.js               # Axios instance with Bearer token interceptor
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Global React Context for user session state
│   │   ├── pages/               # Login, Register, Forgot/Reset Password, Dashboard, Projects, Tasks, Profile
│   │   ├── App.jsx              # Routing & main page layout switcher
│   │   └── index.css            # Clean modern dark theme styles
│   └── package.json
└── README.md
```

---

## 🔌 API Route Documentation

### 🔑 Authentication Routes (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT tokens |
| `POST` | `/api/auth/logout` | Private | Clear refresh token in DB |
| `POST` | `/api/auth/refresh-token` | Public | Obtain new Access Token using Refresh Token |
| `POST` | `/api/auth/forgot-password` | Public | Request password reset token |
| `POST` | `/api/auth/reset-password` | Public | Reset password using reset token |
| `GET` | `/api/auth/me` | Private | Fetch logged-in user profile |

### 📁 Project Routes (`/api/projects`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/projects` | Private | Get all projects user owns or belongs to |
| `POST` | `/api/projects` | Private | Create a new project |
| `GET` | `/api/projects/:id` | Private | Get single project details & its tasks |
| `PUT` | `/api/projects/:id` | Private (Owner/Admin) | Update project name or description |
| `DELETE` | `/api/projects/:id` | Private (Owner/Admin) | Delete project & its tasks |
| `POST` | `/api/projects/:id/members` | Private (Owner/Admin) | Add member by email/userId |
| `DELETE` | `/api/projects/:id/members/:userId` | Private (Owner/Admin) | Remove member from project |

### 📝 Task Routes (`/api/tasks` & `/api/projects/:projectId/tasks`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/projects/:projectId/tasks` | Private | Get all tasks for a project |
| `POST` | `/api/projects/:projectId/tasks` | Private | Create a task in project |
| `GET` | `/api/tasks/my-tasks` | Private | Get tasks assigned to logged-in user |
| `GET` | `/api/tasks/:id` | Private | Get single task details |
| `PUT` | `/api/tasks/:id` | Private | Update task (status, priority, assignee) |
| `DELETE` | `/api/tasks/:id` | Private | Delete task |

### 💬 Comment Routes (`/api/tasks/:taskId/comments`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/tasks/:taskId/comments` | Private | Get all comments on a task |
| `POST` | `/api/tasks/:taskId/comments` | Private | Post a comment on a task |

---

## 🎓 College Interview & Viva Q&A Guide

### Q1: How does request flow work in Express?
**Answer**: `Request → Route → Middleware → Controller → Model → Database → JSON Response`.
1. Request arrives at `server.js`.
2. Matches route module (e.g. `/api/projects`).
3. Passes through `authMiddleware` to verify JWT token.
4. Handler function in `projectController` executes.
5. Queries MongoDB using Mongoose model (`Project.find()`).
6. Sends structured JSON response back to client.

### Q2: What is the difference between Access Token and Refresh Token?
**Answer**:
- **Access Token**: Short-lived (15 minutes). Sent in the `Authorization: Bearer <token>` header on every request to authenticate users quickly without database lookups.
- **Refresh Token**: Long-lived (7 days). Stored securely in the database. When the Access Token expires, the client uses the Refresh Token to obtain a new Access Token without asking the user to log in again.

### Q3: How are MongoDB document relationships handled?
**Answer**: We use **Mongoose References (`ObjectId` ref)**:
- `Project.owner` references `User._id`
- `Task.project` references `Project._id`
- `Task.assignedTo` references `User._id`
- `Comment.task` references `Task._id`
We use `.populate('assignedTo', 'name email')` to automatically replace ID references with populated document details when querying.
