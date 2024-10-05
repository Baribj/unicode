import { Box } from "@mui/material";

import Header from "@/modules/shared/header/Header";
import Sidebar from "@/modules/shared/sidebar/Sidebar";
import { ReactNode } from "react";
import { useContext, useState } from "react";
import { muiBreakPointsContext } from "@/pages/_app";

const sidebarWidth = "250px";
const sidebarBreakPoint = 1200; // sidebar will change from permanent to temporary at this breakpoint

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const currentBreakPoint = useContext(muiBreakPointsContext);

  const [showTempSidebar, setShowTempSidebar] = useState(false); // handling this state here causes the whole app to re-render. something to think about.

  return (
    <>
      <header
        style={{
          paddingLeft:
            currentBreakPoint.value < sidebarBreakPoint ? "0px" : sidebarWidth,
        }}
      >
        <Box
          display="flex"
          justifyContent="center"
          py={2}
          px={{ xs: 2, md: 5 }}
        >
          <Box flexGrow={1} maxWidth={1200}>
            <Header
              setShowTempSidebar={setShowTempSidebar}
              sidebarBreakPoint={sidebarBreakPoint}
            />
          </Box>
        </Box>
      </header>

      <aside>
        <Sidebar
          sidebarWidth={sidebarWidth}
          showTempSidebar={showTempSidebar}
          setShowTempSidebar={setShowTempSidebar}
          sidebarBreakPoint={sidebarBreakPoint}
        />
      </aside>

      <main
        style={{
          paddingLeft:
            currentBreakPoint.value < sidebarBreakPoint ? "0px" : sidebarWidth,
          flexGrow: "1",
        }}
      >
        <Box
          p={{ xs: 2, md: 5 }}
          width="100%"
          height="100%"
          display="flex"
          justifyContent="center"
        >
          <Box width="100%" maxWidth={1200}>
            {children}
          </Box>
        </Box>
      </main>
    </>
  );
}
