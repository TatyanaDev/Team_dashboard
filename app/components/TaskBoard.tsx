import { DndContext, DragEndEvent, useDroppable, useDraggable } from "@dnd-kit/core";
import { FC } from "react";
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setTasks((prevTasks) => prevTasks.map((task) => (task.id === active.id ? { ...task, status: over.id as TaskStatus } : task)));
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div style={{ display: "flex" }}>
        {(["To Do", "In Progress", "Done"] as TaskStatus[]).map((status) => (
          <Droppable key={status} status={status} tasks={tasks || []} />
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
      <div style={{ border: "1px solid #ccc", padding: "10px" }}>{Array.isArray(tasks) && tasks.filter((task) => task.status === status).map((task) => <Draggable key={task.id} task={task} />)}</div>
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
