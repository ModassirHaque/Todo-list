import React, { useState } from 'react';
import './TodoItem.css'; // Import your CSS file

const TodoItem = ({ task, deleteTask, updateTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(task.text);
  const [newRecurrence, setNewRecurrence] = useState(task.recurrence);
  const [isMarkedForDeletion, setIsMarkedForDeletion] = useState(false);

  const handleUpdate = () => {
    updateTask(task.id, newText, newRecurrence);
    setIsEditing(false);
  };

  const handleCheckboxChange = () => {
    setIsMarkedForDeletion(true);
    // Set a timeout to delete the task after 2 seconds
    setTimeout(() => {
      deleteTask(task.id);
    }, 2000); // Change to 3000 for 3 seconds
  };

  // Check if nextOccurrence is defined and is a valid date
  const formattedNextOccurrence = task.nextOccurrence 
    ? new Date(task.nextOccurrence).toLocaleDateString() 
    : 'No date set';

  return (
    <div className="todo-item">
      <input
        type="checkbox"
        onChange={handleCheckboxChange} // Call handleCheckboxChange on checkbox change
      />
      {isEditing ? (
        <div>
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
          />
          <select
            value={newRecurrence}
            onChange={(e) => setNewRecurrence(e.target.value)}
          >
            <option value="none">No Recurrence</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button onClick={handleUpdate}>Save</button>
        </div>
      ) : (
        <span style={{ textDecoration: isMarkedForDeletion ? 'line-through' : 'none' }}>
          {task.text} 
          {task.recurrence !== 'none' && (
            <span className="recurrence-info">
              (Next: {formattedNextOccurrence})
            </span>
          )}
        </span>
      )}
      <button onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? 'Cancel' : 'Edit'}
      </button>
    </div>
  );
};

export default TodoItem;