import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    timeout: 30000, // 30 seconds
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || 'An error occurred';
        
        // Handle specific error codes
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Only redirect if not already on login/signup page
            if (!window.location.pathname.includes('/login') && 
                !window.location.pathname.includes('/signup')) {
                window.location.href = '/login';
            }
        }
        
        // Don't show toast for certain endpoints or during login/signup
        const skipToast = error.config?.skipToast || 
                         window.location.pathname.includes('/login') ||
                         window.location.pathname.includes('/signup');
        
        if (!skipToast) {
            toast.error(message);
        }
        
        return Promise.reject(error);
    }
);

// Authentication API
export const authAPI = {
    // Sign up new user
    signup: (userData) => api.post('/auth/signup', userData),
    
    // Login user
    login: (credentials) => api.post('/auth/login', credentials),
    
    // Get user profile
    getProfile: () => api.get('/auth/profile'),
    
    // Verify token
    verifyToken: () => api.post('/auth/verify-token'),
    
    // Logout (client-side)
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return Promise.resolve();
    }
};

// Employee API
export const employeeAPI = {
    // Get all employees with pagination
    getEmployees: (params = {}) => {
        const queryParams = new URLSearchParams();
        
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        if (params.sortBy) queryParams.append('sortBy', params.sortBy);
        if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
        
        return api.get(`/employees?${queryParams}`);
    },
    
    // Get single employee by ID
    getEmployee: (id) => api.get(`/employees/${id}`),
    
    // Create new employee
    createEmployee: (employeeData) => {
        const formData = new FormData();
        
        // Add all employee data to FormData
        Object.keys(employeeData).forEach(key => {
            if (key === 'address' || key === 'emergencyContact') {
                formData.append(key, JSON.stringify(employeeData[key]));
            } else if (key === 'profilePicture' && employeeData[key]) {
                formData.append('profilePicture', employeeData[key]);
            } else if (employeeData[key] !== null && employeeData[key] !== undefined) {
                formData.append(key, employeeData[key]);
            }
        });
        
        return api.post('/employees', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    
    // Update employee
    updateEmployee: (id, employeeData) => {
        const formData = new FormData();
        
        // Add all employee data to FormData
        Object.keys(employeeData).forEach(key => {
            if (key === 'address' || key === 'emergencyContact') {
                formData.append(key, JSON.stringify(employeeData[key]));
            } else if (key === 'profilePicture' && employeeData[key]) {
                formData.append('profilePicture', employeeData[key]);
            } else if (employeeData[key] !== null && employeeData[key] !== undefined) {
                formData.append(key, employeeData[key]);
            }
        });
        
        return api.put(`/employees/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    
    // Delete employee
    deleteEmployee: (id) => api.delete(`/employees/${id}`),
    
    // Search employees
    searchEmployees: (params = {}) => {
        const queryParams = new URLSearchParams();
        
        if (params.department) queryParams.append('department', params.department);
        if (params.position) queryParams.append('position', params.position);
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        
        return api.get(`/employees/search?${queryParams}`);
    }
};

// Utility functions
export const apiUtils = {
    // Check if user is authenticated
    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        return !!token;
    },
    
    // Get stored user data
    getUser: () => {
        try {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    },
    
    // Store user data
    setUser: (userData) => {
        try {
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
            console.error('Error storing user data:', error);
        }
    },
    
    // Get auth token
    getToken: () => localStorage.getItem('token'),
    
    // Store auth token
    setToken: (token) => localStorage.setItem('token', token),
    
    // Clear all auth data
    clearAuth: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

export default api;