// Main App Component
// Demonstrates Redux Provider setup and JWT token persistence

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, logout, selectIsAuthenticated, selectToken } from './store/authSlice';
import { decodeToken, isTokenExpired } from './utils/jwt';
import Header from './components/Header';
import Login from './components/Login';
import TodoApp from './components/TodoApp';
import ReduxExplainer from './components/ReduxExplainer';
import JWTExplainer from './components/JWTExplainer';
import './App.css';

// Main App Component
function App() {
  const [activeTab, setActiveTab] = useState('todos');
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const token = useSelector(selectToken);

  // Check for existing token on app startup and validate it
  useEffect(() => {
    if (token && !isAuthenticated) {
      if (isTokenExpired(token)) {
        // Token is expired, logout
        dispatch(logout());
      } else {
        // Token is valid, set user from token
        const decoded = decodeToken(token);
        if (decoded) {
          dispatch(setUser({
            id: decoded.id,
            username: decoded.username,
            email: decoded.email,
            role: decoded.role || 'user'
          }));
        }
      }
    }
  }, [dispatch, token, isAuthenticated]);

  // Auto-logout when token expires
  useEffect(() => {
    if (token && isAuthenticated) {
      const checkTokenExpiration = () => {
        if (isTokenExpired(token)) {
          dispatch(logout());
        }
      };

      // Check token expiration every minute
      const interval = setInterval(checkTokenExpiration, 60000);
      return () => clearInterval(interval);
    }
  }, [dispatch, token, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="App">
        <Header />
        <Login />
      </div>
    );
  }

  const tabs = [
    { key: 'todos', label: 'Todo App', component: <TodoApp /> },
    { key: 'redux', label: 'Redux Concepts', component: <ReduxExplainer /> },
    { key: 'jwt', label: 'JWT Concepts', component: <JWTExplainer /> }
  ];

  return (
    <div className="App">
      <Header />
      
      <div className="app-content">
        <div className="tab-navigation">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {tabs.find(tab => tab.key === activeTab)?.component}
        </div>
      </div>

      <footer className="app-footer">
        <div className="footer-content">
          <h3>React Redux JWT Demo</h3>
          <p>This application demonstrates:</p>
          <div className="demo-features">
            <div className="feature-column">
              <h4>Redux Concepts:</h4>
              <ul>
                <li>✅ State Management</li>
                <li>✅ Store Configuration</li>
                <li>✅ Reducers & Actions</li>
                <li>✅ Dispatch & Subscribe</li>
              </ul>
            </div>
            <div className="feature-column">
              <h4>JWT Features:</h4>
              <ul>
                <li>✅ Token-based Authentication</li>
                <li>✅ Secure Token Storage</li>
                <li>✅ Token Expiration Handling</li>
                <li>✅ User Session Management</li>
              </ul>
            </div>
          </div>
          <p className="demo-note">
            <strong>Demo Accounts:</strong> admin/admin123, user/user123, demo/demo123
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
