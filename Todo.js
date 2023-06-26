import React from 'react';

const Todo = ({ todo, toggleTodo }) => {
  const handleToggle = () => {
    toggleTodo(todo.id);
  };

  return (
    <div className={`todo ${todo.completed ? 'completed' : ''}`} onClick={handleToggle}>
      {todo.text}
    </div>
  );
};

export default Todo;
