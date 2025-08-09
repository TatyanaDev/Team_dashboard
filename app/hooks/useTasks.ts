import { useState, useEffect } from "react";
import { Task } from "../types/types";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        setTimeout(async () => {
          const mockData = await import("../../public/mockData.json");
          const tasksData = mockData.tasks as Task[];
          setTasks(tasksData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error(error);
        setError("Error fetching tasks");
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  return { tasks, setTasks, loading, error };
};
