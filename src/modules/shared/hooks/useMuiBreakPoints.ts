import { useState, useEffect } from "react";

export default function useMuiBreakPoints() {
  // Initialize state with undefined width/height so server and client renders match .. Update: I removed the undefined, fingers crossed this doesn't break anything.
  const [breakPoint, setBreakPoint] = useState<{ code: string; value: number }>(
    { code: "xl", value: 1536 }
  );

  useEffect(() => {
    function handleResize() {
      let currentBreakPoint;

      if (window.innerWidth < 600) {
        currentBreakPoint = { code: "xs", value: 0 };
      } else if (window.innerWidth < 900) {
        currentBreakPoint = { code: "sm", value: 600 };
      } else if (window.innerWidth < 1200) {
        currentBreakPoint = { code: "md", value: 900 };
      } else if (window.innerWidth < 1536) {
        currentBreakPoint = { code: "lg", value: 1200 };
      } else {
        currentBreakPoint = { code: "xl", value: 1536 };
      }

      setBreakPoint(currentBreakPoint);
    }

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return breakPoint;
}
