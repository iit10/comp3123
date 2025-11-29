import React, { useState, useEffect } from 'react';
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
    Chip,
    Card,
    CardContent,
    Avatar,
    CircularProgress,
    InputAdornment,
    Divider
} from '@mui/material';
import {
    Search,
    Clear,
    Person,
    Work,
    Email,
    Phone,
    FilterList,
    Visibility,
    Edit
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { employeeAPI } from '../api/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

// Department options for filter
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

const SearchEmployeePage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // State
    const [searchCriteria, setSearchCriteria] = useState({
        department: searchParams.get('department') || '',
        position: searchParams.get('position') || ''
    });
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [totalResults, setTotalResults] = useState(0);

    // Search on component mount if URL has params
    useEffect(() => {
        const dept = searchParams.get('department');
        const pos = searchParams.get('position');
        
        if (dept || pos) {
            handleSearch();
        }
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSearchCriteria(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Update URL params
    const updateURLParams = (criteria) => {
        const params = new URLSearchParams();
        if (criteria.department) params.set('department', criteria.department);
        if (criteria.position) params.set('position', criteria.position);
        setSearchParams(params);
    };

    // Handle search
    const handleSearch = async (e) => {
        if (e) e.preventDefault();

        const { department, position } = searchCriteria;

        // Validate that at least one search criteria is provided
        if (!department.trim() && !position.trim()) {
            toast.error('Please enter a department or position to search');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const searchParams = {};
            if (department.trim()) searchParams.department = department.trim();
            if (position.trim()) searchParams.position = position.trim();

            const response = await employeeAPI.searchEmployees(searchParams);
            const employees = response.data.data.employees || [];
            
            setSearchResults(employees);
            setTotalResults(response.data.data.pagination?.totalEmployees || employees.length);
            setHasSearched(true);
            
            // Update URL
            updateURLParams(searchCriteria);

            if (employees.length === 0) {
                toast.info('No employees found matching your search criteria');
            } else {
                toast.success(`Found ${employees.length} employee(s)`);
            }

        } catch (err) {
            console.error('Search failed:', err);
            setError('Search failed. Please try again.');
            toast.error('Search failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Clear search
    const handleClear = () => {
        setSearchCriteria({
            department: '',
            position: ''
        });
        setSearchResults([]);
        setHasSearched(false);
        setError(null);
        setTotalResults(0);
        setSearchParams({});
    };

    // Handle view employee
    const handleViewEmployee = (id) => {
        navigate(`/employees/view/${id}`);
    };

    // Handle edit employee
    const handleEditEmployee = (id) => {
        navigate(`/employees/edit/${id}`);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
                    Search Employees
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    Search employees by department or position
                </Typography>
            </Box>

            {/* Search Form */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <FilterList color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" component="h2">
                        Search Filters
                    </Typography>
                </Box>

                <form onSubmit={handleSearch}>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                select
                                name="department"
                                label="Department"
                                value={searchCriteria.department}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Work />
                                        </InputAdornment>
                                    )
                                }}
                            >
                                <MenuItem value="">All Departments</MenuItem>
                                {departments.map((dept) => (
                                    <MenuItem key={dept} value={dept}>
                                        {dept}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                name="position"
                                label="Position"
                                placeholder="e.g., Software Engineer, Manager"
                                value={searchCriteria.position}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Person />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Box sx={{ display: 'flex', gap: 2, height: '100%' }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={loading ? <CircularProgress size={20} /> : <Search />}
                                    disabled={loading}
                                    sx={{ flexGrow: 1 }}
                                >
                                    {loading ? 'Searching...' : 'Search'}
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<Clear />}
                                    onClick={handleClear}
                                    disabled={loading}
                                >
                                    Clear
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>

                {/* Search Summary */}
                {hasSearched && !loading && (
                    <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                            <Typography variant="body2" color="textSecondary">
                                Search criteria:
                            </Typography>
                            {searchCriteria.department && (
                                <Chip
                                    label={`Department: ${searchCriteria.department}`}
                                    color="primary"
                                    variant="outlined"
                                    size="small"
                                />
                            )}
                            {searchCriteria.position && (
                                <Chip
                                    label={`Position: ${searchCriteria.position}`}
                                    color="secondary"
                                    variant="outlined"
                                    size="small"
                                />
                            )}
                            <Chip
                                label={`${totalResults} result(s)`}
                                color="success"
                                variant="outlined"
                                size="small"
                            />
                        </Box>
                    </Box>
                )}
            </Paper>

            {/* Error Alert */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Loading */}
            {loading && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <CircularProgress size={40} />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                        Searching employees...
                    </Typography>
                </Box>
            )}

            {/* Search Results */}
            {!loading && hasSearched && (
                <Box>
                    {searchResults.length > 0 ? (
                        <>
                            <Typography variant="h6" gutterBottom>
                                Search Results ({searchResults.length})
                            </Typography>
                            <Grid container spacing={3}>
                                {searchResults.map((employee) => (
                                    <Grid item xs={12} sm={6} md={4} key={employee._id}>
                                        <Card 
                                            sx={{ 
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                transition: 'transform 0.2s, box-shadow 0.2s',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: 4
                                                }
                                            }}
                                        >
                                            <CardContent sx={{ flexGrow: 1 }}>
                                                {/* Employee Header */}
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <Avatar
                                                        sx={{ width: 50, height: 50, mr: 2 }}
                                                        src={employee.profilePictureUrl}
                                                    >
                                                        {!employee.profilePictureUrl && (
                                                            <Person />
                                                        )}
                                                    </Avatar>
                                                    <Box sx={{ flexGrow: 1 }}>
                                                        <Typography variant="h6" component="h3" noWrap>
                                                            {employee.firstName} {employee.lastName}
                                                        </Typography>
                                                        <Typography variant="body2" color="primary" noWrap>
                                                            {employee.position}
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                {/* Department Chip */}
                                                <Chip
                                                    label={employee.department}
                                                    color="primary"
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{ mb: 2 }}
                                                />

                                                {/* Employee Details */}
                                                <Box sx={{ mb: 2 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        <Email fontSize="small" color="action" sx={{ mr: 1 }} />
                                                        <Typography variant="body2" noWrap>
                                                            {employee.email}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        <Phone fontSize="small" color="action" sx={{ mr: 1 }} />
                                                        <Typography variant="body2">
                                                            {employee.phone}
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="body2" color="textSecondary">
                                                        Joined: {format(new Date(employee.dateOfJoining), 'MMM dd, yyyy')}
                                                    </Typography>
                                                </Box>

                                                {/* Salary */}
                                                <Typography variant="body1" color="success.main" fontWeight={600} sx={{ mb: 2 }}>
                                                    ${employee.salary?.toLocaleString()}
                                                </Typography>

                                                {/* Action Buttons */}
                                                <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        startIcon={<Visibility />}
                                                        onClick={() => handleViewEmployee(employee._id)}
                                                        sx={{ flexGrow: 1 }}
                                                    >
                                                        View
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        color="warning"
                                                        startIcon={<Edit />}
                                                        onClick={() => handleEditEmployee(employee._id)}
                                                        sx={{ flexGrow: 1 }}
                                                    >
                                                        Edit
                                                    </Button>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </>
                    ) : (
                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="h6" color="textSecondary" gutterBottom>
                                No employees found
                            </Typography>
                            <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
                                Try adjusting your search criteria or clear filters to see all employees.
                            </Typography>
                            <Button
                                variant="outlined"
                                startIcon={<Clear />}
                                onClick={handleClear}
                            >
                                Clear Search
                            </Button>
                        </Paper>
                    )}
                </Box>
            )}

            {/* Initial State */}
            {!loading && !hasSearched && (
                <Paper sx={{ p: 6, textAlign: 'center' }}>
                    <Search sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                        Search for employees
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        Use the filters above to search for employees by department or position.
                    </Typography>
                </Paper>
            )}
        </Container>
    );
};

export default SearchEmployeePage;