/**
 *
 * Use this component for simple dialogs that won't scroll. Confirmation and information dialogs are a great fit.
 */

import { forwardRef } from "react";
import { Stack, Box } from "@mui/material";
import { LoadingButton, LoadingButtonProps } from "@mui/lab";
import DialogWrapper, { DialogWrapperProps } from "./DialogWrapper";
import SimpleDialogHeader from "./SimpleDialogHeader";

interface BasicDialogProps extends DialogWrapperProps {
  title: string;
  onClose: () => void;
  confirmButtonProps?: LoadingButtonProps & { label?: string };
  color?: "primary" | "warning" | "error";
  description?: string;
}

const BasicDialog = forwardRef<HTMLDivElement, BasicDialogProps>(
  (props, ref) => {
    const {
      title,
      description,
      confirmButtonProps,
      onClose,
      color,
      children,
      ...rest
    } = props;

    return (
      <DialogWrapper ref={ref} onClose={onClose} {...rest}>
        <Box p={3}>
          <SimpleDialogHeader
            title={title}
            onClose={onClose}
            BoxProps={{ mb: 2 }}
            color={color}
            description={description}
          />

          {children}

          {confirmButtonProps && (
            <Stack direction="row" spacing={2} justifyContent="end" mt={2}>
              <LoadingButton
                variant="outlined"
                color={color}
                {...confirmButtonProps}
              >
                {confirmButtonProps?.label || "Confirm"}
              </LoadingButton>
            </Stack>
          )}
        </Box>
      </DialogWrapper>
    );
  }
);

BasicDialog.displayName = "ConfirmationDialog";

export default BasicDialog;
