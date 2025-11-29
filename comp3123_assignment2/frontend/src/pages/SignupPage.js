import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Link,
    Alert,
    InputAdornment,
    IconButton,
    CircularProgress,
    Divider
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Person,
    Email,
    Lock,
    AccountCircle
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {
    const navigate = useNavigate();
    const { signup, isAuthenticated, isLoading, error, clearError } = useAuth();

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    // UI state
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/employees', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    // Clear error when component mounts
    useEffect(() => {
        clearError();
    }, [clearError]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear field-specific error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Validate form
    const validateForm = () => {
        const errors = {};

        // Name validation
        if (!formData.name.trim()) {
            errors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            errors.name = 'Name must be at least 2 characters long';
        } else if (formData.name.trim().length > 50) {
            errors.name = 'Name cannot exceed 50 characters';
        }

        // Email validation
        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        // Password validation
        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters long';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            errors.password = 'Password must contain at least one lowercase letter, one uppercase letter, and one number';
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            errors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        clearError();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await signup({
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
                confirmPassword: formData.confirmPassword
            });

            if (result.success) {
                navigate('/employees', { replace: true });
            }
        } catch (err) {
            console.error('Signup error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container 
            component="main" 
            maxWidth="sm"
            sx={{ 
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 4
            }}
        >
            <Paper 
                elevation={8} 
                sx={{ 
                    padding: 4,
                    width: '100%',
                    borderRadius: 2
                }}
            >
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <AccountCircle sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                    <Typography component="h1" variant="h4" fontWeight={600} gutterBottom>
                        Create Account
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        Join the Employee Management System
                    </Typography>
                </Box>

                {/* Error Alert */}
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {/* Form */}
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    {/* Name Field */}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Full Name"
                        name="name"
                        autoComplete="name"
                        autoFocus
                        value={formData.name}
                        onChange={handleChange}
                        error={!!formErrors.name}
                        helperText={formErrors.name}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Person color={formErrors.name ? 'error' : 'action'} />
                                </InputAdornment>
                            )
                        }}
                    />

                    {/* Email Field */}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!formErrors.email}
                        helperText={formErrors.email}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Email color={formErrors.email ? 'error' : 'action'} />
                                </InputAdornment>
                            )
                        }}
                    />

                    {/* Password Field */}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={handleChange}
                        error={!!formErrors.password}
                        helperText={formErrors.password}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock color={formErrors.password ? 'error' : 'action'} />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />

                    {/* Confirm Password Field */}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        autoComplete="new-password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={!!formErrors.confirmPassword}
                        helperText={formErrors.confirmPassword}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock color={formErrors.confirmPassword ? 'error' : 'action'} />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle confirm password visibility"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        edge="end"
                                    >
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1.1rem' }}
                        disabled={isSubmitting || isLoading}
                    >
                        {isSubmitting || isLoading ? (
                            <>
                                <CircularProgress size={20} sx={{ mr: 1 }} />
                                Creating Account...
                            </>
                        ) : (
                            'Create Account'
                        )}
                    </Button>

                    {/* Divider */}
                    <Divider sx={{ my: 3 }}>
                        <Typography variant="body2" color="textSecondary">
                            Already have an account?
                        </Typography>
                    </Divider>

                    {/* Login Link */}
                    <Box textAlign="center">
                        <Link 
                            component={RouterLink} 
                            to="/login" 
                            variant="body1"
                            sx={{ 
                                textDecoration: 'none',
                                fontWeight: 500,
                                '&:hover': {
                                    textDecoration: 'underline'
                                }
                            }}
                        >
                            Sign in to your account
                        </Link>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default SignupPage;