import { useEffect, useReducer, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import Navigation from "./components/Navigation";
import Host from "./components/Host";
import Connect from "./components/Connect";

import useTilg from "tilg";

// init firebase
import "./lib/firebase";
import useStore from "./lib/store";
import Intro from "./components/Intro";
import { styled } from "./styles/stitches.config";
import StatusWidget from "./components/StatusWidget";

function App() {
  // intro handling

  const skipIntro = sessionStorage.getItem("introPlayed") === "true";

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

  /* reworked in socket.ts
  connect to backend
  const ws = useRef<WebSocket>();
  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8000?mode=" + defaultMode);
    ws.current.addEventListener("open", (e) => {
      console.log("CONNECTED", e);
    });
    ws.current.addEventListener("close", (e) => {
      console.log("DISCONNECTED", e);
    });
    ws.current.addEventListener("error", (e) => {
      console.log("ERROR", e);
    });

    return () => ws.current?.close();
  }, []);

  // mode handling
  const defaultMode = "connect";
  const [mode, setMode] = useState(defaultMode);

  // code
  const broadcastMode = (mode: string) => {
    ws.current?.send(JSON.stringify({ type: "mode", payload: { mode } }));
  };

  useEffect(() => {
    broadcastMode(mode);
  }, [mode]);
  */

  const connected = useStore((state) => state.connected);
  const mode = useStore((state) => state.mode);
  const s = useStore((state) => state.localStream);

  useEffect(() => {
    console.log("connected", connected);
  }, [connected]);

  const Container = styled(m.div, {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
  });

  const ContentWrapper = styled("main", {
    width: "100%",
    "@medium": {
      width: "384px",
    },
  });

  return (
    <>
      <Intro active={intro} />
      <StatusWidget />
      {!intro && (
        <Container
          initial={{ opacity: skipIntro ? 1 : 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <Navigation />
          <ContentWrapper>
            {mode === "host" ? <Host /> : <Connect />}
          </ContentWrapper>
        </Container>
      )}
    </>
  );
}

export default App;
