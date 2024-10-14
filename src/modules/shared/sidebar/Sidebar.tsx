import {
  Avatar,
  Drawer,
  Typography,
  IconButton,
  SvgIconProps,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import SidebarItem from "./SidebarItem";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { useState, useContext, useEffect } from "react";
import { muiBreakPointsContext } from "@/pages/_app";
import { ComponentType } from "react";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import { useRouter } from "next/router";
import { useUserContext } from "@/modules/accounts/UserContext";
import DashboardIcon from "@mui/icons-material/Dashboard";

interface Props {
  sidebarWidth: string;
  showTempSidebar: boolean;
  setShowTempSidebar: (newState: boolean) => void;
  sidebarBreakPoint: number;
}

export interface Tab {
  title: string;
  Icon: ComponentType<SvgIconProps>;
  url: string;
  subTabs?: { title: string; url: string }[];
}

const generalItems: Tab[] = [
  {
    title: "Home",
    Icon: HomeRoundedIcon,
    url: "/dashboard",
  },
];

const taskManagementItems: Tab[] = [
  {
    title: "Boards",
    Icon: DashboardIcon,
    url: "/dashboard/workspace/boards",
  },
];

const settingItems = [
  {
    title: "Account",
    Icon: ManageAccountsRoundedIcon,
    url: "/dashboard/settings/account",
  },
];

export default function Sidebar({
  sidebarWidth,
  showTempSidebar,
  setShowTempSidebar,
  sidebarBreakPoint,
}: Props) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("");

  const { user } = useUserContext();

  const currentBreakPoint = useContext(muiBreakPointsContext);

  function handleTabChange(tabUrl: string) {
    setShowTempSidebar(false);
    setActiveTab(tabUrl);
  }

  useEffect(() => {
    const allTabs = [...generalItems, ...taskManagementItems, ...settingItems];

    allTabs.forEach((tab) => {
      if (router.asPath.includes(tab.url)) {
        setActiveTab(tab.url);
      }
    });
  }, [router]);

  return (
    <Drawer
      sx={{
        width: sidebarWidth,
        "& .MuiDrawer-paper": {
          width: sidebarWidth,
          boxSizing: "border-box",
          backgroundColor: "background.secondary",
        },
      }}
      variant={
        currentBreakPoint.value < sidebarBreakPoint ? "temporary" : "permanent"
      }
      open={showTempSidebar}
      onClose={() => {
        setShowTempSidebar(false);
      }}
      anchor="left"
      elevation={0}
    >
      <>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={3}
          mb={5}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: "primary.main", borderRadius: 2 }}>
              {user?.name[0]}
            </Avatar>
            <div>
              <Typography>{user?.name}</Typography>
              <Typography
                variant="caption"
                component="p"
                color="text.secondary"
              >
                admin
              </Typography>
            </div>
          </Stack>

          {currentBreakPoint.value < sidebarBreakPoint && (
            <IconButton
              onClick={() => {
                setShowTempSidebar(false);
              }}
            >
              <MenuOpenIcon color="primary" />
            </IconButton>
          )}
        </Box>

        <Stack spacing={4}>
          <section>
            <Box px={3}>
              {generalItems.map((item) => {
                return (
                  <SidebarItem
                    key={item.title}
                    tab={item}
                    active={activeTab === item.url}
                    handleTabChange={handleTabChange}
                  />
                );
              })}
            </Box>
          </section>

          <section>
            <Box px={3}>
              <Typography variant="caption" component="p" mb={2}>
                Workspace
              </Typography>
              {taskManagementItems.map((item) => {
                return (
                  <SidebarItem
                    key={item.title}
                    tab={item}
                    active={activeTab === item.url}
                    handleTabChange={handleTabChange}
                  />
                );
              })}
            </Box>
          </section>

          <section>
            <Box px={3}>
              <Typography variant="caption" component="p" mb={2}>
                Settings
              </Typography>
              {settingItems.map((item) => {
                return (
                  <SidebarItem
                    key={item.title}
                    tab={item}
                    active={activeTab === item.url}
                    handleTabChange={handleTabChange}
                  />
                );
              })}
            </Box>
          </section>
        </Stack>
      </>
    </Drawer>
  );
}
