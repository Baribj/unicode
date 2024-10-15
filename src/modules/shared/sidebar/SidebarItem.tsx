import { Stack } from "@mui/system";
import { ButtonBase, Typography } from "@mui/material";
import { MouseEvent, useState, useMemo } from "react";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Link from "next/link";
import SingleSelectDropDown from "../components/SingleSelectDropDown";
import { Tab } from "./Sidebar";

interface Props {
  tab: Tab;
  active: boolean;
  handleTabChange: (itemTitle: string) => void;
}

export default function SidebarItem({ tab, active, handleTabChange }: Props) {
  const [tabElement, setTabElement] = useState<HTMLButtonElement | null>(null);

  const { Icon, title, url } = tab;

  const subTabs = useMemo(() => {
    return tab.subTabs?.map((tab) => {
      return {
        id: tab.title,
        ...tab,
      };
    });
  }, [tab.subTabs]);

  function buttonProps(
    url: string,
    subTabs?: { title: string; url: string }[]
  ) {
    if (!subTabs)
      return {
        href: url,
        LinkComponent: Link,
        onClick: () => {
          handleTabChange(url);
        },
      };
    else
      return {
        onClick: (e: MouseEvent<HTMLButtonElement>) => {
          setTabElement(e.currentTarget);
        },
      };
  }

  return (
    <>
      <ButtonBase
        {...buttonProps(url, subTabs)}
        className={`${active ? "active" : ""} ${tabElement ? "focused" : ""}`}
        sx={{
          display: "block",
          width: "100%",
          borderRadius: 2,
          p: 2,
          my: 1,
          cursor: "pointer",
          "&:hover, &.focused": {
            bgcolor: "background.tertiary",
          },
          "&.active": {
            bgcolor: "primary.main",
            color: "primary.contrastText",
            transition: "background 1s",
          },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" alignItems="center">
            <Icon fontSize="small" />
            <Typography variant="body2" ml={2}>
              {title}
            </Typography>
          </Stack>
          <KeyboardArrowRightIcon fontSize="small" />
        </Stack>
      </ButtonBase>

      {subTabs && (
        <SingleSelectDropDown
          options={subTabs}
          anchorEl={tabElement}
          handleClose={() => {
            setTabElement(null);
          }}
          handleSelect={() => {
            handleTabChange(url);
            setTabElement(null);
          }}
          position="left-start"
        />
      )}
    </>
  );
}
