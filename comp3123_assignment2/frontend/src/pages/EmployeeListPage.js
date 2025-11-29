import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Paper,
    Button,
    Box,
    TextField,
    InputAdornment,
    CircularProgress,
    Alert,
    Chip,
    Tooltip,
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText
} from '@mui/material';
import {
    Add,
    Search,
    Refresh,
    FilterList,
    Clear
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { employeeAPI } from '../api/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const EmployeeListPage = () => {
    const navigate = useNavigate();

    // State
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    
    // Delete dialog state
    const [deleteDialog, setDeleteDialog] = useState({
        open: false,
        employee: null
    });

    // DataGrid state
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10
    });

    // Load employees
    const loadEmployees = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await employeeAPI.getEmployees({
                page: paginationModel.page + 1,
                limit: paginationModel.pageSize,
                sortBy: 'createdAt',
                sortOrder: 'desc'
            });

            const employeesData = response.data.data.employees || [];
            setEmployees(employeesData);
            setFilteredEmployees(employeesData);
            
        } catch (err) {
            console.error('Failed to load employees:', err);
            setError('Failed to load employees. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Load employees on mount
    useEffect(() => {
        loadEmployees();
    }, [paginationModel.page, paginationModel.pageSize]);

    // Filter employees based on search term
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredEmployees(employees);
        } else {
            const filtered = employees.filter(employee => 
                employee.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                employee.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                employee.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                employee.position?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredEmployees(filtered);
        }
    }, [employees, searchTerm]);

    // Handle search input
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Clear search
    const handleClearSearch = () => {
        setSearchTerm('');
    };

    // Handle refresh
    const handleRefresh = () => {
        loadEmployees();
        toast.success('Employee list refreshed');
    };

    // Handle view employee
    const handleViewEmployee = (id) => {
        navigate(`/employees/view/${id}`);
    };

    // Handle edit employee
    const handleEditEmployee = (id) => {
        navigate(`/employees/edit/${id}`);
    };

    // Handle delete confirmation
    const handleDeleteClick = (employee) => {
        setDeleteDialog({
            open: true,
            employee
        });
    };

    // Handle delete employee
    const handleDeleteEmployee = async () => {
        const { employee } = deleteDialog;
        
        try {
            await employeeAPI.deleteEmployee(employee._id);
            
            // Remove from local state
            setEmployees(prev => prev.filter(emp => emp._id !== employee._id));
            setFilteredEmployees(prev => prev.filter(emp => emp._id !== employee._id));
            
            toast.success('Employee deleted successfully');
            setDeleteDialog({ open: false, employee: null });
            
        } catch (err) {
            console.error('Failed to delete employee:', err);
            toast.error('Failed to delete employee. Please try again.');
        }
    };

    // Close delete dialog
    const handleCloseDeleteDialog = () => {
        setDeleteDialog({ open: false, employee: null });
    };

    // DataGrid columns
    const columns = [
        {
            field: 'profilePicture',
            headerName: 'Photo',
            width: 80,
            renderCell: (params) => (
                <Box
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                    }}
                >
                    {params.row.profilePictureUrl ? (
                        <img
                            src={params.row.profilePictureUrl}
                            alt={`${params.row.firstName} ${params.row.lastName}`}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                    ) : null}
                    <Typography 
                        variant="body2" 
                        sx={{ 
                            display: params.row.profilePictureUrl ? 'none' : 'flex',
                            fontWeight: 'bold',
                            color: '#666'
                        }}
                    >
                        {params.row.firstName?.[0]}{params.row.lastName?.[0]}
                    </Typography>
                </Box>
            ),
            sortable: false,
            filterable: false
        },
        {
            field: 'fullName',
            headerName: 'Full Name',
            width: 200,
            valueGetter: (params) => `${params.row.firstName} ${params.row.lastName}`,
            renderCell: (params) => (
                <Box>
                    <Typography variant="body2" fontWeight={500}>
                        {params.row.firstName} {params.row.lastName}
                    </Typography>
                </Box>
            )
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 250,
            renderCell: (params) => (
                <Typography variant="body2" color="primary">
                    {params.value}
                </Typography>
            )
        },
        {
            field: 'department',
            headerName: 'Department',
            width: 150,
            renderCell: (params) => (
                <Chip 
                    label={params.value} 
                    size="small" 
                    variant="outlined"
                    color="primary"
                />
            )
        },
        {
            field: 'position',
            headerName: 'Position',
            width: 180,
            renderCell: (params) => (
                <Typography variant="body2" fontWeight={500}>
                    {params.value}
                </Typography>
            )
        },
        {
            field: 'salary',
            headerName: 'Salary',
            width: 120,
            renderCell: (params) => (
                <Typography variant="body2" color="success.main" fontWeight={500}>
                    ${params.value?.toLocaleString()}
                </Typography>
            )
        },
        {
            field: 'dateOfJoining',
            headerName: 'Joined',
            width: 120,
            renderCell: (params) => (
                <Typography variant="body2">
                    {format(new Date(params.value), 'MMM dd, yyyy')}
                </Typography>
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={() => handleViewEmployee(params.row._id)}
                    >
                        View
                    </Button>
                    <Button
                        size="small"
                        variant="outlined"
                        color="warning"
                        onClick={() => handleEditEmployee(params.row._id)}
                    >
                        Edit
                    </Button>
                    <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteClick(params.row)}
                    >
                        Delete
                    </Button>
                </Box>
            )
        }
    ];

    if (loading) {
        return (
            <Container maxWidth="xl" sx={{ py: 4, textAlign: 'center' }}>
                <CircularProgress size={40} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Loading employees...
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
                    Employee Management
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    Manage your organization's employees
                </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Controls */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    flexWrap: 'wrap'
                }}>
                    {/* Search */}
                    <TextField
                        size="small"
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        sx={{ flexGrow: 1, minWidth: 300 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                            endAdornment: searchTerm && (
                                <InputAdornment position="end">
                                    <Tooltip title="Clear search">
                                        <Button
                                            size="small"
                                            onClick={handleClearSearch}
                                            sx={{ minWidth: 'auto', p: 0.5 }}
                                        >
                                            <Clear fontSize="small" />
                                        </Button>
                                    </Tooltip>
                                </InputAdornment>
                            )
                        }}
                    />

                    {/* Refresh Button */}
                    <Tooltip title="Refresh">
                        <Button
                            variant="outlined"
                            startIcon={<Refresh />}
                            onClick={handleRefresh}
                        >
                            Refresh
                        </Button>
                    </Tooltip>

                    {/* Add Employee Button */}
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => navigate('/employees/add')}
                    >
                        Add Employee
                    </Button>
                </Box>

                {/* Stats */}
                <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Chip 
                        label={`Total: ${employees.length}`}
                        color="primary"
                        variant="outlined"
                    />
                    {searchTerm && (
                        <Chip 
                            label={`Filtered: ${filteredEmployees.length}`}
                            color="secondary"
                            variant="outlined"
                        />
                    )}
                </Box>
            </Paper>

            {/* Data Grid */}
            <Paper sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={filteredEmployees}
                    columns={columns}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[5, 10, 25, 50]}
                    checkboxSelection={false}
                    disableRowSelectionOnClick
                    getRowId={(row) => row._id}
                    loading={loading}
                    sx={{
                        border: 0,
                        '& .MuiDataGrid-cell': {
                            borderColor: '#f0f0f0'
                        },
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: '#f8f9fa',
                            fontWeight: 600
                        }
                    }}
                />
            </Paper>

            {/* Floating Action Button for Mobile */}
            <Fab
                color="primary"
                aria-label="add employee"
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    display: { xs: 'flex', sm: 'none' }
                }}
                onClick={() => navigate('/employees/add')}
            >
                <Add />
            </Fab>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialog.open}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">
                    Confirm Delete
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Are you sure you want to delete employee{' '}
                        <strong>
                            {deleteDialog.employee?.firstName} {deleteDialog.employee?.lastName}
                        </strong>?
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleDeleteEmployee} 
                        color="error" 
                        variant="contained"
                        autoFocus
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default EmployeeListPage;