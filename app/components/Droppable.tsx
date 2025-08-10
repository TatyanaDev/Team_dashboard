import { Box, Stack, Typography } from "@mui/material";
import { useDroppable } from "@dnd-kit/core";
import { FC, memo, useMemo } from "react";
import type { Task, TaskStatus } from "../types/types";
import Draggable from "./Draggable";

interface DroppableProps {
  status: TaskStatus;
  tasks: Task[];
}

const Droppable: FC<DroppableProps> = ({ status, tasks }) => {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const filteredTasks = useMemo(() => tasks.filter((task) => task.status === status), [status, tasks]);

  return (
    <Box
      ref={setNodeRef}
      role="list"
      aria-label={isOver ? `Release to move task to ${status}` : `${status} tasks list`}
      sx={{
        flex: 1,
        width: "100%",
        minHeight: { xs: 240, md: 280 },
        borderRadius: 1,
        border: "1px dashed",
        borderColor: isOver ? "primary.main" : "divider",
        bgcolor: isOver ? "action.hover" : "transparent",
        transition: "border-color 120ms ease, background-color 120ms ease",
        p: 1.5,
        display: "flex",
      }}
    >
      {filteredTasks.length === 0 ? (
        <Box sx={{ m: "auto", textAlign: "center", color: "text.disabled", userSelect: "none" }} aria-label={`No tasks in ${status}. You can drop tasks here.`}>
          <Typography variant="body2">No tasks</Typography>
        </Box>
      ) : (
        <Stack spacing={1} sx={{ width: "100%" }}>
          {filteredTasks.map((task) => (
            <Draggable key={task.id} task={task} />
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default memo(Droppable);
