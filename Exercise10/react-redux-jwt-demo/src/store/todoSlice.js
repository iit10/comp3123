// Redux Slice for Todos
// This demonstrates how to manage a list of items with Redux

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  todos: [
    { id: 1, text: 'Learn Redux State Management', completed: false },
    { id: 2, text: 'Understand JWT Authentication', completed: false },
    { id: 3, text: 'Build React Components', completed: true },
  ],
  filter: 'all', // all, active, completed
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    // Action: addTodo - adds a new todo
    addTodo: (state, action) => {
      const newTodo = {
        id: Date.now(),
        text: action.payload,
        completed: false,
      };
      state.todos.push(newTodo);
    },
    
    // Action: toggleTodo - toggles completion status
    toggleTodo: (state, action) => {
      const todo = state.todos.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    
    // Action: deleteTodo - removes a todo
    deleteTodo: (state, action) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
    },
    
    // Action: editTodo - updates todo text
    editTodo: (state, action) => {
      const { id, text } = action.payload;
      const todo = state.todos.find(todo => todo.id === id);
      if (todo) {
        todo.text = text;
      }
    },
    
    // Action: setFilter - changes the current filter
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    
    // Action: clearCompleted - removes all completed todos
    clearCompleted: (state) => {
      state.todos = state.todos.filter(todo => !todo.completed);
    }
  },
});

export const {
  addTodo,
  toggleTodo,
  deleteTodo,
  editTodo,
  setFilter,
  clearCompleted
} = todoSlice.actions;

// Selectors
export const selectTodos = (state) => state.todos.todos;
export const selectFilter = (state) => state.todos.filter;

// Derived selectors
export const selectFilteredTodos = (state) => {
  const todos = selectTodos(state);
  const filter = selectFilter(state);
  
  switch (filter) {
    case 'active':
      return todos.filter(todo => !todo.completed);
    case 'completed':
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};

export const selectActiveTodoCount = (state) => {
  return selectTodos(state).filter(todo => !todo.completed).length;
};

export const selectCompletedTodoCount = (state) => {
  return selectTodos(state).filter(todo => todo.completed).length;
};

export default todoSlice.reducer;