import { Task } from "@/schema/Task";
import { useDraggable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";
import { Box } from "@mui/material";

interface Props {
  task: Task;
  containerId: string;
}

export default function DraggableTaskCard({ task, containerId }: Props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: { containerId },
  });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        transform: `translate3d(${transform?.x ?? 0}px, ${
          transform?.y ?? 0
        }px, 0)`,
        cursor: "pointer",
      }}
      {...attributes}
      {...listeners}
    >
      <TaskCard {...task} />
    </Box>
  );
}
