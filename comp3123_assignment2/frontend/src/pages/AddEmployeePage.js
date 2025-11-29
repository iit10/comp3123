import React, { useState } from 'react';
import {
    Container,
    Typography,
    Paper,
    TextField,
    Button,
    Box,
    Grid,
    MenuItem,
    Alert,
    Divider,
    Card,
    CardContent,
    Avatar,
    CircularProgress
} from '@mui/material';
import {
    ArrowBack,
    Save,
    CloudUpload,
    Person
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { employeeAPI } from '../api/api';
import toast from 'react-hot-toast';

// Department options
const departments = [
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
];

// Canadian provinces
const provinces = [
    'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
    'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia',
    'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Yukon'
];

const AddEmployeePage = () => {
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        department: '',
        position: '',
        salary: '',
        dateOfJoining: '',
        address: {
            street: '',
            city: '',
            province: '',
            postalCode: ''
        },
        emergencyContact: {
            name: '',
            relationship: '',
            phone: ''
        }
    });

    // File and UI state
    const [profilePicture, setProfilePicture] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Clear field-specific error
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Handle file upload
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        
        if (file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                toast.error('Please select a valid image file (JPG, PNG, GIF, or WebP)');
                return;
            }

            // Validate file size (5MB)
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                toast.error('File size must be less than 5MB');
                return;
            }

            setProfilePicture(file);
            
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Remove profile picture
    const handleRemovePicture = () => {
        setProfilePicture(null);
        setPreviewUrl(null);
    };

    // Validate form
    const validateForm = () => {
        const errors = {};

        // Basic info validation
        if (!formData.firstName.trim()) errors.firstName = 'First name is required';
        if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }
        if (!formData.phone.trim()) {
            errors.phone = 'Phone number is required';
        } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone)) {
            errors.phone = 'Please enter a valid phone number (digits only, optional +)';
        }
        if (!formData.department) errors.department = 'Department is required';
        if (!formData.position.trim()) errors.position = 'Position is required';
        if (!formData.salary) {
            errors.salary = 'Salary is required';
        } else if (isNaN(formData.salary) || Number(formData.salary) <= 0) {
            errors.salary = 'Please enter a valid salary amount';
        }
        if (!formData.dateOfJoining) {
            errors.dateOfJoining = 'Date of joining is required';
        } else if (new Date(formData.dateOfJoining) > new Date()) {
            errors.dateOfJoining = 'Date of joining cannot be in the future';
        }

        // Address validation
        if (!formData.address.street.trim()) errors['address.street'] = 'Street address is required';
        if (!formData.address.city.trim()) errors['address.city'] = 'City is required';
        if (!formData.address.province) errors['address.province'] = 'Province is required';
        if (!formData.address.postalCode.trim()) {
            errors['address.postalCode'] = 'Postal code is required';
        } else if (!/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(formData.address.postalCode)) {
            errors['address.postalCode'] = 'Please enter a valid Canadian postal code (e.g., A1A 1A1)';
        }

        // Emergency contact validation
        if (!formData.emergencyContact.name.trim()) errors['emergencyContact.name'] = 'Emergency contact name is required';
        if (!formData.emergencyContact.relationship.trim()) errors['emergencyContact.relationship'] = 'Relationship is required';
        if (!formData.emergencyContact.phone.trim()) {
            errors['emergencyContact.phone'] = 'Emergency contact phone is required';
        } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.emergencyContact.phone)) {
            errors['emergencyContact.phone'] = 'Please enter a valid phone number (digits only, optional +)';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError(null);

        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        setIsSubmitting(true);

        try {
            const employeeData = {
                ...formData,
                profilePicture
            };

            const response = await employeeAPI.createEmployee(employeeData);
            
            toast.success('Employee created successfully!');
            navigate('/employees');
            
        } catch (err) {
            console.error('Failed to create employee:', err);
            console.error('Error response:', err.response);
            console.error('Error data:', err.response?.data);
            const errorMessage = err.response?.data?.message || 'Failed to create employee. Please try again.';
            setSubmitError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle back navigation
    const handleBack = () => {
        navigate('/employees');
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                    variant="outlined"
                >
                    Back
                </Button>
                <Typography variant="h4" component="h1" fontWeight={600}>
                    Add New Employee
                </Typography>
            </Box>

            {/* Error Alert */}
            {submitError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {submitError}
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                {/* Profile Picture Section */}
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Profile Picture
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Avatar
                            sx={{ width: 120, height: 120 }}
                            src={previewUrl}
                        >
                            {!previewUrl && <Person sx={{ fontSize: 60 }} />}
                        </Avatar>
                        <Box>
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="profile-picture-upload"
                                type="file"
                                onChange={handleFileChange}
                            />
                            <label htmlFor="profile-picture-upload">
                                <Button
                                    variant="outlined"
                                    component="span"
                                    startIcon={<CloudUpload />}
                                    sx={{ mr: 2 }}
                                >
                                    Upload Picture
                                </Button>
                            </label>
                            {previewUrl && (
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={handleRemovePicture}
                                >
                                    Remove
                                </Button>
                            )}
                            <Typography variant="caption" display="block" color="textSecondary" sx={{ mt: 1 }}>
                                Accepted formats: JPG, PNG, GIF, WebP. Max size: 5MB
                            </Typography>
                        </Box>
                    </Box>
                </Paper>

                {/* Basic Information */}
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Basic Information
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                name="firstName"
                                label="First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                                error={!!formErrors.firstName}
                                helperText={formErrors.firstName}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                name="lastName"
                                label="Last Name"
                                value={formData.lastName}
                                onChange={handleChange}
                                error={!!formErrors.lastName}
                                helperText={formErrors.lastName}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                name="email"
                                label="Email Address"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={!!formErrors.email}
                                helperText={formErrors.email}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                name="phone"
                                label="Phone Number"
                                value={formData.phone}
                                onChange={handleChange}
                                error={!!formErrors.phone}
                                helperText={formErrors.phone}
                            />
                        </Grid>
                    </Grid>
                </Paper>

                {/* Work Information */}
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Work Information
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                select
                                name="department"
                                label="Department"
                                value={formData.department}
                                onChange={handleChange}
                                error={!!formErrors.department}
                                helperText={formErrors.department}
                            >
                                {departments.map((dept) => (
                                    <MenuItem key={dept} value={dept}>
                                        {dept}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                name="position"
                                label="Position"
                                value={formData.position}
                                onChange={handleChange}
                                error={!!formErrors.position}
                                helperText={formErrors.position}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                name="salary"
                                label="Salary"
                                type="number"
                                value={formData.salary}
                                onChange={handleChange}
                                error={!!formErrors.salary}
                                helperText={formErrors.salary}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                name="dateOfJoining"
                                label="Date of Joining"
                                type="date"
                                value={formData.dateOfJoining}
                                onChange={handleChange}
                                error={!!formErrors.dateOfJoining}
                                helperText={formErrors.dateOfJoining}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                    </Grid>
                </Paper>

                {/* Address Information */}
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Address Information
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="address.street"
                                label="Street Address"
                                value={formData.address.street}
                                onChange={handleChange}
                                error={!!formErrors['address.street']}
                                helperText={formErrors['address.street']}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                name="address.city"
                                label="City"
                                value={formData.address.city}
                                onChange={handleChange}
                                error={!!formErrors['address.city']}
                                helperText={formErrors['address.city']}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                select
                                name="address.province"
                                label="Province"
                                value={formData.address.province}
                                onChange={handleChange}
                                error={!!formErrors['address.province']}
                                helperText={formErrors['address.province']}
                            >
                                {provinces.map((province) => (
                                    <MenuItem key={province} value={province}>
                                        {province}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                name="address.postalCode"
                                label="Postal Code"
                                value={formData.address.postalCode}
                                onChange={handleChange}
                                error={!!formErrors['address.postalCode']}
                                helperText={formErrors['address.postalCode']}
                                placeholder="A1A 1A1"
                            />
                        </Grid>
                    </Grid>
                </Paper>

                {/* Emergency Contact */}
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Emergency Contact
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                name="emergencyContact.name"
                                label="Contact Name"
                                value={formData.emergencyContact.name}
                                onChange={handleChange}
                                error={!!formErrors['emergencyContact.name']}
                                helperText={formErrors['emergencyContact.name']}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                name="emergencyContact.relationship"
                                label="Relationship"
                                value={formData.emergencyContact.relationship}
                                onChange={handleChange}
                                error={!!formErrors['emergencyContact.relationship']}
                                helperText={formErrors['emergencyContact.relationship']}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                name="emergencyContact.phone"
                                label="Contact Phone"
                                value={formData.emergencyContact.phone}
                                onChange={handleChange}
                                error={!!formErrors['emergencyContact.phone']}
                                helperText={formErrors['emergencyContact.phone']}
                            />
                        </Grid>
                    </Grid>
                </Paper>

                {/* Submit Buttons */}
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                        variant="outlined"
                        onClick={handleBack}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={isSubmitting ? <CircularProgress size={20} /> : <Save />}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creating...' : 'Create Employee'}
                    </Button>
                </Box>
            </form>
        </Container>
    );
};

export default AddEmployeePage;