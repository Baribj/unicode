import { Box } from "@mui/system";

import { SvgIconProps } from "@mui/material";

import { useTheme, Theme } from "@mui/material/styles";

import { lighten, darken } from "@mui/material/styles";

import { ComponentType, useMemo } from "react";

import NextLink from "next/link";
import { ThemeExtendedColor } from "../theme/miraTheme";

export interface HighlightedIconComponentProps {
  Icon: ComponentType<SvgIconProps>;
  size?: "small" | "medium";
  color?: ThemeExtendedColor;
  clickable?: boolean;
  onClick?: () => void;
  borderRadius?: string;
}

function getColor(color: ThemeExtendedColor, theme: Theme): string {
  if (color[0] !== "#") return theme.palette[color].main;
  else return color;
}

/* Usage:
 *
 * Either pass a link, or onClick call back. Don't pass both
 *
 */

function HighlightedIconComponent({
  Icon,
  color = "primary",
  size = "medium",
  clickable,
  onClick,
  borderRadius,
}: HighlightedIconComponentProps) {
  const theme = useTheme();

  const colorCode = useMemo(() => {
    return getColor(color, theme);
  }, [color, theme]);

  return (
    <Box
      onClick={() => {
        if (onClick) onClick();
      }}
      bgcolor={
        theme.palette.mode === "light" ? lighten(colorCode, 0.9) : undefined
      }
      border={1}
      borderColor={
        theme.palette.mode === "dark"
          ? darken(colorCode, 0.6)
          : lighten(colorCode, 0.9)
      }
      p={size === "medium" ? 1.5 : 0.5}
      borderRadius={borderRadius ? borderRadius : size === "medium" ? 2 : 1}
      className={clickable ? "clickable" : ""}
      sx={{
        width: "max-content",
        "&.clickable:hover": {
          borderColor:
            theme.palette.mode === "dark"
              ? darken(colorCode, 0.5)
              : lighten(colorCode, 0.5),
          cursor: "pointer",
        },
      }}
    >
      <Icon
        fontSize={size}
        sx={{
          display: "block",
          color: colorCode,
        }}
      />
    </Box>
  );
}

interface Props extends HighlightedIconComponentProps {
  link?: string;
}

export default function HighlightedIcon({
  link,
  onClick,
  ...restProps
}: Props) {
  const clickable = Boolean(link || onClick);

  if (link) {
    return (
      <NextLink href={link}>
        <HighlightedIconComponent
          {...restProps}
          clickable={clickable}
          onClick={onClick} // might need it for events tracking later
        />
      </NextLink>
    );
  } else {
    return (
      <HighlightedIconComponent
        {...restProps}
        clickable={clickable}
        onClick={onClick}
      />
    );
  }
}
