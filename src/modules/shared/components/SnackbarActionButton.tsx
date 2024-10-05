import { IconButton } from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export default function SnackbarActionButton(closeFunction: () => void) {
  return (
    <IconButton
      aria-label="delete"
      size="small"
      onClick={() => {
        closeFunction();
      }}
      sx={{
        color: "white",
        py: 0,
      }}
    >
      <CloseRoundedIcon fontSize="inherit" />
    </IconButton>
  );
}
