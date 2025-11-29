const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Employee = require('../models/Employee');
const { authenticateToken } = require('../middleware/auth');
const { upload, handleMulterError, deleteFile, getFileUrl } = require('../middleware/upload');
const path = require('path');

const router = express.Router();

/**
 * @route   POST /api/employees
 * @desc    Create a new employee with optional profile picture
 * @access  Private
 */
router.post('/', (req, res, next) => {
    console.log('=== EMPLOYEE POST ROUTE HIT ===');
    console.log('🚀 POST /api/employees route hit');
    next();
}, authenticateToken, (req, res, next) => {
    console.log('🔑 Authentication passed for:', req.user ? req.user.email : 'No user');
    next();
}, upload.single('profilePicture'), [
    // Validation rules
    body('firstName')
        .trim()
        .isLength({ min: 2, max: 30 })
        .withMessage('First name must be between 2 and 30 characters'),
    
    body('lastName')
        .trim()
        .isLength({ min: 2, max: 30 })
        .withMessage('Last name must be between 2 and 30 characters'),
    
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please enter a valid email address'),
    
    body('phone')
        .trim()
        .matches(/^[\+]?[1-9][\d]{0,15}$/)
        .withMessage('Please enter a valid phone number'),
    
    body('department')
        .notEmpty()
        .withMessage('Department is required'),
    
    body('position')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Position must be between 2 and 50 characters'),
    
    body('salary')
        .isNumeric()
        .isFloat({ min: 0, max: 10000000 })
        .withMessage('Salary must be a positive number not exceeding 10,000,000'),
    
    body('dateOfJoining')
        .isISO8601()
        .toDate()
        .withMessage('Please enter a valid date of joining'),
    
    body('address')
        .custom((value) => {
            if (!value) {
                throw new Error('Address is required');
            }
            if (typeof value === 'string') {
                try {
                    const parsed = JSON.parse(value);
                    if (!parsed.street || !parsed.city || !parsed.province || !parsed.postalCode) {
                        throw new Error('Address must contain street, city, province, and postal code');
                    }
                    // Validate Canadian postal code format
                    const postalCodeRegex = /^[A-Za-z]\d[A-Za-z][\s\-]?\d[A-Za-z]\d$/;
                    if (!postalCodeRegex.test(parsed.postalCode)) {
                        throw new Error('Please enter a valid Canadian postal code (e.g., A1A 1A1)');
                    }
                    return true;
                } catch (parseError) {
                    if (parseError.message.includes('postal code') || parseError.message.includes('Address must contain')) {
                        throw parseError;
                    }
                    throw new Error('Invalid address format');
                }
            }
            return true;
        }),
    
    body('emergencyContact')
        .custom((value) => {
            if (!value) {
                throw new Error('Emergency contact is required');
            }
            if (typeof value === 'string') {
                try {
                    const parsed = JSON.parse(value);
                    if (!parsed.name || !parsed.relationship || !parsed.phone) {
                        throw new Error('Emergency contact must contain name, relationship, and phone');
                    }
                    // Validate phone number format
                    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                    if (!phoneRegex.test(parsed.phone)) {
                        throw new Error('Please enter a valid emergency contact phone number');
                    }
                    return true;
                } catch (parseError) {
                    if (parseError.message.includes('phone') || parseError.message.includes('Emergency contact must contain')) {
                        throw parseError;
                    }
                    throw new Error('Invalid emergency contact format');
                }
            }
            return true;
        })
        
], handleMulterError, async (req, res) => {
    console.log('📥 Employee creation request received');
    console.log('👤 User:', req.user ? req.user.email : 'No user');
    console.log('📁 File:', req.file ? req.file.filename : 'No file');
    console.log('📄 Body keys:', Object.keys(req.body));
    console.log('📦 Full body:', req.body);
    console.log('🗂️ Address type:', typeof req.body.address);
    console.log('📞 EmergencyContact type:', typeof req.body.emergencyContact);
    
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('🚨 Validation errors:', JSON.stringify(errors.array(), null, 2));
            console.log('📋 Request body:', JSON.stringify(req.body, null, 2));
            
            // Delete uploaded file if validation fails
            if (req.file) {
                deleteFile(req.file.path);
            }
            
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array().map(error => ({
                    field: error.path,
                    message: error.msg
                }))
            });
        }

        const employeeData = {
            ...req.body,
            createdBy: req.user._id,
            updatedBy: req.user._id
        };

        // Add profile picture URL if file was uploaded
        if (req.file) {
            employeeData.profilePicture = req.file.filename;
        }

        // Parse nested objects if they come as strings
        if (typeof req.body.address === 'string') {
            employeeData.address = JSON.parse(req.body.address);
        }
        if (typeof req.body.emergencyContact === 'string') {
            employeeData.emergencyContact = JSON.parse(req.body.emergencyContact);
        }

        // Check if employee with this email already exists
        const existingEmployee = await Employee.findOne({ 
            email: employeeData.email.toLowerCase() 
        });
        
        if (existingEmployee) {
            // Delete uploaded file if employee already exists
            if (req.file) {
                deleteFile(req.file.path);
            }
            
            return res.status(400).json({
                success: false,
                message: 'Employee with this email already exists'
            });
        }

        // Validate date of joining is not in future
        const joinDate = new Date(employeeData.dateOfJoining);
        if (joinDate > new Date()) {
            if (req.file) {
                deleteFile(req.file.path);
            }
            
            return res.status(400).json({
                success: false,
                message: 'Date of joining cannot be in the future'
            });
        }

        const employee = new Employee(employeeData);
        await employee.save();

        // Populate the response with created user info
        await employee.populate('createdBy', 'name email');

        // Add full profile picture URL to response
        const responseEmployee = employee.toObject();
        if (responseEmployee.profilePicture) {
            responseEmployee.profilePictureUrl = getFileUrl(req, responseEmployee.profilePicture);
        }

        res.status(201).json({
            success: true,
            message: 'Employee created successfully',
            data: {
                employee: responseEmployee
            }
        });

    } catch (error) {
        // Delete uploaded file on error
        if (req.file) {
            deleteFile(req.file.path);
        }
        
        console.error('Create employee error:', error);
        
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Employee with this email already exists'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Failed to create employee. Please try again.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * @route   GET /api/employees
 * @desc    Get all employees with pagination and sorting
 * @access  Private
 */
router.get('/', authenticateToken, [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    
    query('sortBy')
        .optional()
        .isIn(['firstName', 'lastName', 'email', 'department', 'position', 'salary', 'dateOfJoining', 'createdAt'])
        .withMessage('Invalid sort field'),
    
    query('sortOrder')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Sort order must be asc or desc')
], async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Invalid query parameters',
                errors: errors.array().map(error => ({
                    field: error.path,
                    message: error.msg
                }))
            });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        const skip = (page - 1) * limit;

        // Build filter for active employees only
        const filter = { isActive: true };

        // Get total count for pagination
        const totalEmployees = await Employee.countDocuments(filter);
        const totalPages = Math.ceil(totalEmployees / limit);

        // Get employees with pagination and sorting
        const employees = await Employee.find(filter)
            .populate('createdBy', 'name email')
            .populate('updatedBy', 'name email')
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit)
            .lean(); // Use lean() for better performance

        // Add profile picture URLs
        const employeesWithUrls = employees.map(employee => {
            if (employee.profilePicture) {
                employee.profilePictureUrl = getFileUrl(req, employee.profilePicture);
            }
            return employee;
        });

        res.json({
            success: true,
            message: 'Employees retrieved successfully',
            data: {
                employees: employeesWithUrls,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalEmployees,
                    limit,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            }
        });

    } catch (error) {
        console.error('Get employees error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve employees',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * @route   GET /api/employees/search
 * @desc    Search employees by department or position
 * @access  Private
 */
router.get('/search', authenticateToken, [
    query('department')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Department cannot be empty'),
    
    query('position')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Position cannot be empty'),
    
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100')
], async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Invalid search parameters',
                errors: errors.array().map(error => ({
                    field: error.path,
                    message: error.msg
                }))
            });
        }

        const { department, position } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Validate that at least one search parameter is provided
        if (!department && !position) {
            return res.status(400).json({
                success: false,
                message: 'Please provide department or position to search'
            });
        }

        // Build search filter
        const filter = { isActive: true };
        
        if (department && position) {
            // Search by both department and position
            filter.$and = [
                { department: { $regex: department.trim(), $options: 'i' } },
                { position: { $regex: position.trim(), $options: 'i' } }
            ];
        } else if (department) {
            // Search by department only
            filter.department = { $regex: department.trim(), $options: 'i' };
        } else if (position) {
            // Search by position only
            filter.position = { $regex: position.trim(), $options: 'i' };
        }

        // Get total count for pagination
        const totalEmployees = await Employee.countDocuments(filter);
        const totalPages = Math.ceil(totalEmployees / limit);

        // Search employees
        const employees = await Employee.find(filter)
            .populate('createdBy', 'name email')
            .populate('updatedBy', 'name email')
            .sort({ firstName: 1, lastName: 1 })
            .skip(skip)
            .limit(limit)
            .lean();

        // Add profile picture URLs
        const employeesWithUrls = employees.map(employee => {
            if (employee.profilePicture) {
                employee.profilePictureUrl = getFileUrl(req, employee.profilePicture);
            }
            return employee;
        });

        res.json({
            success: true,
            message: `Found ${totalEmployees} employee(s) matching search criteria`,
            data: {
                employees: employeesWithUrls,
                searchCriteria: {
                    department: department || null,
                    position: position || null
                },
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalEmployees,
                    limit,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            }
        });

    } catch (error) {
        console.error('Search employees error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search employees',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * @route   GET /api/employees/:id
 * @desc    Get single employee by ID
 * @access  Private
 */
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid employee ID format'
            });
        }

        const employee = await Employee.findOne({ _id: id, isActive: true })
            .populate('createdBy', 'name email')
            .populate('updatedBy', 'name email');

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        // Add profile picture URL
        const employeeData = employee.toObject();
        if (employeeData.profilePicture) {
            employeeData.profilePictureUrl = getFileUrl(req, employeeData.profilePicture);
        }

        res.json({
            success: true,
            message: 'Employee retrieved successfully',
            data: {
                employee: employeeData
            }
        });

    } catch (error) {
        console.error('Get employee error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve employee',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * @route   PUT /api/employees/:id
 * @desc    Update employee with optional profile picture
 * @access  Private
 */
router.put('/:id', authenticateToken, upload.single('profilePicture'), [
    // Validation rules (similar to POST but optional)
    body('firstName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 30 })
        .withMessage('First name must be between 2 and 30 characters'),
    
    body('lastName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 30 })
        .withMessage('Last name must be between 2 and 30 characters'),
    
    body('email')
        .optional()
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please enter a valid email address'),
    
    body('phone')
        .optional()
        .trim()
        .matches(/^[\+]?[1-9][\d]{0,15}$/)
        .withMessage('Please enter a valid phone number'),
    
    body('position')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Position must be between 2 and 50 characters'),
    
    body('salary')
        .optional()
        .isNumeric()
        .isFloat({ min: 0, max: 10000000 })
        .withMessage('Salary must be a positive number not exceeding 10,000,000'),
    
    body('dateOfJoining')
        .optional()
        .isISO8601()
        .toDate()
        .withMessage('Please enter a valid date of joining')
        
], handleMulterError, async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Delete uploaded file if validation fails
            if (req.file) {
                deleteFile(req.file.path);
            }
            
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array().map(error => ({
                    field: error.path,
                    message: error.msg
                }))
            });
        }

        const { id } = req.params;

        // Validate ObjectId format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            if (req.file) {
                deleteFile(req.file.path);
            }
            return res.status(400).json({
                success: false,
                message: 'Invalid employee ID format'
            });
        }

        // Get current employee
        const currentEmployee = await Employee.findOne({ _id: id, isActive: true });
        
        if (!currentEmployee) {
            if (req.file) {
                deleteFile(req.file.path);
            }
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        const updateData = {
            ...req.body,
            updatedBy: req.user._id,
            updatedAt: new Date()
        };

        // Parse nested objects if they come as strings
        if (typeof req.body.address === 'string') {
            updateData.address = JSON.parse(req.body.address);
        }
        if (typeof req.body.emergencyContact === 'string') {
            updateData.emergencyContact = JSON.parse(req.body.emergencyContact);
        }

        // Handle profile picture update
        if (req.file) {
            // Delete old profile picture if exists
            if (currentEmployee.profilePicture) {
                const oldImagePath = path.join(__dirname, '../uploads', currentEmployee.profilePicture);
                deleteFile(oldImagePath);
            }
            updateData.profilePicture = req.file.filename;
        }

        // Check if email is being changed and if it conflicts
        if (updateData.email && updateData.email !== currentEmployee.email) {
            const emailExists = await Employee.findOne({ 
                email: updateData.email.toLowerCase(),
                _id: { $ne: id }
            });
            
            if (emailExists) {
                if (req.file) {
                    deleteFile(req.file.path);
                }
                return res.status(400).json({
                    success: false,
                    message: 'Another employee with this email already exists'
                });
            }
        }

        // Validate date of joining is not in future
        if (updateData.dateOfJoining) {
            const joinDate = new Date(updateData.dateOfJoining);
            if (joinDate > new Date()) {
                if (req.file) {
                    deleteFile(req.file.path);
                }
                return res.status(400).json({
                    success: false,
                    message: 'Date of joining cannot be in the future'
                });
            }
        }

        // Update employee
        const updatedEmployee = await Employee.findByIdAndUpdate(
            id,
            updateData,
            { 
                new: true, 
                runValidators: true 
            }
        ).populate('createdBy', 'name email')
         .populate('updatedBy', 'name email');

        // Add profile picture URL
        const employeeData = updatedEmployee.toObject();
        if (employeeData.profilePicture) {
            employeeData.profilePictureUrl = getFileUrl(req, employeeData.profilePicture);
        }

        res.json({
            success: true,
            message: 'Employee updated successfully',
            data: {
                employee: employeeData
            }
        });

    } catch (error) {
        // Delete uploaded file on error
        if (req.file) {
            deleteFile(req.file.path);
        }
        
        console.error('Update employee error:', error);
        
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Employee with this email already exists'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Failed to update employee. Please try again.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * @route   DELETE /api/employees/:id
 * @desc    Delete employee (soft delete)
 * @access  Private
 */
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid employee ID format'
            });
        }

        const employee = await Employee.findOne({ _id: id, isActive: true });
        
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        // Soft delete - set isActive to false
        await Employee.findByIdAndUpdate(id, {
            isActive: false,
            updatedBy: req.user._id,
            updatedAt: new Date()
        });

        // Note: We're keeping the profile picture file as it might be needed for audit purposes
        // In a production environment, you might want to implement a cleanup job

        res.json({
            success: true,
            message: 'Employee deleted successfully',
            data: {
                deletedEmployeeId: id
            }
        });

    } catch (error) {
        console.error('Delete employee error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete employee',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;