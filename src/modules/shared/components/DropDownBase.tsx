import Popper, { PopperPlacementType } from "@mui/material/Popper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Paper from "@mui/material/Paper";
import { ReactNode } from "react";

/**
 *
 * This is a low-level component, avoid using directly
 *
 */

interface Props {
  anchorEl: HTMLElement | null;
  handleClose: (event: MouseEvent | TouchEvent) => void;
  position: PopperPlacementType;
  children: ReactNode;
}

export default function DropDownBase({
  anchorEl,
  handleClose,
  position = "bottom-start",
  children,
}: Props) {
  const open = Boolean(anchorEl);

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement={position}
      modifiers={[
        {
          name: "offset",
          options: {
            offset: [0, 5],
          },
        },
      ]}
      sx={{ zIndex: "modal" }}
    >
      <ClickAwayListener onClickAway={handleClose}>
        <Paper
          /*  elevation={3} */
          sx={{
            minWidth: "150px",
            p: 2,
            borderRadius: 1,
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          {children}
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
}
