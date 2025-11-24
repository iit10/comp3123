// ReduxExplainer Component
// Educational component explaining Redux concepts

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAuth } from '../store/authSlice';
import { selectTodos, selectFilter } from '../store/todoSlice';
import './ReduxExplainer.css';

const ReduxExplainer = () => {
  const [activeTab, setActiveTab] = useState('state');
  const authState = useSelector(selectAuth);
  const todos = useSelector(selectTodos);
  const filter = useSelector(selectFilter);

  const concepts = {
    state: {
      title: 'State',
      description: 'The single source of truth for your entire application. All data is stored in one immutable state tree.',
      example: 'Current app state contains user authentication info and todos list.',
      code: `const state = {
  auth: {
    user: ${authState.user ? JSON.stringify(authState.user, null, 2) : 'null'},
    isAuthenticated: ${authState.isAuthenticated},
    token: "${authState.token ? authState.token.substring(0, 20) + '...' : 'null'}"
  },
  todos: {
    todos: [${todos.length} items],
    filter: "${filter}"
  }
}`,
      keyPoints: [
        'Single source of truth',
        'Immutable data structure',
        'Predictable state changes',
        'Easy to debug and test'
      ]
    },
    store: {
      title: 'Store',
      description: 'The object that holds the complete state tree of your app. There should only be one store in a Redux app.',
      example: 'Our store combines auth and todos reducers using configureStore.',
      code: `import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    auth: authReducer,
    todos: todoReducer,
  }
});

// The store provides:
// - getState() - returns current state
// - dispatch(action) - dispatches an action
// - subscribe(listener) - registers change listeners`,
      keyPoints: [
        'Holds application state',
        'Allows state access via getState()',
        'Allows state updates via dispatch(action)',
        'Registers listeners via subscribe(listener)'
      ]
    },
    reducer: {
      title: 'Reducer',
      description: 'Pure functions that specify how the application\'s state changes in response to actions.',
      example: 'Auth reducer handles login, logout, and user management actions.',
      code: `const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'auth/loginSuccess':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false
      };
    case 'auth/logout':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false
      };
    default:
      return state;
  }
};`,
      keyPoints: [
        'Pure functions (no side effects)',
        'Take current state and action',
        'Return new state object',
        'Never mutate the original state'
      ]
    },
    action: {
      title: 'Action',
      description: 'Plain JavaScript objects that describe what happened. Actions must have a type property.',
      example: 'Login action carries user credentials to the reducer.',
      code: `// Action Creator
const loginSuccess = (userData) => ({
  type: 'auth/loginSuccess',
  payload: {
    user: userData.user,
    token: userData.token
  }
});

// Action Object
{
  type: 'auth/loginSuccess',
  payload: {
    user: { id: 1, username: 'demo' },
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI...'
  }
}

// Action dispatching
dispatch(loginSuccess(userData));`,
      keyPoints: [
        'Plain JavaScript objects',
        'Must have a "type" property',
        'Describe "what happened"',
        'Created by action creators'
      ]
    },
    dispatch: {
      title: 'Dispatch',
      description: 'The only way to trigger a state change. You call store.dispatch(action) to send an action to the reducer.',
      example: 'Dispatching login action updates authentication state.',
      code: `import { useDispatch } from 'react-redux';
import { loginSuccess, logout } from './authSlice';

const LoginComponent = () => {
  const dispatch = useDispatch();

  const handleLogin = async () => {
    // Dispatch an action
    dispatch(loginStart());
    
    try {
      const result = await authenticate(credentials);
      dispatch(loginSuccess(result));
    } catch (error) {
      dispatch(loginFailure(error.message));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };
};`,
      keyPoints: [
        'Only way to trigger state changes',
        'Sends actions to reducers',
        'Synchronous operation',
        'Available via useDispatch() hook'
      ]
    },
    subscribe: {
      title: 'Subscribe',
      description: 'Register callbacks that will be called every time an action is dispatched and state changes.',
      example: 'React-Redux automatically subscribes components to store changes.',
      code: `// Manual subscription (rarely used with React)
const unsubscribe = store.subscribe(() => {
  console.log('State changed:', store.getState());
});

// React-Redux useSelector automatically subscribes
import { useSelector } from 'react-redux';

const TodoComponent = () => {
  // This component will re-render when todos change
  const todos = useSelector(state => state.todos.todos);
  
  return (
    <div>
      {todos.map(todo => (
        <div key={todo.id}>{todo.text}</div>
      ))}
    </div>
  );
};

// Cleanup subscription
unsubscribe();`,
      keyPoints: [
        'Listen to state changes',
        'Execute callbacks when state updates',
        'useSelector() automatically subscribes/unsubscribes',
        'Components re-render on relevant state changes'
      ]
    }
  };

  const currentConcept = concepts[activeTab];

  return (
    <div className="redux-explainer">
      <div className="explainer-container">
        <h2>Redux Concepts Explained</h2>
        <p className="explainer-subtitle">
          Understanding the core concepts of Redux state management
        </p>

        <div className="concept-tabs">
          {Object.keys(concepts).map((key, index) => (
            <button
              key={key}
              className={`tab-button ${activeTab === key ? 'active' : ''}`}
              onClick={() => setActiveTab(key)}
            >
              {index} - {concepts[key].title}
            </button>
          ))}
        </div>

        <div className="concept-content">
          <div className="concept-header">
            <h3>{currentConcept.title}</h3>
            <p className="concept-description">{currentConcept.description}</p>
          </div>

          <div className="concept-example">
            <h4>Example in this app:</h4>
            <p>{currentConcept.example}</p>
          </div>

          <div className="concept-code">
            <h4>Code Example:</h4>
            <pre><code>{currentConcept.code}</code></pre>
          </div>

          <div className="concept-points">
            <h4>Key Points:</h4>
            <ul>
              {currentConcept.keyPoints.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="redux-flow">
          <h3>Redux Data Flow</h3>
          <div className="flow-diagram">
            <div className="flow-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <strong>UI Triggers Action</strong>
                <p>User clicks button, form submits, etc.</p>
              </div>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <strong>Dispatch Action</strong>
                <p>Action is dispatched to the store</p>
              </div>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <strong>Reducer Updates State</strong>
                <p>Reducer processes action and returns new state</p>
              </div>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <strong>UI Re-renders</strong>
                <p>Components subscribed to state updates re-render</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReduxExplainer;