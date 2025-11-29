const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        minlength: [2, 'First name must be at least 2 characters long'],
        maxlength: [30, 'First name cannot exceed 30 characters']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        minlength: [2, 'Last name must be at least 2 characters long'],
        maxlength: [30, 'Last name cannot exceed 30 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please enter a valid email address'
        ]
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        match: [
            /^[\+]?[1-9][\d]{0,15}$/,
            'Please enter a valid phone number'
        ]
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        trim: true,
        enum: {
            values: [
                'Human Resources',
                'Engineering',
                'Marketing',
                'Sales',
                'Finance',
                'Operations',
                'Customer Service',
                'IT Support',
                'Legal',
                'Research & Development'
            ],
            message: 'Please select a valid department'
        }
    },
    position: {
        type: String,
        required: [true, 'Position is required'],
        trim: true,
        minlength: [2, 'Position must be at least 2 characters long'],
        maxlength: [50, 'Position cannot exceed 50 characters']
    },
    salary: {
        type: Number,
        required: [true, 'Salary is required'],
        min: [0, 'Salary must be a positive number'],
        max: [10000000, 'Salary cannot exceed 10,000,000']
    },
    dateOfJoining: {
        type: Date,
        required: [true, 'Date of joining is required'],
        validate: {
            validator: function(value) {
                return value <= new Date();
            },
            message: 'Date of joining cannot be in the future'
        }
    },
    profilePicture: {
        type: String,
        default: null,
        validate: {
            validator: function(value) {
                if (!value) return true;
                return /\.(jpg|jpeg|png|gif)$/i.test(value);
            },
            message: 'Profile picture must be a valid image file (jpg, jpeg, png, gif)'
        }
    },
    address: {
        street: {
            type: String,
            required: [true, 'Street address is required'],
            trim: true,
            maxlength: [100, 'Street address cannot exceed 100 characters']
        },
        city: {
            type: String,
            required: [true, 'City is required'],
            trim: true,
            maxlength: [50, 'City cannot exceed 50 characters']
        },
        province: {
            type: String,
            required: [true, 'Province is required'],
            trim: true,
            maxlength: [50, 'Province cannot exceed 50 characters']
        },
        postalCode: {
            type: String,
            required: [true, 'Postal code is required'],
            trim: true,
            match: [
                /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
                'Please enter a valid Canadian postal code (e.g., A1A 1A1)'
            ]
        }
    },
    emergencyContact: {
        name: {
            type: String,
            required: [true, 'Emergency contact name is required'],
            trim: true,
            maxlength: [50, 'Emergency contact name cannot exceed 50 characters']
        },
        relationship: {
            type: String,
            required: [true, 'Emergency contact relationship is required'],
            trim: true,
            maxlength: [30, 'Relationship cannot exceed 30 characters']
        },
        phone: {
            type: String,
            required: [true, 'Emergency contact phone is required'],
            trim: true,
            match: [
                /^[\+]?[1-9][\d]{0,15}$/,
                'Please enter a valid emergency contact phone number'
            ]
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Indexes for faster queries
employeeSchema.index({ email: 1 });
employeeSchema.index({ department: 1 });
employeeSchema.index({ position: 1 });
employeeSchema.index({ firstName: 1, lastName: 1 });
employeeSchema.index({ isActive: 1 });

// Pre-update middleware to update the updatedAt field
employeeSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function() {
    this.set({ updatedAt: Date.now() });
});

// Virtual for full name
employeeSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

// Virtual for formatted address
employeeSchema.virtual('formattedAddress').get(function() {
    return `${this.address.street}, ${this.address.city}, ${this.address.province} ${this.address.postalCode}`;
});

// Ensure virtual fields are serialized
employeeSchema.set('toJSON', { virtuals: true });
employeeSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Employee', employeeSchema);