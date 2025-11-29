# 🏢 Employee Management System - COMP3123 Assignment 2

A full-stack employee management system built with **Node.js**, **Express**, **MongoDB**, **React**, and **Material-UI**.

## 👤 Student Information
- **Student ID**: [YOUR_STUDENT_ID]
- **Name**: [YOUR_NAME]
- **Course**: COMP3123 - Full Stack Development
- **Assignment**: Assignment 2
- **Semester**: Fall 2024

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

## 📁 Project Structure

```
comp3123_assignment2/
├── backend/                    # Node.js Backend
│   ├── models/                 # MongoDB Models
│   │   ├── User.js            # User model with authentication
│   │   └── Employee.js        # Employee model with validation
│   ├── routes/                # API Routes
│   │   ├── auth.js           # Authentication endpoints
│   │   └── employees.js      # Employee CRUD endpoints
│   ├── middleware/           # Custom middleware
│   │   ├── auth.js          # JWT authentication middleware
│   │   └── upload.js        # File upload middleware
│   ├── uploads/             # Profile picture storage
│   ├── .env                 # Environment variables
│   ├── server.js           # Main server file
│   ├── package.json        # Dependencies
│   └── Dockerfile          # Docker configuration
│
├── frontend/                  # React Frontend
│   ├── public/               # Static files
│   ├── src/
│   │   ├── api/             # API integration
│   │   │   └── api.js       # Axios configuration
│   │   ├── components/      # Reusable components
│   │   │   ├── ProtectedRoute.js
│   │   │   └── Navbar.js
│   │   ├── context/         # React Context
│   │   │   └── AuthContext.js
│   │   ├── pages/           # Page components
│   │   │   ├── LoginPage.js
│   │   │   ├── SignupPage.js
│   │   │   ├── EmployeeListPage.js
│   │   │   ├── AddEmployeePage.js
│   │   │   ├── ViewEmployeePage.js
│   │   │   ├── UpdateEmployeePage.js
│   │   │   └── SearchEmployeePage.js
│   │   ├── App.js           # Main App component
│   │   └── index.js         # Entry point
│   ├── package.json         # Dependencies
│   ├── Dockerfile          # Docker configuration
│   └── nginx.conf          # Nginx configuration
│
├── docker-compose.yml        # Multi-container setup
├── mongo-init.js            # Database initialization
└── README.md               # Project documentation
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
- **Docker** (optional, for containerized deployment)

### Option 1: Local Development Setup

#### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd comp3123_assignment2
```

#### 2. Setup Backend
```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your configurations

# Start MongoDB locally (if not using Docker)
# Make sure MongoDB is running on localhost:27017

# Start the backend server
npm run dev
```

#### 3. Setup Frontend
```bash
# Open new terminal and navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start the React development server
npm start
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

### Option 2: Docker Deployment (Recommended)

#### 1. Using Docker Compose
```bash
# Clone and navigate to project
git clone <your-repository-url>
cd comp3123_assignment2

# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

#### 2. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

#### 3. Stop the Application
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (clears database)
docker-compose down -v
```

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

## 📸 Screenshots Needed

**👉 TO DO BY YOU**: Take screenshots of the following screens and add them to the README:

1. **Login Page** - Show the login form
2. **Signup Page** - Show the registration form
3. **Employee List** - Show the data grid with employees
4. **Add Employee** - Show the comprehensive form
5. **View Employee** - Show employee details page
6. **Edit Employee** - Show the update form
7. **Search Page** - Show search filters and results
8. **Mobile View** - Show responsive design on mobile

```markdown
## 📸 Application Screenshots

### Login Page
![Login Page](screenshots/login-page.png)

### Employee Dashboard
![Employee List](screenshots/employee-list.png)

### Add Employee Form
![Add Employee](screenshots/add-employee.png)

### Employee Profile
![View Employee](screenshots/view-employee.png)

### Search Functionality
![Search Page](screenshots/search-page.png)

### Mobile Responsive
![Mobile View](screenshots/mobile-view.png)
```

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

## 👨‍💻 Student Submission

**👉 TO DO BY YOU**: Before submitting, ensure:

1. ✅ All code is working and tested
2. ✅ Screenshots are added to README
3. ✅ Repository is pushed to GitHub
4. ✅ Application is deployed (optional)
5. ✅ Video demonstration is recorded
6. ✅ All assignment requirements are met

### Submission Checklist

- [ ] Backend API working with all endpoints
- [ ] Frontend React app working with all pages
- [ ] Authentication system functional
- [ ] Employee CRUD operations working
- [ ] File upload working
- [ ] Search functionality working
- [ ] Docker setup working
- [ ] README.md complete with screenshots
- [ ] Code pushed to GitHub repository
- [ ] Application deployed (optional)
- [ ] Video demonstration recorded

---

## 🎥 Video Demonstration

**👉 TO DO BY YOU**: Record a video demonstration showing:

1. Application overview and navigation
2. User registration and login
3. Adding a new employee with profile picture
4. Viewing employee details
5. Editing employee information
6. Searching employees by department/position
7. Deleting an employee
8. Responsive design on different screen sizes

---

**Built with ❤️ for COMP3123 - Full Stack Development**#   C O M P 3 1 2 3 - a s s i g n m e n t 2  
 