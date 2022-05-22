import { FC, useEffect, useState } from "react";
import { m } from "framer-motion";
import useStore from "../lib/store";
import { styled } from "../styles/stitches.config";

import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../components/primitives/Tooltip";

type Mode = "connect" | "host";

const Navigation: FC = () => {
  const mode = useStore((state) => state.mode);
  const setMode = useStore((state) => state.setMode);

  const Item: FC<{ name: Mode; icon: string }> = ({ name, icon }) => {
    const StyledTrigger = styled(TooltipTrigger, {
      all: "unset",
      background: "none",
      border: "none",
      width: "56px",
      height: "56px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      userSelect: "none",
      borderRadius: "28px",
      variants: {
        active: {
          true: {
            backgroundColor: "$secondaryContainer",
          },
        },
      },
    });

    /*
    backgroundColor: active
        ? "var(--secondaryContainer)"
        : "var(--surfaceVariant)",
    color: active
        ? "var(--onSecondaryContainer)"
        : "var(--onSurfaceVariant)",
    margin: "0.5rem 0",
    padding: "0.3rem 0.5rem",
    borderRadius: "6px",
    */

    const StyledContent = styled(TooltipContent, {
      variants: {
        active: {
          true: {
            backgroundColor: "$secondaryContainer",
            color: "$onSecondaryContainer",
          },
          false: {
            backgroundColor: "$surfaceVariant",
            color: "$onSurfaceVariant",
          },
        },
      },
    });

    const IconWrapper = styled("span", {
      fontSize: "24px",
      variants: {
        active: {
          true: {
            color: "$onSecondaryContainer",
          },
          false: {
            color: "$onSurfaceVariant",
          },
        },
      },
    });

    const active = mode === name;
    return (
      <Tooltip delayDuration={400}>
        <StyledTrigger
          active={active}
          onClick={() => {
            setMode(name);
          }}
        >
          <IconWrapper className="material-symbols-outlined" active={active}>
            {icon}
          </IconWrapper>
        </StyledTrigger>
        <StyledContent
          active={active}
          side="left"
          sideOffset={6}
          align="center"
          alignOffset={8}
        >
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            {name}
          </m.div>
        </StyledContent>
      </Tooltip>
    );
  };

  return (
    <nav
      css={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        width: "80px",
        alignItems: "center",
      }}
    >
      <Item name="connect" icon="screen_share" />
      <Item name="host" icon="visibility" />
    </nav>
  );
};

export default Navigation;
