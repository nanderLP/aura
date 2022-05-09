import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import Navigation from "./components/Navigation";
import Host from "./components/Host";
import Connect from "./components/Connect";

// init firebase
import "./lib/firebase";

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

  // mode handling
  const [mode, setMode] = useState<"connect" | "host">("connect");

  useEffect(() => {
    console.log(mode);
  }, [mode]);

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
          transition={{ delay: 0.5, duration: 0.5 }}
          css={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <Navigation mode={mode} onChange={setMode} />
          <main
            css={{
              width: "100%",
              [medium]: {
                width: "384px",
              },
            }}
          >
            {mode === "host" ? <Host /> : <Connect />}
          </main>
        </m.div>
      )}
    </>
  );
}

export default App;
