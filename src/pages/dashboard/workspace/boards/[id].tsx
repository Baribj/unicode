import PageHeader from "@/modules/dashboard/shared/PageHeader";
import { getPageTitle } from "@/modules/shared/utils/getPageTitle";
import { Board } from "@/schema/Board";
import { Box, Divider, Grid2, Typography } from "@mui/material";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import Person2RoundedIcon from "@mui/icons-material/Person2Rounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import getDisplayedDate from "@/modules/shared/utils/getDisplayedDate";
import { getSession } from "next-auth/react";
import TaskRow from "@/modules/dashboard/boards/TaskRow";
import { Task, TaskStatus } from "@/schema/Task";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useEffect, useState } from "react";
import TaskDialog from "@/modules/dashboard/boards/TaskDialog";
import { ApiSuccessResponse } from "@/schema/ApiResponse";
import { socket } from "@/services/socket";
import { Socket } from "socket.io-client";
import { closeSnackbar, enqueueSnackbar } from "notistack";
import SnackbarActionButton from "@/modules/shared/components/SnackbarActionButton";

interface Props {
  board: Board;
  tasks: Task[];
}

export interface BoardColumn {
  id: TaskStatus;
  title: string;
  color: string;
}

export const boardColumns: BoardColumn[] = [
  { id: "toDo", title: "To Do", color: "primary.main" },
  { id: "inProgress", title: "In Progress", color: "secondary.main" },
  { id: "blocked", title: "Blocked", color: "error.main" },
  { id: "completed", title: "Completed", color: "success.main" },
];

export default function BoardPage({ board, tasks: passedTasks }: Props) {
  const [showCreateTaskDialog, setShowCreateTaskDialog] = useState(false);

  const [tasks, setTasks] = useState(passedTasks);

  useEffect(() => {
    setTasks(passedTasks);
  }, [passedTasks]);

  function updateTaskStatus(taskId: string, newStatus: TaskStatus) {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          return { ...task, status: newStatus };
        } else return task;
      })
    );
  }

  useEffect(() => {
    const connectedSocket = socket as Socket;

    function onTaskStatusChange(value: any) {
      updateTaskStatus(value.taskId, value.newStatus);

      const statusTitle = boardColumns.find(
        (status) => status.id === value.newStatus
      )!.title;

      enqueueSnackbar(
        `Task #${value.taskId} status changed to ${statusTitle}`,
        {
          variant: "success",
          autoHideDuration: 4000,
          action: (snackBarKey) => {
            return SnackbarActionButton(() => {
              closeSnackbar(snackBarKey);
            });
          },
          style: {
            flexWrap: "nowrap",
          },
        }
      );
    }

    connectedSocket.on("task", onTaskStatusChange);

    return () => {
      connectedSocket.off("task", onTaskStatusChange);
    };
  }, []);

  return (
    <>
      <Head>
        <title>{getPageTitle(board.title)}</title>
      </Head>

      <PageHeader
        title={board.title}
        excludedLinks={["workspace"]}
        loadingButtonProps={{
          text: "Add task",
          startIcon: <AddRoundedIcon />,
          onClick: () => {
            setShowCreateTaskDialog(true);
          },
        }}
      />

      <Box p={3} borderRadius={3} bgcolor="background.secondary" mb={4}>
        <Box display="flex" alignItems="center" gap={3} mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Person2RoundedIcon fontSize="small" color="info" />

            <Typography variant="caption" color="text.secondary">
              {board.users[0].name}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <ScheduleRoundedIcon fontSize="small" color="secondary" />
            <Typography variant="caption" color="text.secondary">
              {getDisplayedDate(board.createdAt)}
            </Typography>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary">
          {board.description}
        </Typography>
      </Box>

      <Box sx={{ overflowX: "auto" }}>
        <Box sx={{ minWidth: "1050px" }}>
          <Grid2 container spacing={3} mb={3}>
            {boardColumns.map((column) => {
              return (
                <Grid2 key={column.id} size={{ xs: 12 / boardColumns.length }}>
                  <Box
                    bgcolor="background.secondary"
                    borderRadius={2}
                    p={2}
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >
                    <Divider
                      orientation="vertical"
                      flexItem
                      sx={{
                        borderRightWidth: 4,
                        borderColor: column.color,
                      }}
                    />

                    <Typography>{column.title}</Typography>
                  </Box>
                </Grid2>
              );
            })}
          </Grid2>

          {tasks.map((task) => {
            return (
              <Box key={task.id} borderBottom={1} borderColor="divider">
                <TaskRow task={task} updateTaskStatus={updateTaskStatus} />
              </Box>
            );
          })}
        </Box>
      </Box>

      {showCreateTaskDialog && (
        <TaskDialog
          title="Create Task"
          board={board}
          onClose={() => {
            setShowCreateTaskDialog(false);
          }}
        />
      )}
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const session = await getSession(context);

    if (!session) {
      return {
        redirect: {
          destination: "/accounts/log-in",
          permanent: false,
        },
      };
    }

    const [boardResponse, tasksResponse] = await Promise.all([
      fetch(process.env.NEXT_PUBLIC_API_URL + "boards/" + context.query.id),

      fetch(
        process.env.NEXT_PUBLIC_API_URL + "tasks/?boardId=" + context.query.id
      ),
    ]);

    if (!boardResponse.ok || !tasksResponse.ok) {
      throw new Error();
    }

    const [boardData, tasksData]: [
      ApiSuccessResponse<Board>,
      ApiSuccessResponse<Task[]>
    ] = await Promise.all([boardResponse.json(), tasksResponse.json()]);

    return {
      props: {
        board: boardData.result,
        tasks: tasksData.result,
        user: session.user,
      },
    };
  } catch (err) {
    throw err;
  }
}
