import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import { LinearProgress } from "@mui/material";

export default function Loading() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function handleStart() {
      setLoading(true);
    }

    function handleComplete() {
      setLoading(false);
    }

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router.events, router.asPath]);

  return loading ? (
    <Box position="fixed" width="100%" zIndex={999}>
      <LinearProgress />
    </Box>
  ) : null;
}
