import React, { useState, useEffect } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import ResetButton from './components/ResetButton';
import './App.css';

const App = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem('todos'));
    if (storedTodos) {
      setTodos(storedTodos);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
    };
    setTodos([...todos, newTodo]);
  };

  const toggleTodo = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const resetTodos = () => {
    setTodos([]);
  };

  const activeTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  return (
    <div className="app">
      <h1>TODO App</h1>
      <TodoForm addTodo={addTodo} />
      <div className="todo-container">
        <div className="todo-column">
          <h2>Active</h2>
          <TodoList
            todos={activeTodos}
            toggleTodo={toggleTodo}
            showCompleted={false}
          />
        </div>
        <div className="todo-column">
          <h2>Completed</h2>
          <TodoList
            todos={completedTodos}
            toggleTodo={toggleTodo}
            showCompleted={true}
          />
        </div>
      </div>
      {todos.length > 0 && <ResetButton resetTodos={resetTodos} />}
    </div>
  );
};

export default App;
