/**
 *
 * This is a low-level component, avoid using directly
 *
 */

import { Typography } from "@mui/material";
import { Box, BoxProps } from "@mui/system";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import IconButton from "@mui/material/IconButton";

export interface SimpleDialogHeaderProps {
  title: string;
  onClose: () => void;
  color?: "primary" | "warning" | "error";
  description?: string;
  BoxProps?: BoxProps;
}

export default function SimpleDialogHeader({
  title,
  onClose,
  color,
  description,
  BoxProps,
}: SimpleDialogHeaderProps) {
  return (
    <Box {...BoxProps}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h6" color={color}>
          {title}
        </Typography>

        <IconButton onClick={onClose}>
          <CloseRoundedIcon />
        </IconButton>
      </Box>

      {description && (
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      )}
    </Box>
  );
}
