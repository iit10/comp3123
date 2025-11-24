// Login Component
// This demonstrates React-Redux integration with useSelector and useDispatch

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure, clearError } from '../store/authSlice';
import { selectIsLoading, selectError, selectIsAuthenticated } from '../store/authSlice';
import { mockAuthenticate } from '../utils/jwt';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  // useSelector hook to subscribe to Redux state
  const dispatch = useDispatch(); // useDispatch hook to dispatch actions
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      dispatch(loginFailure('Please fill in all fields'));
      return;
    }

    // Dispatch loginStart action
    dispatch(loginStart());

    try {
      // Attempt authentication
      const result = await mockAuthenticate(formData.username, formData.password);
      
      // Dispatch loginSuccess action with user data and token
      dispatch(loginSuccess({
        user: result.user,
        token: result.token
      }));
      
      // Clear form
      setFormData({ username: '', password: '' });
    } catch (error) {
      // Dispatch loginFailure action with error message
      dispatch(loginFailure(error.message));
    }
  };

  const fillDemoCredentials = () => {
    setFormData({
      username: 'demo',
      password: 'demo123'
    });
  };

  if (isAuthenticated) {
    return null; // Don't render login form if already authenticated
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        <p className="login-subtitle">Redux JWT Authentication Demo</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Enter username"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Enter password"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="login-button"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="demo-credentials">
          <p>Demo Credentials:</p>
          <div className="credentials-list">
            <div>👤 admin / admin123</div>
            <div>👤 user / user123</div>
            <div>👤 demo / demo123</div>
          </div>
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="demo-button"
            disabled={isLoading}
          >
            Use Demo Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;