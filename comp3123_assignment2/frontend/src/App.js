import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { Toaster } from 'react-hot-toast';

// Context
import { AuthProvider } from './context/AuthContext';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import EmployeeListPage from './pages/EmployeeListPage';
import AddEmployeePage from './pages/AddEmployeePage';
import ViewEmployeePage from './pages/ViewEmployeePage';
import UpdateEmployeePage from './pages/UpdateEmployeePage';
import SearchEmployeePage from './pages/SearchEmployeePage';

// Create Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

// Layout component for protected pages
const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, backgroundColor: 'background.default' }}>
        {children}
      </Box>
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box sx={{ minHeight: '100vh' }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              
              {/* Protected Routes */}
              <Route 
                path="/employees" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <EmployeeListPage />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/employees/add" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <AddEmployeePage />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/employees/view/:id" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ViewEmployeePage />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/employees/edit/:id" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <UpdateEmployeePage />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/employees/search" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <SearchEmployeePage />
                    </Layout>
                  </ProtectedRoute>
                } 
              />

              {/* Redirect root to employees */}
              <Route 
                path="/" 
                element={<Navigate to="/employees" replace />} 
              />

              {/* Catch all route - redirect to employees */}
              <Route 
                path="*" 
                element={<Navigate to="/employees" replace />} 
              />
            </Routes>
          </Box>
        </Router>

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#333',
              fontSize: '14px',
              padding: '12px 16px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
            success: {
              iconTheme: {
                primary: '#4caf50',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#f44336',
                secondary: '#fff',
              },
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;