import { Box, Stack, Typography } from "@mui/material";
import NoResultsIcon from "@/modules/shared/icons/NoResultsIcon";
/* import { UserContext, useUserContext } from "@/modules/accounts/UserContext"; */
import Head from "next/head";
import { getPageTitle } from "@/modules/shared/utils/getPageTitle";

export default function Home() {
  const user = {
    firstName: "Ahmed",
  };

  return (
    <>
      <Head>
        <title>{getPageTitle("Home")}</title>
      </Head>

      <Stack spacing={4} height="100%">
        <div>
          <Typography component="h1" variant="h5" mb={0.5}>
            Welcome back, {user.firstName} 👋
          </Typography>

          <Typography color="text.secondary" mb={0.5}>
            Here are some quick updates about your activity today.
          </Typography>
        </div>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexGrow={1}
        >
          <Stack alignItems="center" spacing={5}>
            <NoResultsIcon />

            <Typography>You are caught up! Keep up the amazing work</Typography>
          </Stack>
        </Box>
      </Stack>
    </>
  );
}
