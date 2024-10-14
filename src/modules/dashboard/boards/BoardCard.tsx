import { Board } from "@/schema/Board";
import { Box, Button, Chip, Divider, Tooltip, Typography } from "@mui/material";
import Link from "next/link";
import KeyboardDoubleArrowRightRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowRightRounded";
import { useMemo } from "react";

import Person2RoundedIcon from "@mui/icons-material/Person2Rounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import { getBoardTypeInfo } from "./utils/getBoardTypeTitle";
import getDisplayedDate from "@/modules/shared/utils/getDisplayedDate";

function truncateText(text: string) {
  return text.length > 120 ? text.substring(0, 120) + "..." : text;
}

export default function BoardCard({
  id,
  title,
  description,
  users,
  type,
  createdAt,
}: Board) {
  const tagProps = useMemo(() => {
    return getBoardTypeInfo(type);
  }, [type]);

  return (
    <Box
      p={3}
      bgcolor="background.secondary"
      borderRadius={2}
      display="flex"
      flexDirection="column"
      height="100%"
      justifyContent="space-between"
    >
      <div>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <Person2RoundedIcon fontSize="small" color="info" />

              <Typography variant="caption" color="text.secondary">
                {users[0].name}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <ScheduleRoundedIcon fontSize="small" color="secondary" />
              <Typography variant="caption" color="text.secondary">
                {getDisplayedDate(createdAt)}
              </Typography>
            </Box>
          </Box>

          <Chip
            {...tagProps}
            size="small"
            variant="outlined"
            sx={{
              borderRadius: 1,
            }}
          />
        </Box>

        <Tooltip title={title}>
          <Typography
            noWrap
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              width: "fit-content",
            }}
          >
            {title}
          </Typography>
        </Tooltip>

        <Divider sx={{ my: 2, width: "30%", borderColor: "primary.main" }} />

        <Typography variant="body2" color="text.secondary" mb={3}>
          {truncateText(description)}
        </Typography>
      </div>

      <Link
        href={`/dashboard/workspace/boards/${id}`}
        style={{ textDecoration: "none" }}
      >
        <Box display="flex" justifyContent="end">
          <Button
            variant="outlined"
            endIcon={<KeyboardDoubleArrowRightRoundedIcon />}
          >
            View
          </Button>
        </Box>
      </Link>
    </Box>
  );
}
