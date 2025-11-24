// Redux Store Configuration
// This demonstrates the Redux Store concept

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import todoReducer from './todoSlice';

// Create the Redux store by combining reducers
// The store holds the complete state tree of the application
export const store = configureStore({
  reducer: {
    auth: authReducer,    // Handle authentication state
    todos: todoReducer,   // Handle todos state
  },
  // Enable Redux DevTools for development with enhanced configuration
  devTools: process.env.NODE_ENV !== 'production' && {
    name: 'React Redux JWT Demo',
    trace: true,
    traceLimit: 25,
  },
  
  // Middleware configuration (optional)
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serialization checks
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;