import { useEffect, useReducer, useRef, useState } from "react";
import { AnimatePresence, m, useAnimation } from "framer-motion";
import Navigation from "./components/Navigation";
import Host from "./components/Host";
import Connect from "./components/Connect";

import useStore from "./lib/store";
import Intro from "./components/Intro";
import { styled } from "./styles/stitches.config";
import StatusWidget from "./components/StatusWidget";

const skipIntro = sessionStorage.getItem("introPlayed") === "true";

function App() {
  // intro handling

  const [intro, setIntro] = useState(!skipIntro);
  useEffect(() => {
    if (!skipIntro) {
      setTimeout(() => {
        setIntro(false);
        sessionStorage.setItem("introPlayed", "true");
      }, 2000);
    }
  });

  // I'd like to use tilg but the strict-mode double render feature makes it kinda annoying to look at
  // useTilg()`mode = ${mode}, intro = ${intro}`;

  const connected = useStore((state) => state.connected);
  const mode = useStore((state) => state.mode);

  useEffect(() => {
    console.log("connected", connected);
  }, [connected]);

  const Container = styled(m.div, {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
    margin: "0 1rem",
  });

  const ContentWrapper = styled("main", {
    width: "100%",
    "@medium": {
      width: "384px",
    },
  });

  return (
    <>
      <Intro active={!connected} />
      <StatusWidget />
      {connected && (
        <>
          <Container
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <Navigation />
            <ContentWrapper>
              {mode === "host" ? <Host /> : <Connect />}
            </ContentWrapper>
          </Container>
        </>
      )}
    </>
  );
}

export default App;
