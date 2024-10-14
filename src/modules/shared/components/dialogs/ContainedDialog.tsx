/**
 *
 * Use this dialog for complex dialogs that need scrolling with contained header and footer.
 *
 */

import DialogWrapper, { DialogWrapperProps } from "./DialogWrapper";
import { forwardRef } from "react";
import {
  Box,
  Button,
  ButtonProps,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
/* import ContainedDialogFooter from "./ContainedDialogFooter"; */
import { LoadingButton, LoadingButtonProps } from "@mui/lab";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export interface ContainedDialogProps extends DialogWrapperProps {
  title: string;
  onClose: () => void;
  color?: "primary" | "warning" | "error";
  description?: string;
  confirmButtonProps?: LoadingButtonProps & { label?: string };
  backButtonProps?: ButtonProps & { label?: string };
}

const ContainedDialog = forwardRef<HTMLDivElement, ContainedDialogProps>(
  (props, ref) => {
    const {
      title,
      description,
      onClose,
      color,
      confirmButtonProps,
      backButtonProps,
      children,
      ...rest
    } = props;

    return (
      <DialogWrapper ref={ref} onClose={onClose} {...rest}>
        <Box
          sx={{
            px: 3,
            py: 2,
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: "background.secondary",
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
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

        <Box p={3} sx={{ overflowY: "auto" }}>
          {children}
        </Box>

        <Box
          sx={{
            px: 3,
            py: 2,
            borderTop: 1,
            borderColor: "divider",
            bgcolor: "background.secondary",
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="end">
            {backButtonProps && (
              <Button
                variant="outlined"
                disableElevation
                sx={{ mr: 2 }}
                {...backButtonProps}
              >
                {backButtonProps?.label || "Cancel"}
              </Button>
            )}

            <LoadingButton
              variant="contained"
              disableElevation
              {...confirmButtonProps}
            >
              {confirmButtonProps?.label || "Confirm"}
            </LoadingButton>
          </Stack>
        </Box>
      </DialogWrapper>
    );
  }
);

ContainedDialog.displayName = "ScrollingDialog";

export default ContainedDialog;
