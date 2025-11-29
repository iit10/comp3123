import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Paper,
    Box,
    Grid,
    Avatar,
    Chip,
    Button,
    CircularProgress,
    Alert,
    Divider,
    Card,
    CardContent
} from '@mui/material';
import {
    ArrowBack,
    Edit,
    Delete,
    Person,
    Email,
    Phone,
    Work,
    Home,
    ContactEmergency,
    CalendarToday,
    AttachMoney
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { employeeAPI } from '../api/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const ViewEmployeePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // State
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load employee data
    useEffect(() => {
        const loadEmployee = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await employeeAPI.getEmployee(id);
                setEmployee(response.data.data.employee);
                
            } catch (err) {
                console.error('Failed to load employee:', err);
                setError('Failed to load employee details. Please try again.');
                toast.error('Employee not found');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadEmployee();
        }
    }, [id]);

    // Handle edit
    const handleEdit = () => {
        navigate(`/employees/edit/${id}`);
    };

    // Handle delete
    const handleDelete = async () => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete ${employee.firstName} ${employee.lastName}? This action cannot be undone.`
        );

        if (confirmDelete) {
            try {
                await employeeAPI.deleteEmployee(id);
                toast.success('Employee deleted successfully');
                navigate('/employees');
            } catch (err) {
                console.error('Failed to delete employee:', err);
                toast.error('Failed to delete employee. Please try again.');
            }
        }
    };

    // Handle back
    const handleBack = () => {
        navigate('/employees');
    };

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
                <CircularProgress size={40} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Loading employee details...
                </Typography>
            </Container>
        );
    }

    if (error || !employee) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="error">
                    {error || 'Employee not found'}
                </Alert>
                <Button 
                    startIcon={<ArrowBack />} 
                    onClick={handleBack}
                    sx={{ mt: 2 }}
                >
                    Back to Employee List
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                    variant="outlined"
                >
                    Back
                </Button>
                <Typography variant="h4" component="h1" fontWeight={600} sx={{ flexGrow: 1 }}>
                    Employee Details
                </Typography>
                <Button
                    startIcon={<Edit />}
                    onClick={handleEdit}
                    variant="contained"
                    color="primary"
                >
                    Edit
                </Button>
                <Button
                    startIcon={<Delete />}
                    onClick={handleDelete}
                    variant="outlined"
                    color="error"
                >
                    Delete
                </Button>
            </Box>

            {/* Profile Section */}
            <Paper sx={{ p: 4, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3, flexWrap: 'wrap' }}>
                    <Avatar
                        sx={{ width: 120, height: 120 }}
                        src={employee.profilePictureUrl}
                    >
                        {!employee.profilePictureUrl && (
                            <Person sx={{ fontSize: 60 }} />
                        )}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h4" component="h2" gutterBottom>
                            {employee.firstName} {employee.lastName}
                        </Typography>
                        <Typography variant="h6" color="primary" gutterBottom>
                            {employee.position}
                        </Typography>
                        <Chip 
                            label={employee.department} 
                            color="primary" 
                            variant="outlined"
                            sx={{ mb: 1 }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                            <Email fontSize="small" color="action" />
                            <Typography variant="body1" color="primary">
                                {employee.email}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Paper>

            {/* Information Cards */}
            <Grid container spacing={3}>
                {/* Basic Information */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Person color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6" component="h3">
                                    Basic Information
                                </Typography>
                            </Box>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="textSecondary">
                                        First Name
                                    </Typography>
                                    <Typography variant="body1" fontWeight={500}>
                                        {employee.firstName}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="textSecondary">
                                        Last Name
                                    </Typography>
                                    <Typography variant="body1" fontWeight={500}>
                                        {employee.lastName}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body2" color="textSecondary">
                                        Email
                                    </Typography>
                                    <Typography variant="body1" fontWeight={500} color="primary">
                                        {employee.email}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Phone fontSize="small" color="action" />
                                        <Box>
                                            <Typography variant="body2" color="textSecondary">
                                                Phone
                                            </Typography>
                                            <Typography variant="body1" fontWeight={500}>
                                                {employee.phone}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Work Information */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Work color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6" component="h3">
                                    Work Information
                                </Typography>
                            </Box>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="body2" color="textSecondary">
                                        Department
                                    </Typography>
                                    <Chip 
                                        label={employee.department} 
                                        color="primary" 
                                        variant="outlined"
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body2" color="textSecondary">
                                        Position
                                    </Typography>
                                    <Typography variant="body1" fontWeight={500}>
                                        {employee.position}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <AttachMoney fontSize="small" color="success" />
                                        <Box>
                                            <Typography variant="body2" color="textSecondary">
                                                Salary
                                            </Typography>
                                            <Typography variant="body1" fontWeight={500} color="success.main">
                                                ${employee.salary?.toLocaleString()}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CalendarToday fontSize="small" color="action" />
                                        <Box>
                                            <Typography variant="body2" color="textSecondary">
                                                Date Joined
                                            </Typography>
                                            <Typography variant="body1" fontWeight={500}>
                                                {format(new Date(employee.dateOfJoining), 'MMM dd, yyyy')}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Address Information */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Home color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6" component="h3">
                                    Address
                                </Typography>
                            </Box>
                            <Typography variant="body1" fontWeight={500}>
                                {employee.address?.street}
                            </Typography>
                            <Typography variant="body1">
                                {employee.address?.city}, {employee.address?.province}
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                                {employee.address?.postalCode}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Emergency Contact */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <ContactEmergency color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6" component="h3">
                                    Emergency Contact
                                </Typography>
                            </Box>
                            <Typography variant="body1" fontWeight={500}>
                                {employee.emergencyContact?.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                {employee.emergencyContact?.relationship}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Phone fontSize="small" color="action" />
                                <Typography variant="body1">
                                    {employee.emergencyContact?.phone}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Metadata Section */}
            <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Record Information
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="textSecondary">
                            Created
                        </Typography>
                        <Typography variant="body1">
                            {format(new Date(employee.createdAt), 'MMM dd, yyyy - hh:mm a')}
                        </Typography>
                        {employee.createdBy && (
                            <Typography variant="body2" color="textSecondary">
                                by {employee.createdBy.name}
                            </Typography>
                        )}
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="body2" color="textSecondary">
                            Last Updated
                        </Typography>
                        <Typography variant="body1">
                            {format(new Date(employee.updatedAt), 'MMM dd, yyyy - hh:mm a')}
                        </Typography>
                        {employee.updatedBy && (
                            <Typography variant="body2" color="textSecondary">
                                by {employee.updatedBy.name}
                            </Typography>
                        )}
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default ViewEmployeePage;