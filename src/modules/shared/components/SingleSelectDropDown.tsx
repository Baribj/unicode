import {
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  PopperPlacementType,
} from "@mui/material";
import { ReactNode } from "react";
import Link from "next/link";
import DropDownBase from "./DropDownBase";

export interface SelectOption {
  url?: string;
  icon?: ReactNode;
  loading?: boolean;
  titleProps?: {
    [key: string]: any;
  };
  [key: string]: any;
}

interface Props<T extends SelectOption> {
  options: T[];
  uniqueKey?: keyof T;
  labelKey?: keyof T;
  anchorEl: HTMLElement | null;
  handleClose: (event: MouseEvent | TouchEvent) => void;
  handleSelect: (option: T) => void;
  position?: PopperPlacementType;
}

export default function SingleSelectDropDown<T extends SelectOption>({
  options,
  anchorEl,
  handleClose,
  handleSelect,
  position = "bottom",
  uniqueKey = "id",
  labelKey = "title",
}: Props<T>) {
  return (
    <DropDownBase
      anchorEl={anchorEl}
      handleClose={handleClose}
      position={position}
    >
      <List
        sx={{
          m: -2 /*Counters padding on DropDown since List already comes with padding*/,
        }}
      >
        {options.map((option: T) => {
          const linkProps = option.url
            ? { href: option.url, LinkComponent: Link }
            : {};

          return (
            <ListItem
              key={option[uniqueKey]}
              disablePadding
              onClick={() => {
                handleSelect(option);
              }}
            >
              <ListItemButton {...linkProps} disabled={option.loading}>
                {option.icon && !option.loading && (
                  <ListItemIcon sx={{ minWidth: "24px", mr: 2 }}>
                    {option.icon}
                  </ListItemIcon>
                )}

                {option.loading && (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="24px"
                    mr={2}
                  >
                    <CircularProgress size={15} />
                  </Box>
                )}

                <ListItemText
                  primaryTypographyProps={{
                    sx: {
                      typography: "caption",
                      pr: 4,
                      ...option.titleProps, // should we check here if titleProps is undefined ? since TS is not throwing an error although the property is defined as optional, I am going to leave it like this.
                    },
                  }}
                  primary={option[labelKey]}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </DropDownBase>
  );
}
