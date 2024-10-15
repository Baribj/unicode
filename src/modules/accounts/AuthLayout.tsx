import {
  Box,
  Container,
  Grid2,
  IconButton,
  Stack,
  Typography,
  useTheme,
  Link as MuiLink,
} from "@mui/material";
import { useMemo } from "react";
import UnicodeLogo from "../shared/icons/UnicodeLogo";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import NextLink from "next/link";
import SignUpForm from "./SignUpForm";
import LoginForm from "./LoginForm";

export type AuthPage = "sign-up" | "log-in";

interface Props {
  page: AuthPage;
}

function getPageMetaData(page: AuthPage) {
  switch (page) {
    case "sign-up":
      return {
        title: "Sign up",
        description:
          "You are one step away from re-defining how you manage your tasks.",
      };

    case "log-in":
      return {
        title: "Log in",
        description: "Welcome back, let's continue your journey.",
      };
  }
}

export default function AuthLayout({ page }: Props) {
  const theme = useTheme();

  const pageMetaData = useMemo(() => {
    return getPageMetaData(page);
  }, [page]);

  return (
    <Container sx={{ minHeight: "100%", py: 3 }}>
      <Box
        display="flex"
        minHeight="100%"
        alignItems="center"
        justifyContent="center"
      >
        <Grid2 container justifyContent="center" flexGrow={1}>
          <Grid2 size={{ xs: 0, md: 5 }}> </Grid2>

          <Grid2 size={{ xs: 12, sm: 10, md: 6, lg: 5 }} minHeight={600}>
            <Box
              sx={{
                p: 4,
                height: "100%",
                borderRadius: 3,
                backgroundColor: "background.secondary",
              }}
            >
              <Stack justifyContent="space-between" sx={{ height: "100%" }}>
                <Box mb={3}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <a
                      href="https://www.unicodesolutions.co/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <UnicodeLogo themeMode={theme.palette.mode} />
                    </a>

                    <IconButton href="https://www.unicodesolutions.co/">
                      <CloseRoundedIcon />
                    </IconButton>
                  </Stack>
                </Box>

                <Stack spacing={4}>
                  <div>
                    <Typography variant="h4" mb={1}>
                      {pageMetaData.title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      {pageMetaData.description}
                    </Typography>
                  </div>

                  {page === "sign-up" ? <SignUpForm /> : <LoginForm />}
                </Stack>

                <Box mt={3}>
                  {page === "sign-up" ? (
                    <Box display="flex" justifyContent="center">
                      <Typography variant="body2" color="text.secondary">
                        Already have an account?
                        <MuiLink
                          component={NextLink}
                          variant="body2"
                          href={"/accounts/log-in"}
                          ml={0.75}
                          sx={{ textDecoration: "none" }}
                        >
                          Log In
                        </MuiLink>
                      </Typography>
                    </Box>
                  ) : (
                    <Box display="flex" justifyContent="center" mb={2}>
                      <Typography variant="body2" color="text.secondary">
                        Don{"'"}t have an account yet?
                        <MuiLink
                          component={NextLink}
                          variant="body2"
                          href="/accounts/sign-up"
                          ml={0.75}
                          sx={{ textDecoration: "none" }}
                        >
                          Join
                        </MuiLink>
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Stack>
            </Box>
          </Grid2>
        </Grid2>
      </Box>
    </Container>
  );
}
