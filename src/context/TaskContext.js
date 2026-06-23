import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

const TaskContext = createContext();
const STORAGE_KEY = "tasks";

const defaultTasks = [
  {
    id: "1",
    title: "Buy groceries",
    description: "Milk, eggs, bread",
    status: false,
    createdDate: "2026-06-20",
  },
  {
    id: "2",
    title: "Finish report",
    description: "Q2 summary for work",
    status: true,
    createdDate: "2026-06-19",
  },
  {
    id: "3",
    title: "Call dentist",
    description: "Reschedule appointment",
    status: false,
    createdDate: "2026-06-21",
  },
];

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadTasks() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        setTasks(stored !== null ? JSON.parse(stored) : defaultTasks);
      } catch (error) {
        setTasks(defaultTasks);
      } finally {
        setLoaded(true);
      }
    }
    loadTasks();
  }, []);

  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)).catch(() => {});
    }
  }, [tasks, loaded]);

  function addTask(title, description) {
    const newTask = {
      id: Date.now().toString(),
      title,
      description,
      status: false,
      createdDate: new Date().toISOString().split("T")[0],
    };
    setTasks((prev) => [newTask, ...prev]);
  }

  function toggleTask(id) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: !t.status } : t)),
    );
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function importTasks(items) {
    const today = new Date().toISOString().split("T")[0];
    const newTasks = items.map((item, index) => ({
      id: `${Date.now()}-${index}`,
      title: item.title,
      description: "Imported from public API",
      status: item.status,
      createdDate: today,
    }));
    setTasks((prev) => [...newTasks, ...prev]);
  }

  return (
    <TaskContext.Provider
      value={{ tasks, addTask, toggleTask, deleteTask, importTasks, loaded }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  return useContext(TaskContext);
}
