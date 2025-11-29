# 🏢 Employee Management System - COMP3123 Assignment 2

A full-stack employee management system built with **Node.js**, **Express**, **MongoDB**, **React**, and **Material-UI**.

## 👤 Student Information
- **Student ID**: 101533489
- **Name**: Omar Romero Garcia
- **Course**: COMP3123 - Full Stack Development
- **Assignment**: Assignment 2
- **Semester**: Fall 2024
- **GitHub Repository**: <REPLACE_WITH_REPO_URL>

## 🎯 Project Overview

This is a comprehensive employee management system that allows organizations to:
- **User Authentication**: Secure signup and login with JWT tokens
- **Employee CRUD Operations**: Create, Read, Update, and Delete employee records
- **File Upload**: Profile picture upload with image validation
- **Advanced Search**: Search employees by department or position
- **Responsive UI**: Professional interface built with Material-UI
- **Data Validation**: Comprehensive form validation on both frontend and backend
- **Security**: Protected routes, input sanitization, and error handling

## 🏗️ Architecture

### Backend (Node.js + Express + MongoDB)
- **RESTful API** with comprehensive endpoints
- **JWT Authentication** for secure access
- **File Upload** using Multer middleware
- **Data Validation** with express-validator
- **MongoDB** with Mongoose ODM
- **Error Handling** and logging

### Frontend (React + Material-UI)
- **React Router** for navigation
- **Context API** for state management
- **Axios** for API communication
- **Material-UI** for professional UI components
- **Form Validation** with real-time feedback
- **Responsive Design** for all screen sizes

## 📁 Repository Structure

```
comp3123_assignment2/
├── backend/                    # Node.js Backend Server
│   ├── models/                 # MongoDB Data Models
│   ├── routes/                # API Route Handlers
│   ├── middleware/            # Custom Middleware
│   ├── uploads/               # File Upload Directory
│   ├── server.js              # Main Server Entry Point
│   ├── package.json           # Backend Dependencies
│   └── Dockerfile             # Backend Container Config
│
├── frontend/                  # React Frontend Application
│   ├── src/                   # Source Code
│   │   ├── api/              # API Integration Layer
│   │   ├── components/       # Reusable Components
│   │   ├── context/          # React Context Providers
│   │   ├── pages/            # Page Components
│   │   └── App.js            # Main App Component
│   ├── public/               # Static Assets
│   ├── package.json          # Frontend Dependencies
│   └── Dockerfile            # Frontend Container Config
│
├── screenshots/              # Application Screenshots
├── docker-compose.yml        # Multi-Container Setup
├── mongo-init.js            # Database Initialization
├── .gitignore               # Git Ignore Rules
└── README.md                # Project Documentation
```

## 🔌 API Endpoints

### Authentication Endpoints
```
POST /api/auth/signup          - Register new user
POST /api/auth/login           - User login
GET  /api/auth/profile         - Get user profile
POST /api/auth/verify-token    - Verify JWT token
POST /api/auth/logout          - Logout user
```

### Employee Endpoints
```
GET    /api/employees              - Get all employees (paginated)
POST   /api/employees              - Create new employee (with image upload)
GET    /api/employees/:id          - Get single employee
PUT    /api/employees/:id          - Update employee (with image upload)
DELETE /api/employees/:id          - Delete employee (soft delete)
GET    /api/employees/search       - Search employees by department/position
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (v4.4 or higher)
- **Git**
- **Docker** (recommended for containerized deployment)

## 🔧 How to Run Backend

### Local Development
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create and configure .env file
# Set MONGODB_URI, JWT_SECRET, etc.

# Start MongoDB service locally
# Ensure MongoDB is running on localhost:27017

# Start backend server
npm run dev
```

Backend will be available at: **http://localhost:5000**

## 💻 How to Run Frontend

### Local Development
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start React development server
npm start
```

Frontend will be available at: **http://localhost:3000**

## 🐳 How to Run with Docker

### Using Docker Compose (Recommended)
```bash
# Clone repository
git clone https://github.com/Shoaibxaif/COMP3123-assignment2.git
cd comp3123_assignment2

# Build and start all services
docker-compose up --build

# Run in detached mode (background)
docker-compose up -d --build

# Stop all services
docker-compose down

# Stop and remove data (full cleanup)
docker-compose down -v
```

### Access Points:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 👨‍💼 Default Login Credentials

For testing purposes, use these pre-created accounts:

### Admin User
- **Email**: admin@employee-system.com
- **Password**: Admin123!

### Regular User
- **Email**: john.manager@employee-system.com
- **Password**: Admin123!

## 📱 Application Features

### 🔐 Authentication System
- **Secure Registration**: User signup with validation
- **JWT Login**: Token-based authentication
- **Protected Routes**: Automatic redirection for unauthorized access
- **Session Management**: Persistent login with localStorage
- **Password Security**: Bcrypt hashing with salt

### 👥 Employee Management
- **Employee List**: Paginated table with search and sort
- **Add Employee**: Comprehensive form with validation
- **View Employee**: Detailed employee profile
- **Edit Employee**: Update employee information
- **Delete Employee**: Soft delete with confirmation
- **Profile Pictures**: Image upload with validation

### 🔍 Advanced Search
- **Department Filter**: Search by specific department
- **Position Search**: Find employees by job title
- **Combined Filters**: Search by both department and position
- **Real-time Results**: Dynamic search with immediate feedback

### 🎨 User Interface
- **Material-UI Components**: Professional and consistent design
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Data Grid**: Advanced table with sorting and pagination
- **Form Validation**: Real-time validation with error messages
- **Toast Notifications**: User feedback for all actions
- **Loading States**: Visual feedback during API calls

## 🔧 Environment Configuration

### Backend Environment Variables (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/employee_management
JWT_SECRET=your_super_secret_jwt_key_comp3123_2024
JWT_EXPIRES_IN=24h
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads/
```

### Frontend Environment Variables (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🧪 Testing the Application

### 1. Authentication Flow
1. Navigate to http://localhost:3000
2. Click "Create new account" to register
3. Fill out the signup form with valid data
4. Login with your credentials
5. Test the "Try Demo Account" button on login page

### 2. Employee Management
1. **Add Employee**: Click "Add Employee" and fill all required fields
2. **Upload Image**: Test profile picture upload (max 5MB, JPG/PNG/GIF)
3. **View Employee**: Click "View" on any employee
4. **Edit Employee**: Click "Edit" to modify employee data
5. **Delete Employee**: Click "Delete" and confirm

### 3. Search Functionality
1. Navigate to search page from the navbar
2. Filter by department dropdown
3. Search by position text input
4. Test combined search criteria
5. Verify search results display correctly

### 4. Error Handling
1. Test form validation by submitting empty forms
2. Try uploading invalid file types
3. Test with network disconnected
4. Verify error messages are user-friendly

## 📸 Application Screenshots

### Login Page
![Login Page](screenshots/Screenshot%202025-11-28%20171036.png)

### Employee Dashboard
![Employee List](screenshots/Screenshot%202025-11-28%20183301.png)

### Add Employee Form
![Add Employee](screenshots/Screenshot%202025-11-28%20183315.png)

### Employee Profile
![View Employee](screenshots/Screenshot%202025-11-28%20183340.png)

### Search Functionality
![Search Page](screenshots/Screenshot%202025-11-28%20183355.png)

### Mobile Responsive
![Mobile View](screenshots/Screenshot%202025-11-28%20183453.png)

## 🚀 Deployment Options

### Option 1: Docker Deployment (Recommended)
```bash
# Production deployment with Docker
docker-compose -f docker-compose.prod.yml up -d --build
```

### Option 2: Render Deployment
1. **Backend**: Deploy to Render as a Web Service
2. **Frontend**: Deploy to Render as a Static Site
3. **Database**: Use MongoDB Atlas

### Option 3: Railway Deployment
1. **Backend**: Deploy to Railway
2. **Frontend**: Deploy to Vercel
3. **Database**: Use MongoDB Atlas

### Option 4: Heroku Deployment
1. **Backend**: Deploy to Heroku
2. **Frontend**: Deploy to Netlify
3. **Database**: Use MongoDB Atlas

## 🛠️ Troubleshooting

### Common Issues and Solutions

#### 1. Backend not starting
```bash
# Check if MongoDB is running
mongosh

# Check if port 5000 is available
netstat -an | grep :5000

# Clear npm cache
npm cache clean --force
```

#### 2. Frontend not loading
```bash
# Clear React build cache
rm -rf node_modules package-lock.json
npm install

# Check for port conflicts
netstat -an | grep :3000
```

#### 3. Docker issues
```bash
# Remove all containers and images
docker-compose down -v
docker system prune -a

# Rebuild everything
docker-compose up --build --force-recreate
```

#### 4. File upload not working
- Check upload directory exists: `backend/uploads/`
- Verify file size limits (5MB max)
- Ensure supported file types (JPG, PNG, GIF, WebP)

## 📝 Development Notes

### Code Quality Standards
- **ES6+ JavaScript**: Modern JavaScript features
- **Async/Await**: Clean asynchronous code
- **Error Handling**: Comprehensive try-catch blocks
- **Validation**: Frontend and backend validation
- **Security**: Input sanitization and JWT security
- **Documentation**: Well-commented code

### Best Practices Implemented
- **RESTful API Design**: Standard HTTP methods and status codes
- **Component Reusability**: Modular React components
- **State Management**: Centralized state with Context API
- **Form Handling**: Controlled components with validation
- **Error Boundaries**: Graceful error handling in React
- **Performance**: Lazy loading and optimization

## 🤝 Contributing

This is an academic project for COMP3123. No external contributions are accepted.

## 📄 License

This project is created for educational purposes as part of COMP3123 course requirements.

---

**Built with ❤️ for COMP3123 - Full Stack Development**#   C O M P 3 1 2 3 - a s s i g n m e n t 2 
 
 