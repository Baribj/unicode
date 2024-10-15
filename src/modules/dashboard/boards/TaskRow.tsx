import React, { createContext, useContext, useEffect, useState } from "react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import { Box, Grid2 } from "@mui/material";
import { Task, TaskStatus } from "@/schema/Task";
import DraggableTaskCard from "./DraggableTaskCard";
import { boardColumns } from "@/pages/dashboard/workspace/boards/[id]";
import useFetch from "@/modules/shared/hooks/useFetch";

interface Props {
  task: Task;
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
}

const UpdatingTaskStatusContext = createContext(false);

export function useUpdatingTaskStatusContext() {
  return useContext(UpdatingTaskStatusContext);
}

export default function TaskRow({ task, updateTaskStatus }: Props) {
  const { makeRequest, loading } = useFetch();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const fromContainer = active.data.current?.containerId;
    const toContainer = over.data.current?.containerId;

    if (fromContainer !== toContainer) {
      updateTaskStatus(task.id, over.data.current?.containerId);

      makeRequest(
        `tasks/${active.id}`,
        {},
        { method: "PATCH", body: { status: over.data.current?.containerId } }
      );
    }
  };

  if (!isClient) {
    return null;
  } else {
    return (
      <DndContext onDragEnd={handleDragEnd}>
        <Grid2 container spacing={3}>
          {boardColumns.map((column, index) => {
            return (
              <Grid2 key={column.id} size={{ xs: 12 / boardColumns.length }}>
                <Box
                  sx={{
                    height: "100%",
                    borderLeft: index > 0 ? 1 : 0,
                    borderColor: "divider",
                    marginLeft: -2,
                    px: 2,
                    py: 3,
                  }}
                >
                  <UpdatingTaskStatusContext.Provider value={loading}>
                    <Container
                      id={column.id}
                      task={task.status === column.id ? task : null}
                    />
                  </UpdatingTaskStatusContext.Provider>
                </Box>
              </Grid2>
            );
          })}
        </Grid2>
      </DndContext>
    );
  }
}

interface ContainerProps {
  id: string;
  task: Task | null;
}

function Container({ id, task }: ContainerProps) {
  const loading = useUpdatingTaskStatusContext();

  const { isOver, setNodeRef } = useDroppable({
    id,
    data: { containerId: id },
  });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        height: "100%",
        borderRadius: 2,
        borderColor: "divider",
        borderStyle: "dashed",
        borderWidth: isOver ? 1 : 0,
        pointerEvents: loading ? "none" : "all", // quick hack, pointerEvents makes events tracking awkward
        opacity: loading ? 0.5 : 1,
      }}
    >
      {task && <DraggableTaskCard task={task} containerId={id} />}
    </Box>
  );
}
