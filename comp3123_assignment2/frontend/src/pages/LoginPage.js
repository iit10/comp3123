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
    Divider,
    Checkbox,
    FormControlLabel
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Email,
    Lock,
    LoginOutlined
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAuthenticated, isLoading, error, clearError } = useAuth();

    // Get redirect path from location state
    const from = location.state?.from?.pathname || '/employees';

    // Form state
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // UI state
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

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

        // Email validation
        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        // Password validation
        if (!formData.password) {
            errors.password = 'Password is required';
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
            const result = await login({
                email: formData.email.trim().toLowerCase(),
                password: formData.password
            });

            if (result.success) {
                navigate(from, { replace: true });
            }
        } catch (err) {
            console.error('Login error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle demo login (for testing)
    const handleDemoLogin = async () => {
        const demoCredentials = {
            email: 'admin@employee-system.com',
            password: 'Admin123!'
        };
        
        setFormData(demoCredentials);
        setIsSubmitting(true);
        
        try {
            const result = await login(demoCredentials);
            if (result.success) {
                navigate(from, { replace: true });
            }
        } catch (err) {
            console.error('Demo login error:', err);
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
                    <LoginOutlined sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                    <Typography component="h1" variant="h4" fontWeight={600} gutterBottom>
                        Welcome Back
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        Sign in to your account
                    </Typography>
                </Box>

                {/* Redirect Message */}
                {location.state?.from && (
                    <Alert severity="info" sx={{ mb: 3 }}>
                        Please log in to access that page.
                    </Alert>
                )}

                {/* Error Alert */}
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {/* Form */}
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    {/* Email Field */}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
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
                        autoComplete="current-password"
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

                    {/* Remember Me */}
                    <FormControlLabel
                        control={
                            <Checkbox 
                                value={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                color="primary"
                            />
                        }
                        label="Remember me"
                        sx={{ mt: 1 }}
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
                                Signing In...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </Button>

                    {/* Demo Login Button */}
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={handleDemoLogin}
                        disabled={isSubmitting || isLoading}
                        sx={{ mb: 3 }}
                    >
                        Try Demo Account
                    </Button>

                    {/* Divider */}
                    <Divider sx={{ my: 3 }}>
                        <Typography variant="body2" color="textSecondary">
                            Don't have an account?
                        </Typography>
                    </Divider>

                    {/* Signup Link */}
                    <Box textAlign="center">
                        <Link 
                            component={RouterLink} 
                            to="/signup" 
                            variant="body1"
                            sx={{ 
                                textDecoration: 'none',
                                fontWeight: 500,
                                '&:hover': {
                                    textDecoration: 'underline'
                                }
                            }}
                        >
                            Create new account
                        </Link>
                    </Box>
                </Box>

                {/* Footer Info */}
                <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #e0e0e0' }}>
                    <Typography variant="caption" color="textSecondary" align="center" display="block">
                        COMP3123 Assignment 2 - Employee Management System
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default LoginPage;