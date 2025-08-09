import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useState, useEffect } from "react";
import type { NotificationData, Task, TaskStatus } from "../types/types";
import { updateTaskOnServer } from "../services/taskService";
import { useTasks } from "../hooks/useTasks";
import Notification from "./Notification";
import Droppable from "./Droppable";

const TaskBoard = () => {
  const { tasks, setTasks, loading, error } = useTasks();
  const [optimisticTasks, setOptimisticTasks] = useState<Task[]>([]);
  const [notification, setNotification] = useState<NotificationData>({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (tasks) {
      setOptimisticTasks(tasks);
    }
  }, [tasks]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const closeNotification = () => setNotification((prev) => ({ ...prev, open: false }));

  const showNotification = (message: string, severity: "success" | "error") => {
    closeNotification();

    setTimeout(() => {
      setNotification({
        open: true,
        message,
        severity,
      });
    }, 100);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const movedTask = tasks.find((task) => task.id === active.id);
      if (!movedTask) {
        return;
      }

      const newStatus = over.id;
      if (movedTask.status === newStatus) {
        // No status change, don't show notification
        return;
      }

      // Optimistically update the task status in local state (UI)
      const updatedTasks = optimisticTasks.map((task) => (task.id === movedTask.id ? { ...task, status: over.id as TaskStatus } : task));
      setOptimisticTasks(updatedTasks);

      try {
        // For task with ID "1", simulate the optimistic UI update and then send the request to the server
        if (movedTask.id === "1") {
          await updateTaskOnServer(movedTask.id, over.id as TaskStatus);
          showNotification(`Task "${movedTask.title}" moved to ${over.id}`, "success");
        } else {
          // For all other tasks, update the global state
          setTasks((prevTasks) => prevTasks.map((task) => (task.id === active.id ? { ...task, status: over.id as TaskStatus } : task)));
          showNotification(`Task "${movedTask.title}" moved to ${over.id}`, "success");
        }
      } catch (error) {
        // In case of an error, revert the changes made optimistically
        setOptimisticTasks(tasks);
        showNotification(`Failed to move task "${movedTask.title}" ${error}`, "error");
      }
    }
  };

  return (
    <div>
      <DndContext onDragEnd={handleDragEnd}>
        <div style={{ display: "flex" }}>
          {["To Do", "In Progress", "Done"].map((status) => (
            <Droppable key={status} status={status} tasks={optimisticTasks} />
          ))}
        </div>
      </DndContext>

      <Notification notification={notification} closeNotification={closeNotification} />
    </div>
  );
};

export default TaskBoard;
