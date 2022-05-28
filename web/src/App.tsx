import { useEffect, useReducer, useRef, useState } from "react";
import { AnimatePresence, m, useAnimation } from "framer-motion";
import Navigation from "./components/Navigation";
import Host from "./components/Host";
import Connect from "./components/Connect";

import useStore from "./lib/store";
import Intro from "./components/Intro";
import { styled } from "./styles/stitches.config";
import StatusWidget from "./components/StatusWidget";

// import useTilg from "tilg";

function App() {
  // I'd like to use tilg but the strict-mode double render safety feature makes it kinda annoying to look at
  // useTilg();

  const controls = useAnimation();

  const connected = useStore((state) => state.connected);
  const mode = useStore((state) => state.mode);

  useEffect(() => {
    controls.start({
      opacity: connected ? 1 : 0,
      transition: {
        duration: 0.5,
        delay: 1.5,
      },
    });
  }, [connected]);

  const ContentWrapper = styled("main", {
    width: "100%",
    "@medium": {
      width: "384px",
    },
  });

  // so today i found out that framer motion breaks with stitches

  return (
    <>
      <Intro active={!connected} />
      <StatusWidget />
      {connected && (
        <m.div
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
            margin: "0 1rem",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          <Navigation />
          <ContentWrapper>
            {mode === "host" ? <Host /> : <Connect />}
          </ContentWrapper>
        </m.div>
      )}
    </>
  );
}

export default App;
