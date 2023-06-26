import React from 'react';

const ResetButton = ({ resetTodos }) => {
  const handleResetClick = () => {
    resetTodos();
  };

  return (
    <button className="reset-button" onClick={handleResetClick}>
      Reset
    </button>
  );
};

export default ResetButton;
