import { DndContext, DragEndEvent, useDroppable, useDraggable } from "@dnd-kit/core";
import { FC, useState, useEffect } from "react";
import { updateTaskOnServer } from "../services/taskService";
import { useTasks } from "../hooks/useTasks";
import { Task } from "../types/types";

type TaskStatus = "To Do" | "In Progress" | "Done";

interface DroppableProps {
  status: TaskStatus;
  tasks: Task[];
}

interface DraggableProps {
  task: Task;
}

const TaskBoard = () => {
  const { tasks, setTasks, loading, error } = useTasks();
  const [optimisticTasks, setOptimisticTasks] = useState<Task[]>([]);

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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const movedTask = tasks.find((task) => task.id === active.id);
      if (!movedTask) {
        return;
      }

      // Optimistically update the task status in local state (UI)
      const updatedTasks = optimisticTasks.map((task) => (task.id === movedTask.id ? { ...task, status: over.id as TaskStatus } : task));
      setOptimisticTasks(updatedTasks);

      try {
        // For task with ID "1", simulate the optimistic UI update and then send the request to the server
        if (movedTask.id === "1") {
          await updateTaskOnServer(movedTask.id, over.id as TaskStatus);
        } else {
          // For all other tasks, update the global state
          setTasks((prevTasks) => prevTasks.map((task) => (task.id === active.id ? { ...task, status: over.id as TaskStatus } : task)));
        }
      } catch (error) {
        // In case of an error, revert the changes made optimistically
        setOptimisticTasks(tasks);
        alert(error);
      }
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div style={{ display: "flex" }}>
        {(["To Do", "In Progress", "Done"] as TaskStatus[]).map((status) => (
          <Droppable key={status} status={status} tasks={optimisticTasks || []} />
        ))}
      </div>
    </DndContext>
  );
};

const Droppable: FC<DroppableProps> = ({ status, tasks }) => {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div ref={setNodeRef} style={{ margin: "0 10px", flex: 1 }}>
      <h3>{status}</h3>
      <div style={{ border: "1px solid #ccc", padding: "10px" }}>
        {tasks
          .filter((task) => task.status === status)
          .map((task) => (
            <Draggable key={task.id} task={task} />
          ))}
      </div>
    </div>
  );
};

const Draggable: FC<DraggableProps> = ({ task }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: task.id,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        padding: "5px",
        marginBottom: "5px",
        border: "1px solid #ccc",
        backgroundColor: "#fff",
        cursor: "move",
      }}
    >
      {task.title}
    </div>
  );
};

export default TaskBoard;
