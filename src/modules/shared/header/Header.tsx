import { useContext, useState } from "react";
import { Box } from "@mui/system";
import { IconButton, Stack, Typography } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import Person3RoundedIcon from "@mui/icons-material/Person3Rounded";
import MenuIcon from "@mui/icons-material/Menu";
import { muiBreakPointsContext } from "@/pages/_app";
import SingleSelectDropDown from "../components/SingleSelectDropDown";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import useFetch from "../hooks/useFetch";
import { useRouter } from "next/router";
import BasicDialog from "../components/dialogs/BasicDialog";
import { ThemeModeContext } from "../theme/CustomThemeProvider";
import { setLocalStorageThemeMode } from "../utils/localStorageHelpers";
import { signOut } from "next-auth/react";
import { useDispatch } from "react-redux";
import { clearUser } from "@/features/user/userSlice";

interface Props {
  setShowTempSidebar: (newState: boolean) => void;
  sidebarBreakPoint: number;
}

export default function Header({
  setShowTempSidebar,
  sidebarBreakPoint,
}: Props) {
  const { themeMode, setThemeMode } = useContext(ThemeModeContext);

  const [isSigningOut, setIsSigningOut] = useState(false);

  const router = useRouter();

  const dispatch = useDispatch();

  const [accountButtonElement, setAccountButtonElement] =
    useState<HTMLButtonElement | null>(null);

  const [showLogoutConfirmationDialog, setShowLogoutConfirmationDialog] =
    useState(false);

  const currentBreakPoint = useContext(muiBreakPointsContext);
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <div>
        {currentBreakPoint.value < sidebarBreakPoint && (
          <IconButton
            onClick={() => {
              setShowTempSidebar(true);
            }}
          >
            <MenuIcon color="primary" />
          </IconButton>
        )}
      </div>

      <Stack direction="row" spacing={0.5} alignItems="center">
        <IconButton
          aria-label="mode"
          onClick={() => {
            setThemeMode(themeMode === "light" ? "dark" : "light");
            setLocalStorageThemeMode(themeMode === "light" ? "dark" : "light");
          }}
        >
          {themeMode === "light" ? (
            <DarkModeRoundedIcon color="primary" />
          ) : (
            <LightModeIcon color="primary" />
          )}
        </IconButton>

        <IconButton
          aria-label="settings"
          onClick={(e) => {
            setAccountButtonElement(e.currentTarget);
          }}
        >
          <Person3RoundedIcon color="primary" />
        </IconButton>

        <SingleSelectDropDown
          anchorEl={accountButtonElement}
          options={[
            {
              id: "signOut",
              title: "Sign out",
              icon: <LogoutOutlinedIcon color="error" />,
              titleProps: { color: "error.main" },
            },
          ]}
          position="bottom-end"
          handleSelect={() => {
            setShowLogoutConfirmationDialog(true);
          }}
          handleClose={() => {
            setAccountButtonElement(null);
          }}
        />

        <BasicDialog
          title="Sign out confirmation"
          open={showLogoutConfirmationDialog}
          onClose={() => {
            setShowLogoutConfirmationDialog(false);
          }}
          color="error"
          confirmButtonProps={{
            onClick: () => {
              dispatch(clearUser());
              setIsSigningOut(true);
              signOut({ callbackUrl: "/accounts/log-in" });
              setAccountButtonElement(null);
            },
            loading: isSigningOut,
          }}
        >
          <Typography variant="body2" color="text.primary">
            Are you sure you want to sign out of your account?
          </Typography>
        </BasicDialog>
      </Stack>
    </Box>
  );
}
