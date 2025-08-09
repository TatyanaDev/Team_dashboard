import { FC } from "react";
import { useDroppable } from "@dnd-kit/core";
import type { Task } from "../types/types";
import Draggable from "./Draggable";

interface DroppableProps {
  status: string;
  tasks: Task[];
}

const Droppable: FC<DroppableProps> = ({ status, tasks }) => {
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div ref={setNodeRef} style={{ margin: "0 10px", flex: 1 }}>
      <h3>{status}</h3>
      <div style={{ border: "1px solid #cccccc", padding: "10px" }}>
        {tasks
          .filter((task) => task.status === status)
          .map((task) => (
            <Draggable key={task.id} task={task} />
          ))}
      </div>
    </div>
  );
};

export default Droppable;
