# React Redux JWT Demo Application

A comprehensive demonstration of **React Redux** and **JWT (JSON Web Token)** concepts, built as an educational project showcasing modern state management and authentication patterns.

## 🎯 Project Overview

This application demonstrates the integration of Redux for state management and JWT for authentication in a React application. It includes a fully functional todo application with user authentication, comprehensive explanations of both technologies, and practical implementation examples.

## 🚀 Features

### Redux Implementation
- **State Management**: Centralized application state using Redux Toolkit
- **Store Configuration**: Properly configured Redux store with multiple reducers
- **Actions & Reducers**: Pure functions handling state transitions
- **Dispatch & Subscribe**: Component integration using React-Redux hooks
- **Selectors**: Efficient state selection and derived state computation

### JWT Authentication
- **Token-based Authentication**: Secure login/logout functionality
- **Token Storage**: Persistent storage with localStorage integration
- **Token Validation**: Automatic token expiration handling
- **Security Features**: Token signing, verification, and refresh mechanisms
- **User Session Management**: Automatic logout on token expiration

### Interactive Learning
- **Live Code Examples**: Real-time demonstration of concepts
- **Educational Components**: Detailed explanations of Redux and JWT
- **Visual Representations**: Interactive diagrams and token breakdown
- **Practical Implementation**: Working todo application with full CRUD operations

## 📋 Redux Concepts Demonstrated

### 0 - State
- Single source of truth for entire application
- Immutable state structure
- Predictable state changes
- Easy debugging and testing

### 1 - Store
- Central repository holding complete state tree
- Provides `getState()`, `dispatch()`, and `subscribe()` methods
- Configured using Redux Toolkit's `configureStore`

### 2 - Reducer
- Pure functions specifying state changes
- Take current state and action as parameters
- Return new state without mutating original
- Handle multiple action types with switch statements

### 3 - Action
- Plain JavaScript objects describing what happened
- Must have a `type` property
- Created by action creators for consistency
- Carry payload data for state updates

### 4 - Dispatch
- Only way to trigger state changes
- Sends actions to reducers
- Available through `useDispatch()` hook in React components
- Synchronous operation that immediately processes actions

### 5 - Subscribe
- Register callbacks for state changes
- Automatically handled by React-Redux `useSelector()`
- Components re-render when subscribed state changes
- Efficient updates through shallow equality checks

## 🔐 JWT Features

### Authentication Flow
1. **User Login**: Credential verification
2. **Token Generation**: Server creates signed JWT
3. **Token Storage**: Secure client-side storage
4. **Request Authentication**: Token sent with API calls
5. **Token Validation**: Server verifies token integrity
6. **Automatic Logout**: Expired token handling

### Security Implementation
- **HS256 Algorithm**: HMAC-SHA256 signing
- **Token Expiration**: 1-hour lifetime with automatic validation
- **Secure Storage**: localStorage with fallback cleanup
- **XSS Protection**: Token validation on each request
- **Session Management**: Automatic logout on expiration

## 🛠 Technology Stack

- **React 18**: Modern React with hooks and functional components
- **Redux Toolkit**: Official Redux toolset for efficient development
- **React-Redux**: Official React bindings for Redux
- **JSON Web Token**: JWT creation, verification, and decoding
- **CSS3**: Modern styling with flexbox, grid, and animations
- **Local Storage**: Client-side token persistence

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd react-redux-jwt-demo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🎮 Demo Accounts

The application includes three demo accounts for testing:

| Username | Password | Role  | Description |
|----------|----------|-------|-------------|
| admin    | admin123 | admin | Administrator account with full access |
| user     | user123  | user  | Regular user account |
| demo     | demo123  | user  | Demo account for quick testing |

## 📱 Application Structure

```
src/
├── components/           # React components
│   ├── Header.js        # Navigation and user info
│   ├── Login.js         # Authentication form
│   ├── TodoApp.js       # Todo management interface
│   ├── ReduxExplainer.js # Redux concepts explanation
│   └── JWTExplainer.js  # JWT concepts explanation
├── store/               # Redux store configuration
│   ├── index.js         # Store setup and configuration
│   ├── authSlice.js     # Authentication state management
│   └── todoSlice.js     # Todo state management
├── utils/               # Utility functions
│   └── jwt.js           # JWT operations and helpers
├── App.js               # Main application component
├── App.css              # Global application styles
└── index.js             # Application entry point
```

## 🧪 Usage Examples

### Redux State Management

```javascript
// Dispatching an action
const dispatch = useDispatch();
dispatch(addTodo('Learn Redux concepts'));

// Selecting state
const todos = useSelector(selectTodos);
const isAuthenticated = useSelector(selectIsAuthenticated);

// Creating actions with Redux Toolkit
const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action) => {
      state.todos.push({
        id: Date.now(),
        text: action.payload,
        completed: false
      });
    }
  }
});
```

### JWT Authentication

```javascript
// Token creation
const token = createToken({
  id: user.id,
  username: user.username,
  email: user.email
});

// Token verification
const decoded = verifyToken(token);

// Checking token expiration
const isExpired = isTokenExpired(token);

// Using token in API requests
const response = await fetch('/api/data', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

## 🎯 Learning Objectives

After exploring this application, you should understand:

### Redux Concepts
- How Redux provides predictable state management
- The unidirectional data flow pattern
- When and why to use Redux in React applications
- Best practices for structuring Redux code
- Integration between React components and Redux store

### JWT Authentication
- How JWT tokens work and their structure
- Benefits of stateless authentication
- Token lifecycle management
- Security considerations and best practices
- Integration with React applications

### React Integration
- Using React-Redux hooks (`useSelector`, `useDispatch`)
- Managing authentication state across components
- Handling side effects and async operations
- Component lifecycle with Redux integration

## 🔧 Key Implementation Details

### State Persistence
- Authentication state persists across browser sessions
- Automatic token validation on app startup
- Graceful handling of expired tokens

### Error Handling
- Comprehensive error messages for authentication failures
- Graceful degradation for network issues
- User-friendly error display with recovery options

### Performance Optimization
- Memoized selectors for efficient re-renders
- Optimized component updates with React.memo
- Efficient state normalization patterns

### Security Measures
- Secure token storage with automatic cleanup
- XSS protection through proper token handling
- Input validation and sanitization
- Automatic session timeout

## 📚 Additional Resources

### Redux Learning
- [Redux Official Documentation](https://redux.js.org/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React-Redux Hooks](https://react-redux.js.org/api/hooks)

### JWT Learning
- [JWT.io - JWT Debugger](https://jwt.io/)
- [RFC 7519 - JWT Specification](https://tools.ietf.org/html/rfc7519)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)

### React Resources
- [React Official Documentation](https://reactjs.org/)
- [React Hooks Guide](https://reactjs.org/docs/hooks-intro.html)

## 🐛 Troubleshooting

### Common Issues

1. **Token Expired Error**
   - Log out and log back in with valid credentials
   - Check browser console for token expiration details

2. **Redux State Not Updating**
   - Verify actions are properly dispatched
   - Check reducer logic for immutability
   - Ensure components are wrapped with Provider

3. **Authentication Not Persisting**
   - Check localStorage permissions in browser
   - Verify token format and expiration
   - Clear browser storage and retry

### Development Tips

- Use Redux DevTools Extension for state debugging
- Monitor network tab for token-related requests
- Check browser console for authentication errors
- Use React Developer Tools for component inspection

## 📄 Available Scripts

In the project directory, you can run:

### `npm start`
Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.

## 👨‍💻 Author

Created as part of COMP3123 - Full Stack Development coursework, demonstrating advanced React, Redux, and JWT implementation patterns.

---

**Note**: This application is designed for educational purposes and includes mock authentication. In production applications, always implement proper server-side authentication and follow security best practices.
