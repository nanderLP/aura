import { FC, useEffect, useState } from "react";
import { m } from "framer-motion";
import * as Tooltip from "@radix-ui/react-tooltip";
import useStore from "../lib/store";

type Mode = "connect" | "host";

const Navigation: FC = () => {
  const mode = useStore((state) => state.mode);
  const setMode = useStore((state) => state.setMode);

  const Item: FC<{ name: Mode; icon: string }> = ({ name, icon }) => {
    const active = mode === name;
    return (
      <Tooltip.Root delayDuration={300}>
        <Tooltip.Trigger
          css={{
            all: "unset",
          }}
        >
          <div
            css={{
              background: "none",
              border: "none",
              width: "56px",
              height: "56px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              userSelect: "none",
              backgroundColor: active ? "var(--secondaryContainer)" : undefined,
              borderRadius: "28px",
            }}
            onClick={() => {
              setMode(name);
            }}
          >
            <span
              className="material-symbols-outlined"
              css={{
                fontSize: "24px",
                color: active
                  ? "var(--onSecondaryContainer)"
                  : "var(--onSurfaceVariant)",
              }}
            >
              {icon}
            </span>
          </div>
        </Tooltip.Trigger>
        <Tooltip.Content
          side="left"
          sideOffset={6}
          align="start"
          alignOffset={8}
        >
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            css={{
              backgroundColor: active
                ? "var(--secondaryContainer)"
                : "var(--surfaceVariant)",
              color: active
                ? "var(--onSecondaryContainer)"
                : "var(--onSurfaceVariant)",
              margin: "0.5rem 0",
              padding: "0.3rem 0.5rem",
              borderRadius: "6px",
            }}
          >
            {name}
          </m.div>
        </Tooltip.Content>
      </Tooltip.Root>
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
