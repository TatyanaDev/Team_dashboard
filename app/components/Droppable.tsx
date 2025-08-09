import { FC, memo, useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import type { Task } from "../types/types";
import Draggable from "./Draggable";

interface DroppableProps {
  status: string;
  tasks: Task[];
}

const Droppable: FC<DroppableProps> = ({ status, tasks }) => {
  const { setNodeRef } = useDroppable({ id: status });

  const filteredTasks = useMemo(() => tasks.filter((task) => task.status === status), [status, tasks]);

  return (
    <div ref={setNodeRef} style={{ margin: "0 10px", flex: 1 }}>
      <h3>{status}</h3>
      <div style={{ border: "1px solid #cccccc", padding: "10px" }}>
        {filteredTasks.map((task) => (
          <Draggable key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default memo(Droppable);
