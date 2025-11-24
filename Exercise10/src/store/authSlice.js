// Redux Slice for Authentication
// This demonstrates Redux concepts: State, Action, Reducer

import { createSlice } from '@reduxjs/toolkit';

// Initial State - the default state of our authentication
const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Creating a slice that automatically generates action creators and action types
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action: loginStart - sets loading state
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    
    // Action: loginSuccess - handles successful login
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      // Store token in localStorage for persistence
      localStorage.setItem('token', action.payload.token);
    },
    
    // Action: loginFailure - handles login errors
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = action.payload;
      localStorage.removeItem('token');
    },
    
    // Action: logout - clears authentication state
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
    },
    
    // Action: clearError - clears error messages
    clearError: (state) => {
      state.error = null;
    },
    
    // Action: setUser - sets user from token validation
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    }
  },
});

// Export actions (these are automatically generated)
export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  setUser
} = authSlice.actions;

// Selectors - functions to get specific pieces of state
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectError = (state) => state.auth.error;

// Export the reducer
export default authSlice.reducer;