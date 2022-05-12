import { useEffect, useReducer, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import Navigation from "./components/Navigation";
import Host from "./components/Host";
import Connect from "./components/Connect";

import useTilg from "tilg";

// init firebase
import "./lib/firebase";
import useSocket from "./lib/store";

// breakpoints, following the material you specifications
const bp = (size: number) => `@media (min-width: ${size}px)`;
const medium = bp(600);
const expanded = bp(840);

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

  const connected = useSocket((state) => state.connected);
  const mode = useSocket((state) => state.mode);

  useEffect(() => {
    console.log("connected", connected);
  }, [connected]);

  return (
    <>
      <AnimatePresence>
        {intro && (
          <m.div
            css={{
              width: "100%",
              height: "100%",
              position: "absolute",
              display: "grid",
              placeItems: "center",
              userSelect: "none",
            }}
          >
            <m.h1
              className="gradient"
              css={{
                fontSize: "8rem",
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              aura
            </m.h1>
          </m.div>
        )}
      </AnimatePresence>
      {!intro && (
        <m.div
          initial={{ opacity: skipIntro ? 1 : 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          css={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <Navigation />
          <main
            css={{
              width: "100%",
              [medium]: {
                width: "384px",
              },
            }}
          >
            {mode === "host" ? (
              <Host />
            ) : (
              <Connect />
            )}
          </main>
        </m.div>
      )}
    </>
  );
}

export default App;
