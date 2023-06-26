import React from 'react';

const TodoList = ({ todos, toggleTodo, showCompleted }) => {
  const handleTodoClick = (id) => {
    toggleTodo(id);
  };

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className={todo.completed ? 'completed' : ''}
          onClick={() => handleTodoClick(todo.id)}
        >
          {todo.text}
        </li>
      ))}
      {todos.length === 0 && (
        <li className="no-todos">{showCompleted ? 'No completed todos' : 'No active todos'}</li>
      )}
    </ul>
  );
};

export default TodoList;
