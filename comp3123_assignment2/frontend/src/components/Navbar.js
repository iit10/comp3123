import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Avatar,
    IconButton,
    Menu,
    MenuItem,
    Divider,
    ListItemIcon,
    ListItemText,
    Chip
} from '@mui/material';
import {
    AccountCircle,
    Logout,
    Dashboard,
    Person
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        handleClose();
        await logout();
        navigate('/login');
    };

    const handleProfile = () => {
        handleClose();
        // Navigate to profile page when implemented
        console.log('Profile clicked');
    };

    const handleDashboard = () => {
        handleClose();
        navigate('/employees');
    };

    return (
        <AppBar position="static" elevation={2} sx={{ backgroundColor: '#1976d2' }}>
            <Toolbar>
                {/* Logo/Brand */}
                <Typography 
                    variant="h6" 
                    component="div" 
                    sx={{ 
                        flexGrow: 1,
                        fontWeight: 600,
                        cursor: 'pointer'
                    }}
                    onClick={handleDashboard}
                >
                    Employee Management System
                </Typography>

                {/* Navigation Links */}
                <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
                    <Button 
                        color="inherit" 
                        onClick={() => navigate('/employees')}
                        startIcon={<Dashboard />}
                    >
                        Dashboard
                    </Button>
                    <Button 
                        color="inherit" 
                        onClick={() => navigate('/employees/add')}
                        startIcon={<Person />}
                    >
                        Add Employee
                    </Button>
                </Box>

                {/* User Profile Section */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
                    {/* User Role Chip */}
                    <Chip 
                        label={user?.role?.toUpperCase() || 'USER'} 
                        size="small" 
                        variant="outlined"
                        sx={{ 
                            color: 'white', 
                            borderColor: 'rgba(255, 255, 255, 0.5)',
                            display: { xs: 'none', sm: 'flex' }
                        }} 
                    />

                    {/* User Avatar and Menu */}
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                        sx={{ ml: 1 }}
                    >
                        <Avatar 
                            sx={{ 
                                width: 32, 
                                height: 32, 
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                fontSize: '14px'
                            }}
                        >
                            {user?.name?.charAt(0)?.toUpperCase() || <AccountCircle />}
                        </Avatar>
                    </IconButton>

                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        PaperProps={{
                            sx: {
                                minWidth: 200,
                                mt: 1.5
                            }
                        }}
                    >
                        {/* User Info Header */}
                        <Box sx={{ px: 2, py: 1 }}>
                            <Typography variant="subtitle2" fontWeight={600}>
                                {user?.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                                {user?.email}
                            </Typography>
                        </Box>
                        
                        <Divider />

                        {/* Menu Items */}
                        <MenuItem onClick={handleDashboard}>
                            <ListItemIcon>
                                <Dashboard fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </MenuItem>

                        <MenuItem onClick={handleProfile}>
                            <ListItemIcon>
                                <Person fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Profile" />
                        </MenuItem>

                        <Divider />

                        <MenuItem onClick={handleLogout}>
                            <ListItemIcon>
                                <Logout fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Logout" />
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;