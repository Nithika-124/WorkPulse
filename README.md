# 📊 WorkPulse - Weekly Report Generator & Team Dashboard

A full-stack application for managing weekly team reports with role-based access control, analytics dashboards, and project management.

## 🎯 Features

### For Team Members
- ✅ Submit structured weekly reports
- ✅ Track personal report history
- ✅ View team projects
- ✅ Monitor personal progress dashboard
- ✅ Fixed report format (Week range, Project, Tasks completed, Tasks planned, Blockers, Hours worked, Notes)

### For Managers
- ✅ View all team reports with filtering
- ✅ Team analytics dashboard with insights
- ✅ **Project/Category Management** (Add, Edit, Delete)
- ✅ Team member submission tracking
- ✅ Blocker management and tracking
- ✅ Performance analytics and trends
- ✅ AI Chat Assistant (Optional)

## 🏗️ Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- TailwindCSS + Radix UI
- Recharts (data visualization)
- Axios (HTTP client)

**Backend:**
- Node.js + Express 5
- MongoDB + Mongoose
- JWT Authentication
- bcrypt (password hashing)

## 📦 Prerequisites

- Node.js 16+
- npm or yarn
- MongoDB (cloud via Atlas recommended)

## 🚀 Setup & Installation

### 1. Backend Setup

```bash
cd backend
npm install
```

**Start Backend**:
```bash
npm run dev          # Development with nodemon
# or
npm start            # Production
```

Backend will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend
npm install
```

**Start Frontend**:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🔐 Authentication & Roles

### User Roles

#### **Team Member** (`role: "member"`)
- Can create/view own reports
- Can view projects
- Cannot manage projects
- Cannot access manager analytics

#### **Manager** (`role: "manager"`)
- Can view all team reports
- **Can create, edit, delete projects** ⭐
- Can assign team members to projects
- Full access to analytics dashboards
- Can filter and analyze team data

### Assign Team Members
Team members are added to projects via the MongoDB document structure. This can be done through the admin panel or directly via API.

## 📁 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── server.js              Main server file
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js  JWT validation
│   │   │   └── roleMiddleware.js  Role-based access
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Report.js
│   │   │   └── Project.js
│   │   ├── controllers/           Business logic
│   │   └── routes/                API endpoints
│   ├── scripts/
│   │   └── seed.js               Database seeding
│   ├── config/
│   │   └── db.js                 MongoDB connection
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── pages/             Page components
    │   │   ├── components/        UI components
    │   │   └── types.ts           TypeScript types
    │   ├── services/
    │   │   ├── api.js             Axios instance
    │   │   ├── authService.js     Auth API calls
    │   │   ├── reportService.ts   Report API calls
    │   │   └── projectService.ts  Project API calls
    │   └── main.tsx
    └── package.json
```

## 🧪 Testing the Application

### 1. Start Both Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```
### 3. Test in Browser
- Go to `http://localhost:5173`
- Login as manager
- Navigate to "Projects" tab to test project management
- Only manager can create/edit/delete projects
- Team members see a "Manager Only" badge

**Built with ❤️ for team collaboration and accountability**
