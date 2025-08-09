import { FC } from "react";
import { useDraggable } from "@dnd-kit/core";
import type { Task } from "../types/types";

interface DraggableProps {
  task: Task;
}

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
        border: "1px solid #cccccc",
        backgroundColor: "#ffffff",
        cursor: "move",
      }}
    >
      {task.title}
    </div>
  );
};

export default Draggable;
