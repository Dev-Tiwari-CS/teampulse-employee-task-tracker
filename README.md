# TeamPulse — Employee Task & Team Productivity Platform

![TeamPulse Banner](https://img.shields.io/badge/TeamPulse-Task%20Management-243B80?style=for-the-badge&logo=github&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Node](https://img.shields.io/badge/Node.js-24.x-green)
![React](https://img.shields.io/badge/React-18.x-61DAFB)
![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1)

A professional, role-based task management application where **admins** manage employees and assign tasks, while **employees** update task statuses with a polished, modern interface.

---

## 📋 Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Screenshots](#screenshots)
5. [Prerequisites](#prerequisites)
6. [Quick Setup (Windows)](#quick-setup-windows)
7. [Environment Configuration](#environment-configuration)
8. [Database Setup](#database-setup)
9. [Running the Application](#running-the-application)
10. [API Reference](#api-reference)
11. [Authentication & Roles](#authentication--roles)
12. [Troubleshooting](#troubleshooting)
13. [Security Considerations](#security-considerations)
14. [Future Improvements](#future-improvements)
15. [License & Attribution](#license--attribution)

---

## ✨ Features

**Core Functionality**
- 🔐 **JWT authentication** with bcrypt-hashed passwords
- 👥 **Role-based access control** (admin/employee)
- 📋 **Task management** – create, assign, update status
- 🔍 **Filtering & sorting** – by status, due date, assignee
- 📊 **Pagination** – server-side with metadata
- 📝 **Activity logs** – audit trail for admin actions

**Admin Capabilities**
- View all employees and tasks
- Create and assign new tasks
- Edit any task field (title, description, assignee, due date)
- View system activity logs
- Apply filters and sort across all data

**Employee Experience**
- View only assigned tasks
- Update task status (Pending → In Progress → Completed)
- Filter personal task list
- Clean, focused dashboard

**Bonus Features**
- 🎨 **Professional UI** – modern design with consistent color palette
- ♿ **Accessibility** – ARIA labels, keyboard navigation, proper contrast
- 📱 **Responsive layout** – works on desktop, tablet, mobile
- 🛡️ **Security hardened** – SQL injection prevention, JWT expiration
- 📦 **Docker support** (optional)

---

## 🛠️ Tech Stack

| Layer        | Technology                          | Version |
|--------------|-------------------------------------|---------|
| **Frontend** | React 18, Vite, React Router 6      | 18.3.1  |
|              | Axios (HTTP client)                 | 1.7.7   |
| **Backend**  | Node.js, Express                    | 24.14.0 |
|              | MySQL2 (Promise-based)              | 3.11.0  |
|              | JWT authentication                  | 9.0.2   |
|              | bcryptjs password hashing           | 2.4.3   |
| **Database** | MySQL Community Server              | 8.0.46+ |
| **Tooling**  | Nodemon (dev server)                | 3.1.4   |
|              | dotenv (environment config)         | 16.4.5  |

---

## 🏗️ Architecture

```bash
TeamPulse/
├── backend/                          # Node.js + Express API
│   ├── src/
│   │   ├── config/db.js              # MySQL connection pool
│   │   ├── middleware/               # auth, validation, error handling
│   │   ├── routes/                   # auth, users, tasks, activity-logs
│   │   ├── controllers/              # thin HTTP layer
│   │   ├── services/                 # business logic & authorization
│   │   ├── models/                   # SQL data access (includes JOINs)
│   │   ├── utils/                    # JWT, ApiError, asyncHandler, migrate, seed
│   │   ├── app.js                    # Express app setup
│   │   └── server.js                 # server entry point
│   ├── .env.example                  # Environment template
│   ├── package.json                  # Backend dependencies
│   └── Dockerfile                    # Containerization
├── frontend/                         # React SPA
│   ├── src/
│   │   ├── api/                      # Axios client & endpoints
│   │   ├── context/AuthContext.jsx   # Session state management
│   │   ├── components/               # Reusable UI components
│   │   ├── pages/                    # Login, AdminDashboard, EmployeeDashboard
│   │   ├── App.jsx                   # Router & protected routes
│   │   ├── main.jsx                  # React entry point
│   │   └── styles.css                # Complete design system
│   ├── .env.example                  # Frontend environment template
│   ├── package.json                  # Frontend dependencies
│   └── vite.config.js                # Vite configuration
├── database/
│   └── schema.sql                    # Database DDL (CREATE statements)
├── postman/
│   └── TeamPulse.postman_collection.json  # API testing collection
└── docker-compose.yml                # Docker orchestration (optional)
```

**Design Pattern:** Layered architecture (routes → controllers → services → models) with centralized error handling and consistent API response format.

---

## 📸 Screenshots

*Login Page*
> Modern split-screen layout with demo account buttons and professional branding.

*Admin Dashboard*
> Statistics tiles, task table with filtering, pagination, and create/edit modal.

*Employee Dashboard*
> Personal task list with status progression and focused interface.

*Mobile Responsive*
> Adapts to tablet and mobile screens with optimized layouts.

*(Note: Screenshots would be added here after running the application locally.)*

---

## ⚙️ Prerequisites

Before installation, ensure you have:

- **Windows 11** or Windows 10 (macOS/Linux also supported)
- **Node.js** ≥ 18 (v24.14.0 recommended) – [Download](https://nodejs.org/)
- **npm** ≥ 8 (v11.11.0 comes with Node.js)
- **MySQL Community Server** ≥ 8.0.46 – [Download](https://dev.mysql.com/downloads/mysql/)
- **Git** (v2.52.0+) – [Download](https://git-scm.com/)
- **VS Code** (or any code editor) – [Download](https://code.visualstudio.com/)

**Verification commands:**
```powershell
node --version        # Should show v24.14.0+
npm --version         # Should show v11.11.0+
mysql --version       # Should show 8.0.46+
git --version         # Should show 2.52.0+
```

---

## 🚀 Quick Setup (Windows)

Follow these steps to get TeamPulse running locally in under 10 minutes:

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/teampulse-employee-task-tracker.git
cd teampulse-employee-task-tracker
```

### 2. Install Dependencies
```bash
# Backend
cd backend
npm install
cd ..

# Frontend
cd frontend
npm install
cd ..
```

### 3. Configure Environment
```bash
# Copy example files
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
```

Edit `backend/.env` and add your MySQL password:
```
DB_PASSWORD=your_mysql_password_here
```

### 4. Setup Database
```bash
cd backend
npm run migrate
npm run seed
```

### 5. Start Servers
```powershell
# Terminal 1 - Backend
cd backend
npm run dev
# Should output: ✓ Connected to MySQL ✓ API listening on http://localhost:5000

# Terminal 2 - Frontend
cd frontend
npm run dev
# Should output: VITE ready in X ms → http://localhost:5173
```

### 6. Open in Browser
Navigate to **http://localhost:5173** and log in with demo credentials below.

---

## 🔧 Environment Configuration

### Backend (`.env`)
```env
# Server
PORT=5000
NODE_ENV=development

# MySQL Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=task_tracker

# JWT (change for production)
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=1d

# CORS (frontend origin)
CLIENT_URL=http://localhost:5173
```

### Frontend (`.env`)
```env
# Backend API URL
VITE_API_URL=http://localhost:5000
```

---

## 🗄️ Database Setup

### Manual Setup (Alternative)
```bash
mysql -u root -p < database/schema.sql
```

### Schema Overview
Three main tables with proper indexing and foreign keys:

**`users`**
- `id`, `name`, `email` (unique), `password` (bcrypt hash), `role` (admin/employee), `created_at`

**`tasks`**
- `id`, `title`, `description`, `assigned_to` (FK to users.id), `status` (pending/in_progress/completed), `due_date`, `created_at`, `updated_at`

**`activity_logs`** (bonus)
- `id`, `user_id`, `action`, `entity`, `entity_id`, `details`, `created_at`

### Demo Data
The seed script (`npm run seed`) creates:
- **1 admin:** dev@gmail.com
- **3 employees:** aisha@demo.com, ben@demo.com, chen@demo.com
- **6 sample tasks** with various statuses and due dates
- **Password for all:** `password123`

---

## 🏃 Running the Application

### Development Mode
```bash
# Terminal 1: Backend API
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

### Production Build
```bash
cd frontend
npm run build        # Creates dist/ folder
npm run preview      # Preview production build

cd backend
npm start            # Production mode (no Nodemon)
```

### Docker (Optional)
```bash
# Uncomment docker-compose.yml first
docker compose up --build

# Then seed data
docker compose exec backend npm run seed
```

---

## 📡 API Reference

Base URL: `http://localhost:5000`

### Authentication
All endpoints return `{ error: { message, details? } }` on failure.

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/auth/register` | Public | Register new user |
| `POST` | `/auth/login` | Public | Login, returns user + JWT |
| `GET` | `/auth/me` | Authenticated | Current user from token |

**Login Example:**
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"dev@gmail.com","password":"password123"}'
```

### Tasks
Protected endpoints require `Authorization: Bearer <token>` header.

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/tasks` | Admin only | Create new task |
| `GET` | `/tasks` | Authenticated | List tasks (admin: all, employee: own) |
| `GET` | `/tasks/:id` | Auth + permission | Single task with assignee details |
| `PUT` | `/tasks/:id` | Auth + permission | Update task (admin: any field, employee: status only) |

**Query Parameters for `GET /tasks`:**
- `status` – filter by status (pending, in_progress, completed)
- `dueBefore`, `dueAfter` – date filtering (YYYY-MM-DD)
- `page`, `limit` – pagination (default: page=1, limit=10, max=100)
- `sortBy` – created_at, due_date, status, title
- `order` – asc, desc

### Users & Activity Logs
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/users` | Admin only | List all users (?role=employee optional) |
| `GET` | `/users/:id/tasks` | Admin or self | Paginated tasks for specific user |
| `GET` | `/activity-logs` | Admin only | Recent system actions (?limit=50) |

---

## 🔐 Authentication & Roles

### JWT Payload Structure
```json
{
  "id": 1,
  "role": "admin",
  "name": "Admin User",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Role Permissions
**Admin (`admin`)**
- Create, read, update, delete any task
- View all users and activity logs
- Register new users (including other admins)
- Full CRUD on all resources

**Employee (`employee`)**
- View only assigned tasks
- Update only task status (Pending → In Progress → Completed)
- Cannot view other employees' tasks or user lists
- Cannot create or delete tasks

---

## 🛠️ Troubleshooting

### Common Issues

**1. MySQL Connection Failed**
```
✗ Migration failed: Access denied for user 'root'@'localhost'
```
- **Solution:** Ensure MySQL service (`MySQL80`) is running:
  ```powershell
  Get-Service MySQL80 | Select-Object Name, Status
  ```
 - Set correct password in `backend/.env`

**2. Port Already in Use**
```
Error: listen EADDRINUSE: address already in use :::5000
```
- **Solution:** Kill the process or change PORT in `.env`:
  ```powershell
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  ```

**3. Frontend Can't Connect to Backend**
```
AxiosError: Network Error
```
- **Solution:** Verify backend is running (`http://localhost:5000/health`) and CORS is configured.

**4. Database Already Exists**
```
Error: ER_DB_CREATE_EXISTS: Can't create database 'task_tracker'; database exists
```
- **Solution:** The migration script uses `CREATE DATABASE IF NOT EXISTS` – safe to rerun.

### Development Commands
```bash
# Rebuild database from scratch
cd backend
npm run migrate  # Drops and recreates tables
npm run seed     # Inserts fresh demo data

# Check server health
curl http://localhost:5000/health

# View MySQL data
mysql -u root -p -e "USE task_tracker; SELECT * FROM users;"
```

---

## 🛡️ Security Considerations

### Implemented Security Features
- **Password hashing** – bcrypt with 10 rounds
- **JWT expiration** – tokens expire after 1 day
- **SQL injection prevention** – parameterized queries, column whitelisting
- **CORS configuration** – only frontend origin allowed
- **Input validation** – all API endpoints validate request body
- **Role-based authorization** – enforced at service layer

### Production Deployment Checklist
1. Change `JWT_SECRET` to a strong random string
2. Use HTTPS in production
3. Set `NODE_ENV=production`
4. Implement rate limiting
5. Use environment-specific database credentials
6. Regular dependency updates (`npm audit`)

### Dependency Security Status
- **Backend:** ✅ All vulnerabilities fixed (`npm audit` reports 0)
- **Frontend:** ⚠️ 4 vulnerabilities remain (require major version bumps – safe for development)

---

## 🚀 Future Improvements

### Planned Features (Backlog)
1. **Email notifications** – task assignment and due date reminders
2. **File attachments** – allow uploading documents to tasks
3. **Team dashboards** – visual progress charts and metrics
4. **Calendar view** – timeline visualization of tasks
5. **Bulk operations** – select multiple tasks for batch updates
6. **User profiles** – profile pictures and personal settings

### Technical Enhancements
- **Testing suite** – Jest/React Testing Library
- **CI/CD pipeline** – GitHub Actions for automated testing
- **Docker optimization** – multi-stage builds, health checks
- **API documentation** – Swagger/OpenAPI spec
- **Performance monitoring** – logging, metrics collection

---

## 📄 License & Attribution

### License
This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

This is a derivative work based on the original [Employee Task Tracker](https://github.com/SagarGitRepo/employee-task-tracker) by SagarGitRepo, which is also MIT licensed.

### Original Project
TeamPulse is based on the original **Employee Task Tracker** project by [SagarGitRepo](https://github.com/SagarGitRepo/employee-task-tracker).

### Modifications in this fork
- Complete rebranding to "TeamPulse"
- Professional UI/UX redesign with indigo/teal/amber palette
- Security hardening (npm audit fixes)
- Improved documentation and setup instructions
- Accessibility improvements (ARIA labels, keyboard navigation)
- Updated demo credentials

---

## 📞 Support

**Need help?**
1. Check the [Troubleshooting](#troubleshooting) section
2. Review the API documentation
3. Create an issue on GitHub

**Found a bug?**
Please report via GitHub Issues with:
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details

**Want to contribute?**
1. Fork the repository
2. Create a feature branch
3. Submit a pull request with clear description

---

**TeamPulse** – *Track work, move fast.*
