import { Board } from "@/schema/Board";
import { ChipProps } from "@mui/material";

interface BoardTagProps {
  label: string;
  color: ChipProps["color"];
}

export function getBoardTypeInfo(type: Board["type"]): BoardTagProps {
  switch (type) {
    case "product":
      return {
        label: "Product",
        color: "orange",
      };

    case "design":
      return {
        label: "Design",
        color: "pink",
      };

    case "engineering":
      return {
        label: "Engineering",
        color: "green",
      };

    case "qa":
      return {
        label: "Quality",
        color: "purple",
      };
  }
}
