import { Box, Typography } from "@mui/material";
import { useDraggable } from "@dnd-kit/core";
import { FC, memo } from "react";
import type { Task } from "../types/types";

interface DraggableProps {
  task: Task;
}

const Draggable: FC<DraggableProps> = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id });

  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;

  const ariaLabel = `${task.title}${task.status ? `, status: ${task.status}` : ""}${isDragging ? ", currently dragging" : ""}`;

  return (
    <Box
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      role="listitem"
      tabIndex={0}
      aria-roledescription="draggable item"
      aria-label={ariaLabel}
      sx={{
        p: 1,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        bgcolor: isDragging ? "grey.100" : "background.paper",
        boxShadow: isDragging ? 2 : 0,
        cursor: "grab",
        outline: "none",
      }}
      style={style}
    >
      <Typography variant="body2">{task.title}</Typography>
    </Box>
  );
};

export default memo(Draggable);
