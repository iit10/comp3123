// JWT Utility Functions
// This demonstrates JWT (JSON Web Token) concepts for browser usage

import { jwtDecode } from 'jwt-decode';

// Base64 URL encode function
const base64UrlEncode = (str) => {
  return btoa(str)
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

// Simple hash function for demo purposes
const simpleHash = (data) => {
  let hash = 0;
  if (data.length === 0) return hash;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
};

/**
 * Creates a JWT-like token for demo purposes (client-side only)
 * In production, tokens should be created and signed on the server
 * @param {Object} user - User object containing user information
 * @returns {string} - JWT-like token
 */
export const createToken = (user) => {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role || 'user',
    iat: now,
    exp: now + (60 * 60), // 1 hour expiration
    iss: 'react-redux-demo',
    sub: user.id.toString()
  };
  
  const headerEncoded = base64UrlEncode(JSON.stringify(header));
  const payloadEncoded = base64UrlEncode(JSON.stringify(payload));
  
  // Create a simple signature for demo purposes
  const data = `${headerEncoded}.${payloadEncoded}`;
  const signature = base64UrlEncode(simpleHash(data + 'demo-secret'));
  
  return `${headerEncoded}.${payloadEncoded}.${signature}`;
};

/**
 * Verifies a demo JWT token (simplified for client-side demo)
 * @param {string} token - JWT token to verify
 * @returns {Object|null} - Decoded user data or null if invalid
 */
export const verifyToken = (token) => {
  try {
    if (!token || typeof token !== 'string') {
      return null;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // For demo purposes, we'll just decode without full verification
    // In production, proper server-side verification is required
    const decoded = jwtDecode(token);
    
    // Check if token is expired
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      console.warn('Token has expired');
      return null;
    }

    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return null;
  }
};

/**
 * Decodes JWT token without verification (for client-side use)
 * @param {string} token - JWT token to decode
 * @returns {Object|null} - Decoded token payload or null if invalid
 */
export const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Token decoding failed:', error.message);
    return null;
  }
};

/**
 * Checks if a JWT token is expired
 * @param {string} token - JWT token to check
 * @returns {boolean} - True if expired, false otherwise
 */
export const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    return true; // Consider invalid tokens as expired
  }
};

/**
 * Gets the expiration time of a JWT token
 * @param {string} token - JWT token
 * @returns {Date|null} - Expiration date or null if invalid
 */
export const getTokenExpiration = (token) => {
  try {
    const decoded = jwtDecode(token);
    return new Date(decoded.exp * 1000);
  } catch (error) {
    return null;
  }
};

/**
 * Removes the token from localStorage and returns a logout action
 */
export const removeToken = () => {
  localStorage.removeItem('token');
};

/**
 * Gets token from localStorage
 * @returns {string|null} - Token or null if not found
 */
export const getStoredToken = () => {
  return localStorage.getItem('token');
};

/**
 * Mock authentication function for demo purposes
 * In a real app, this would make an API call to your backend
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise} - Promise resolving to user data and token
 */
export const mockAuthenticate = async (username, password) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock users for demo
  const mockUsers = [
    { id: 1, username: 'admin', password: 'admin123', email: 'admin@example.com', role: 'admin' },
    { id: 2, username: 'user', password: 'user123', email: 'user@example.com', role: 'user' },
    { id: 3, username: 'demo', password: 'demo123', email: 'demo@example.com', role: 'user' },
  ];
  
  const user = mockUsers.find(u => u.username === username && u.password === password);
  
  if (!user) {
    throw new Error('Invalid username or password');
  }
  
  // Don't include password in the response
  const { password: _, ...userWithoutPassword } = user;
  const token = createToken(userWithoutPassword);
  
  return {
    user: userWithoutPassword,
    token
  };
};