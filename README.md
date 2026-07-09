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

**Configure Environment Variables** (`.env`):
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_secret_key_here
```

**Seed Database** (optional - creates sample data):
```bash
npm run seed
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

### Default Test Credentials

After running `npm run seed`:

| Role    | Email                 | Password   |
|---------|----------------------|-----------|
| Manager | alice@company.io     | manager123 |
| Member  | nadia@company.io     | member123  |
| Member  | marcus@company.io    | member123  |
| Member  | sofia@company.io     | member123  |

## 📋 API Endpoints

### Authentication
```
POST   /api/auth/register          Create new user account
POST   /api/auth/login             Login and get JWT token
```

### Reports (Team Member)
```
POST   /api/reports                Create new report (auth required)
GET    /api/reports/my             Get user's own reports (auth required)
PUT    /api/reports/:id            Update report (auth required)
DELETE /api/reports/:id            Delete report (auth required)
```

### Reports (Manager Only)
```
GET    /api/reports                Get all team reports (manager only)
  - Query params: ?memberId=X&projectId=Y&status=submitted&startDate=&endDate=

GET    /api/reports/analytics/summary        Overall statistics
GET    /api/reports/analytics/by-member      Analytics per team member
GET    /api/reports/analytics/by-project     Analytics per project
GET    /api/reports/analytics/blockers       List all open blockers
```

### Projects (All Users Can View)
```
GET    /api/projects               Get all projects (auth required)
```

### Projects (Manager Only)
```
POST   /api/projects               Create new project (manager only)
PUT    /api/projects/:id           Update project (manager only)
DELETE /api/projects/:id           Delete project (manager only)
```

## 🛡️ Authorization

All endpoints require JWT token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

**Manager-Only Endpoints** return `403 Forbidden` for non-managers.

## 📊 Project Management (Manager Feature)

### Add Project
**Manager Only**
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Client Portal",
    "description": "Main web application",
    "category": "Product",
    "lead": "John Doe"
  }'
```

### Edit Project
```bash
curl -X PUT http://localhost:5000/api/projects/<project_id> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "category": "Product"
  }'
```

### Delete Project
```bash
curl -X DELETE http://localhost:5000/api/projects/<project_id> \
  -H "Authorization: Bearer <token>"
```

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

### 2. Seed Sample Data (Optional)
```bash
# Terminal 3
cd backend
npm run seed
```

### 3. Test in Browser
- Go to `http://localhost:5173`
- Login as manager: `alice@company.io` / `manager123`
- Navigate to "Projects" tab to test project management
- Only manager can create/edit/delete projects
- Team members see a "Manager Only" badge

### 4. Test API with cURL

**Login**:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@company.io","password":"manager123"}'
```

**View Projects**:
```bash
curl -X GET http://localhost:5000/api/projects \
  -H "Authorization: Bearer <token>"
```

**Create Project** (Manager Only):
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer <manager_token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"New Project","category":"Product"}'
```

**Try as Team Member** (Should fail with 403):
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer <member_token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"New Project","category":"Product"}'
# Response: 403 Forbidden - "Insufficient permissions for this action"
```

## 🔑 Key Implementation Details

### Role-Based Access Control
- Implemented via `roleMiddleware.js` in backend
- Frontend enforces UI restrictions (manager-only buttons)
- API endpoints return proper HTTP status codes:
  - `401` - Not authenticated
  - `403` - Authenticated but not authorized
  - `200/201` - Success

### Project Management Features
✅ **Create Projects** - Name, description, category, lead, due date  
✅ **Edit Projects** - Update any field  
✅ **Delete Projects** - With confirmation dialog  
✅ **Assign Members** - Associate team members with projects  
✅ **Filter Reports** - By project in analytics

### Database Schema

**User**:
- name, email, password (hashed), role (member/manager), department

**Project**:
- name, description, category, members (array of User IDs), isActive

**Report**:
- user (ref), project (ref), weekRange, tasksCompleted (array), tasksPlanned (array), blockers, hoursWorked, notes, status, submittedAt

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify MONGO_URI is correct
- Check IP whitelist in MongoDB Atlas
- Ensure VPN is not blocking connection

### JWT Token Errors
- Token might be expired (7 days)
- Check Authorization header format: `Bearer <token>`
- Verify JWT_SECRET matches between login and API calls

### CORS Errors
- Backend CORS is enabled for all origins in dev
- For production, update CORS in `server.js`

### Project Not Showing for Team Members
- Verify user is not in "members" array of project
- Team members can view projects but not manage them
- Only managers can create/edit/delete

## 📝 Notes for Managers

- **Project Categories**: Use consistent naming (Product, Infrastructure, Research, Marketing, etc.)
- **Team Assignment**: Assign members to projects to track workload distribution
- **Blocker Tracking**: Use the analytics dashboard to monitor team blockers
- **Reports**: Access team reports for compliance tracking and performance analytics

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/Render)
```bash
git push heroku main
```

Update environment variables in hosting platform.

### Frontend Deployment (Vercel/Netlify)
```bash
npm run build
# Deploy the 'dist' folder
```

Update API base URL in `src/services/api.js` to point to production backend.

## 📞 Support & Documentation

- API documentation available at `/` endpoint
- Check backend logs for detailed error messages
- Browser console shows frontend API errors

---

**Built with ❤️ for team collaboration and accountability**
