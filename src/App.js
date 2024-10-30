import React, { useState, useEffect } from 'react';
import TodoList from './components/TodoList';
import AddTaskForm from './components/AddTaskForm';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs
import axios from 'axios';

const App = () => {
  const [tasks, setTasks] = useState([]);

  // Fetch tasks from the backend when the component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const calculateNextOccurrence = (recurrence) => {
    const now = new Date();
    switch (recurrence) {
      case 'daily':
        return new Date(now.setDate(now.getDate() + 1));
      case 'weekly':
        return new Date(now.setDate(now.getDate() + 7));
      case 'monthly':
        return new Date(now.setMonth(now.getMonth() + 1));
      case 'yearly':
        return new Date(now.setFullYear(now.getFullYear() + 1));
      default:
        return null; // No recurrence
    }
  };

  const addTask = async (text, recurrence) => {
    const newTask = {
      id: uuidv4(),
      text,
      completed: false,
      recurrence,
      nextOccurrence: calculateNextOccurrence(recurrence),
    };

    try {
      const response = await axios.post('http://localhost:5000/tasks', newTask);
      setTasks([...tasks, response.data]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const updateTask = async (id, newText, newRecurrence) => {
    const updatedTask = {
      text: newText,
      recurrence: newRecurrence,
      nextOccurrence: calculateNextOccurrence(newRecurrence),
    };

    try {
      const response = await axios.put(`http://localhost:5000/tasks/${id}`, updatedTask);
      setTasks(tasks.map(task => (task.id === id ? response.data : task)));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="app">
      <h1>To-Do List</h1>
      <AddTaskForm addTask={addTask} />
      <TodoList 
        tasks={tasks} 
        deleteTask={deleteTask} 
        updateTask={updateTask} 
      />
    </div>
  );
};

export default App;