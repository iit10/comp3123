import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI, apiUtils } from '../api/api';
import toast from 'react-hot-toast';

// Initial state
const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
};

// Action types
const actionTypes = {
    SET_LOADING: 'SET_LOADING',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILURE: 'LOGIN_FAILURE',
    LOGOUT: 'LOGOUT',
    SET_USER: 'SET_USER',
    CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer function
const authReducer = (state, action) => {
    switch (action.type) {
        case actionTypes.SET_LOADING:
            return {
                ...state,
                isLoading: action.payload
            };
        
        case actionTypes.LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isAuthenticated: true,
                isLoading: false,
                error: null
            };
        
        case actionTypes.LOGIN_FAILURE:
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: action.payload
            };
        
        case actionTypes.LOGOUT:
            return {
                ...initialState,
                isLoading: false
            };
        
        case actionTypes.SET_USER:
            return {
                ...state,
                user: action.payload,
                isLoading: false
            };
        
        case actionTypes.CLEAR_ERROR:
            return {
                ...state,
                error: null
            };
        
        default:
            return state;
    }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Check if user is already logged in on app start
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const token = apiUtils.getToken();
                const user = apiUtils.getUser();

                if (token && user) {
                    // Verify token is still valid
                    try {
                        const response = await authAPI.verifyToken();
                        dispatch({
                            type: actionTypes.LOGIN_SUCCESS,
                            payload: {
                                user: response.data.data.user,
                                token
                            }
                        });
                    } catch (error) {
                        // Token is invalid, clear auth data
                        apiUtils.clearAuth();
                        dispatch({ type: actionTypes.LOGOUT });
                    }
                } else {
                    dispatch({ type: actionTypes.SET_LOADING, payload: false });
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                dispatch({ type: actionTypes.SET_LOADING, payload: false });
            }
        };

        initializeAuth();
    }, []);

    // Login function
    const login = async (credentials) => {
        try {
            dispatch({ type: actionTypes.SET_LOADING, payload: true });
            dispatch({ type: actionTypes.CLEAR_ERROR });

            const response = await authAPI.login(credentials);
            const { token, user } = response.data.data;

            // Store auth data
            apiUtils.setToken(token);
            apiUtils.setUser(user);

            // Update state
            dispatch({
                type: actionTypes.LOGIN_SUCCESS,
                payload: { user, token }
            });

            toast.success('Login successful!');
            return { success: true };

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed';
            
            dispatch({
                type: actionTypes.LOGIN_FAILURE,
                payload: errorMessage
            });

            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    // Signup function
    const signup = async (userData) => {
        try {
            dispatch({ type: actionTypes.SET_LOADING, payload: true });
            dispatch({ type: actionTypes.CLEAR_ERROR });

            const response = await authAPI.signup(userData);
            const { token, user } = response.data.data;

            // Store auth data
            apiUtils.setToken(token);
            apiUtils.setUser(user);

            // Update state
            dispatch({
                type: actionTypes.LOGIN_SUCCESS,
                payload: { user, token }
            });

            toast.success('Registration successful!');
            return { success: true };

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Registration failed';
            
            dispatch({
                type: actionTypes.LOGIN_FAILURE,
                payload: errorMessage
            });

            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await authAPI.logout();
            apiUtils.clearAuth();
            dispatch({ type: actionTypes.LOGOUT });
            toast.success('Logged out successfully');
        } catch (error) {
            // Even if API call fails, clear local auth data
            apiUtils.clearAuth();
            dispatch({ type: actionTypes.LOGOUT });
            console.error('Logout error:', error);
        }
    };

    // Update user profile
    const updateProfile = async () => {
        try {
            const response = await authAPI.getProfile();
            const user = response.data.data.user;
            
            apiUtils.setUser(user);
            dispatch({ type: actionTypes.SET_USER, payload: user });
            
            return { success: true, user };
        } catch (error) {
            console.error('Profile update error:', error);
            return { success: false, error: error.response?.data?.message || 'Failed to update profile' };
        }
    };

    // Clear error
    const clearError = () => {
        dispatch({ type: actionTypes.CLEAR_ERROR });
    };

    // Context value
    const contextValue = {
        // State
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isLoading: state.isLoading,
        error: state.error,
        
        // Actions
        login,
        signup,
        logout,
        updateProfile,
        clearError
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    
    return context;
};

// HOC for protected routes
export const withAuth = (Component) => {
    return (props) => {
        const { isAuthenticated, isLoading } = useAuth();
        
        if (isLoading) {
            return <div>Loading...</div>; // Or your loading component
        }
        
        if (!isAuthenticated) {
            return null; // ProtectedRoute will handle redirection
        }
        
        return <Component {...props} />;
    };
};

export default AuthContext;