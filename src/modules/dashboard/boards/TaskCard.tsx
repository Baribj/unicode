import { Task } from "@/schema/Task";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Tooltip,
  Typography,
} from "@mui/material";
import Person2RoundedIcon from "@mui/icons-material/Person2Rounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import getDisplayedDate from "@/modules/shared/utils/getDisplayedDate";
import { useUpdatingTaskStatusContext } from "./TaskRow";

function truncateText(text: string) {
  return text.length > 120 ? text.substring(0, 120) + "..." : text;
}

export default function TaskCard({
  id,
  title,
  description,
  status,
  assignee,
  createdAt,
}: Task) {
  const loading = useUpdatingTaskStatusContext();

  return (
    <Box p={3} bgcolor="background.secondary" borderRadius={2}>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <Person2RoundedIcon fontSize="small" color="info" />

          <Typography variant="caption" color="text.secondary">
            {assignee?.name || "No Assignee"}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <ScheduleRoundedIcon fontSize="small" color="secondary" />
          <Typography variant="caption" color="text.secondary">
            {getDisplayedDate(createdAt)}
          </Typography>
        </Box>
      </Box>

      <Tooltip title={title}>
        <Typography
          noWrap
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "fit-content",
            mb: 1,
          }}
        >
          {title}
        </Typography>
      </Tooltip>

      <Typography variant="body2" color="text.secondary" mb={3}>
        {truncateText(description)}
      </Typography>

      <Box
        display="flex"
        justifyContent={
          loading || status === "completed" ? "space-between" : "end"
        }
        alignItems="center"
      >
        {loading && <CircularProgress size={25} />}

        {status === "completed" && !loading && (
          <div className={`${status}`}>
            <div className="checkmark"></div>
          </div>
        )}

        <Button
          variant="outlined"
          disabled /* won't implement this functionality for now*/
        >
          Assign to me
        </Button>
      </Box>
    </Box>
  );
}
