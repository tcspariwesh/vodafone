import { useEffect, useState } from "react";
import axios from "axios";

const useTasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);
  const BASE_URL = "http://localhost:3000/tasks/";
  const fetchTasks = async () => {
    const response = await axios.get(BASE_URL);
    setTasks(response.data);
  };

  const addTask = async (title) => {
    const newTask = {
      id: Date.now(),
      title,
      completed: false
    };
    try {
      const response = await axios.post(BASE_URL, newTask);
      newTask.id = response.id;
      setTasks(prev => [...prev, newTask]);
    } catch (error) {
      alert(error)
    }
  };

  const deleteTask = async (task) => {
    try {
      await axios.delete(BASE_URL + task.id);
      setTasks(prev => prev.filter(task1 => task1.id !== task.id));
    } catch (error) {
    }
  };

  return {
    tasks,
    addTask,
    deleteTask
  };
};

export default useTasks;