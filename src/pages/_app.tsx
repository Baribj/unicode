import DashboardLayout from "@/modules/dashboard/shared/Layout";
import useMuiBreakPoints from "@/modules/shared/hooks/useMuiBreakPoints";
import Loading from "@/modules/shared/Loading";
import CustomThemeProvider from "@/modules/shared/theme/CustomThemeProvider";
import "@/styles/globals.css";
import { CssBaseline } from "@mui/material";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { SnackbarProvider } from "notistack";
import { createContext, ReactNode } from "react";

export const muiBreakPointsContext = createContext({ code: "xl", value: 1920 }); // Context so we don't end up attaching too many events to the DOM

function getLayout(page: ReactNode, pathName: string) {
  if (pathName.includes("/dashboard")) {
    return <DashboardLayout>{page}</DashboardLayout>;
  } else {
    return page;
  }
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const currentBreakPoint = useMuiBreakPoints();

  return (
    <>
      <CustomThemeProvider>
        <CssBaseline enableColorScheme>
          <SnackbarProvider maxSnack={3}>
            <muiBreakPointsContext.Provider value={currentBreakPoint}>
              <Head>
                <meta
                  name="viewport"
                  content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
              </Head>

              <Loading />

              {getLayout(<Component {...pageProps} />, router.pathname)}
            </muiBreakPointsContext.Provider>
          </SnackbarProvider>
        </CssBaseline>
      </CustomThemeProvider>
    </>
  );
}
