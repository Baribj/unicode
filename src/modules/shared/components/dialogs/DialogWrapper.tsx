/**
 *
 * This is a low-level component, avoid using directly
 *
 */

import Dialog, { DialogProps } from "@mui/material/Dialog";
import { forwardRef } from "react";

export interface DialogWrapperProps extends DialogProps {
  maxWidth?: "sm" | "md" | "lg" | "xl";
  description?: string;
}

const DialogWrapper = forwardRef<HTMLDivElement, DialogWrapperProps>(
  (props, ref) => {
    const { PaperProps, maxWidth = "sm", children, ...rest } = props;

    return (
      <Dialog
        fullWidth
        maxWidth={maxWidth}
        ref={ref}
        /* scroll="paper" */
        PaperProps={{
          ...PaperProps,
          elevation: 0,
          sx: {
            backgroundColor: "background.glassmorphism",
            backdropFilter: "blur(4px)",
            borderRadius: 2,
          },
        }}
        {...rest}
      >
        {children}
      </Dialog>
    );
  }
);

DialogWrapper.displayName = "DialogWrapper";

export default DialogWrapper;
