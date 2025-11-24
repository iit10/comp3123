// Header Component
// Demonstrates useSelector for reading state and useDispatch for actions

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout, selectUser, selectIsAuthenticated, selectToken } from '../store/authSlice';
import { decodeToken, getTokenExpiration } from '../utils/jwt';
import './Header.css';

const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const token = useSelector(selectToken);

  const handleLogout = () => {
    // Dispatch logout action
    dispatch(logout());
  };

  if (!isAuthenticated) {
    return (
      <header className="header">
        <div className="header-content">
          <h1>React Redux JWT Demo</h1>
          <div className="auth-status">
            <span className="status-indicator not-authenticated">Not Authenticated</span>
          </div>
        </div>
      </header>
    );
  }

  // Get token expiration info
  const tokenExpiration = token ? getTokenExpiration(token) : null;
  const decodedToken = token ? decodeToken(token) : null;

  return (
    <header className="header authenticated">
      <div className="header-content">
        <h1>React Redux JWT Demo</h1>
        
        <div className="user-info">
          <div className="user-details">
            <span className="welcome-text">Welcome, {user?.username || 'User'}!</span>
            <div className="user-meta">
              <span className="user-email">{user?.email}</span>
              <span className="user-role">{user?.role}</span>
            </div>
          </div>
          
          <div className="token-info">
            <div className="token-details">
              <small>Token expires: {tokenExpiration?.toLocaleString()}</small>
              {decodedToken && (
                <small>User ID: {decodedToken.id}</small>
              )}
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="logout-button"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;