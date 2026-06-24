import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import {
  cancelTaskReminder,
  scheduleTaskReminder,
} from "../utils/notifications";

const TaskContext = createContext();
const STORAGE_KEY = "tasks";

const defaultTasks = [];

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

  function findTask(id) {
    return tasks.find((t) => t.id === id);
  }

  async function addTask(title, description, dueDate) {
    let notificationId = null;
    if (dueDate) {
      notificationId = await scheduleTaskReminder(title, dueDate);
    }
    const newTask = {
      id: Date.now().toString(),
      title,
      description,
      status: false,
      createdDate: new Date().toISOString().split("T")[0],
      dueDate: dueDate ? dueDate.toISOString() : null,
      notificationId,
    };
    setTasks((prev) => [newTask, ...prev]);
  }

  async function updateTask(id, title, description, dueDate) {
    const existing = findTask(id);
    if (existing?.notificationId) {
      await cancelTaskReminder(existing.notificationId);
    }
    let notificationId = null;
    if (dueDate) {
      notificationId = await scheduleTaskReminder(title, dueDate);
    }
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              title,
              description,
              dueDate: dueDate ? dueDate.toISOString() : null,
              notificationId,
            }
          : t,
      ),
    );
  }

  async function toggleTask(id) {
    const existing = findTask(id);
    if (existing && !existing.status && existing.notificationId) {
      await cancelTaskReminder(existing.notificationId);
    }
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const willBeCompleted = !t.status;
        return {
          ...t,
          status: willBeCompleted,
          notificationId: willBeCompleted ? null : t.notificationId,
        };
      }),
    );
  }

  async function deleteTask(id) {
    const existing = findTask(id);
    if (existing?.notificationId) {
      await cancelTaskReminder(existing.notificationId);
    }
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function importTasks(items) {
    const today = new Date().toISOString().split("T")[0];
    const newTasks = items.map((item, index) => ({
      id: `${Date.now()}-${index}`,
      title: item.title,
      description: item.description || "",
      status: false,
      createdDate: today,
      dueDate: null,
      notificationId: null,
    }));
    setTasks((prev) => [...newTasks, ...prev]);
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        toggleTask,
        deleteTask,
        importTasks,
        loaded,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  return useContext(TaskContext);
}
