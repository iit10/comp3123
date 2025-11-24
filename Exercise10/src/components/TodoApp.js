// TodoApp Component
// Demonstrates comprehensive Redux usage with multiple actions and selectors

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addTodo,
  toggleTodo,
  deleteTodo,
  editTodo,
  setFilter,
  clearCompleted,
  selectFilteredTodos,
  selectFilter,
  selectActiveTodoCount,
  selectCompletedTodoCount
} from '../store/todoSlice';
import './TodoApp.css';

const TodoApp = () => {
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  // Subscribe to Redux state using useSelector
  const dispatch = useDispatch();
  const todos = useSelector(selectFilteredTodos);
  const filter = useSelector(selectFilter);
  const activeCount = useSelector(selectActiveTodoCount);
  const completedCount = useSelector(selectCompletedTodoCount);

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      // Dispatch addTodo action
      dispatch(addTodo(newTodo.trim()));
      setNewTodo('');
    }
  };

  const handleToggle = (id) => {
    // Dispatch toggleTodo action
    dispatch(toggleTodo(id));
  };

  const handleDelete = (id) => {
    // Dispatch deleteTodo action
    dispatch(deleteTodo(id));
  };

  const handleEdit = (id, currentText) => {
    setEditingId(id);
    setEditText(currentText);
  };

  const handleSaveEdit = () => {
    if (editText.trim()) {
      // Dispatch editTodo action
      dispatch(editTodo({ id: editingId, text: editText.trim() }));
    }
    setEditingId(null);
    setEditText('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleFilterChange = (newFilter) => {
    // Dispatch setFilter action
    dispatch(setFilter(newFilter));
  };

  const handleClearCompleted = () => {
    // Dispatch clearCompleted action
    dispatch(clearCompleted());
  };

  return (
    <div className="todo-app">
      <div className="todo-container">
        <h2>Redux Todo App</h2>
        <p className="todo-subtitle">Demonstrating Redux State Management</p>

        {/* Add Todo Form */}
        <form onSubmit={handleAddTodo} className="add-todo-form">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo..."
            className="todo-input"
          />
          <button type="submit" className="add-button">
            Add
          </button>
        </form>

        {/* Filter Buttons */}
        <div className="filter-buttons">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => handleFilterChange('all')}
          >
            All ({activeCount + completedCount})
          </button>
          <button
            className={filter === 'active' ? 'active' : ''}
            onClick={() => handleFilterChange('active')}
          >
            Active ({activeCount})
          </button>
          <button
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => handleFilterChange('completed')}
          >
            Completed ({completedCount})
          </button>
        </div>

        {/* Todo List */}
        <div className="todo-list">
          {todos.length === 0 ? (
            <div className="empty-state">
              {filter === 'all' ? 'No todos yet!' : `No ${filter} todos!`}
            </div>
          ) : (
            todos.map(todo => (
              <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggle(todo.id)}
                  className="todo-checkbox"
                />
                
                {editingId === todo.id ? (
                  <div className="edit-form">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="edit-input"
                      onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                      autoFocus
                    />
                    <div className="edit-actions">
                      <button onClick={handleSaveEdit} className="save-button">
                        ✓
                      </button>
                      <button onClick={handleCancelEdit} className="cancel-button">
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="todo-text">{todo.text}</span>
                    <div className="todo-actions">
                      <button
                        onClick={() => handleEdit(todo.id, todo.text)}
                        className="edit-button"
                        disabled={todo.completed}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(todo.id)}
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {/* Clear Completed Button */}
        {completedCount > 0 && (
          <div className="clear-completed-section">
            <button
              onClick={handleClearCompleted}
              className="clear-completed-button"
            >
              Clear Completed ({completedCount})
            </button>
          </div>
        )}

        {/* Redux State Display */}
        <div className="redux-info">
          <h3>Redux State Information</h3>
          <div className="state-info">
            <div className="state-item">
              <strong>Current Filter:</strong> {filter}
            </div>
            <div className="state-item">
              <strong>Total Todos:</strong> {activeCount + completedCount}
            </div>
            <div className="state-item">
              <strong>Active Todos:</strong> {activeCount}
            </div>
            <div className="state-item">
              <strong>Completed Todos:</strong> {completedCount}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoApp;