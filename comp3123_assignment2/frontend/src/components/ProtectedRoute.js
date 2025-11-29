import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    Box, 
    CircularProgress, 
    Typography, 
    Container 
} from '@mui/material';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    // Show loading spinner while checking authentication
    if (isLoading) {
        return (
            <Container maxWidth="sm" sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center', 
                minHeight: '100vh',
                gap: 2
            }}>
                <CircularProgress size={40} />
                <Typography variant="body1" color="textSecondary">
                    Checking authentication...
                </Typography>
            </Container>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return (
            <Navigate 
                to="/login" 
                state={{ from: location }} 
                replace 
            />
        );
    }

    // Render protected content if authenticated
    return children;
};

export default ProtectedRoute;