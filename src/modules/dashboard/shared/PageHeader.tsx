import { Breadcrumbs, Typography, Box, Stack } from "@mui/material";

import { Link as MuiLink } from "@mui/material";
import NextLink from "next/link";
import { useRouter } from "next/router";
import NavigateBeforeRoundedIcon from "@mui/icons-material/NavigateBeforeRounded";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HighlightedIcon from "@/modules/shared/components/HighlightedIcon";
import { LoadingButton, LoadingButtonProps } from "@mui/lab";

interface PageHeaderButtonProps extends LoadingButtonProps {
  text: string;
}
export interface PageHeaderProps {
  title: string;
  excludedLinks?: string[];
  loadingButtonProps?: PageHeaderButtonProps;
}

function getPagePath(pages: string[], index: number) {
  return "/" + pages.slice(0, index + 1).join("/");
}

function getBackPagePath(
  pathname: string,
  excludedLinks: string[] | undefined
) {
  const pathArray = pathname
    .split("/")
    .filter((page) => page)
    .slice(0, -1);

  if (excludedLinks?.includes(pathArray[pathArray.length - 1])) {
    return getBackPagePath(pathArray.join("/"), excludedLinks);
  } else {
    return "/" + pathArray.join("/");
  }
}

export default function PageHeader({
  title,
  excludedLinks,
  loadingButtonProps,
}: PageHeaderProps) {
  const router = useRouter();

  const pages = router.asPath.split("/").filter((page) => page);

  return (
    <Box
      display="flex"
      mb={{
        xs: 3,
        md: 6,
      }}
      gap={3}
      flexDirection={{
        xs: "column",
        sm: "row",
      }}
      justifyContent={{
        xs: "start",
        sm: "space-between",
      }}
      alignItems={{
        xs: "start",
        sm: "center",
      }}
    >
      <Stack direction="row" spacing={2}>
        <Box display="flex" alignItems="center">
          <HighlightedIcon
            Icon={NavigateBeforeRoundedIcon}
            link={getBackPagePath(router.pathname, excludedLinks)}
          />
        </Box>

        <Box>
          <Typography component="h1" variant="h5" mb={1}>
            {title}
          </Typography>

          <Breadcrumbs
            maxItems={5}
            separator={<NavigateNextIcon fontSize="small" />}
            sx={{
              typography: "body2",
              "& .MuiBreadcrumbs-ol": {
                gap: 1,
              },
              "& .MuiBreadcrumbs-separator": {
                margin: 0,
                marginLeft: -0.5,
              },
            }}
          >
            {pages.map((page, index) => {
              const displayName = (page.charAt(0).toUpperCase() + page.slice(1))
                .split("-")
                .join(" ");

              if (index < pages.length - 1 && !excludedLinks?.includes(page)) {
                return (
                  <MuiLink
                    key={page}
                    component={NextLink}
                    href={getPagePath(pages, index)}
                  >
                    {displayName}
                  </MuiLink>
                );
              } else {
                return (
                  <Typography key={page} color="text.primary" variant="body2">
                    {displayName}
                  </Typography>
                );
              }
            })}
          </Breadcrumbs>
        </Box>
      </Stack>

      {loadingButtonProps && (
        <LoadingButton
          {...loadingButtonProps}
          component={loadingButtonProps.href ? NextLink : LoadingButton}
          variant="contained"
          size="large"
          disableElevation
          sx={{
            width: {
              xs: "100%",
              sm: "auto",
            },
          }}
        >
          {loadingButtonProps.text}
        </LoadingButton>
      )}
    </Box>
  );
}
