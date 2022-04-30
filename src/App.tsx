import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import Navigation from "./components/Navigation";

// breakpoints, following the material you specifications
const bp = (size: number) => `@media (min-width: ${size}px)`;
const medium = bp(600);
const expanded = bp(840);

function App() {
  const skipIntro = sessionStorage.getItem("introPlayed") === "true";

  const [intro, setIntro] = useState(true);
  useEffect(() => {
    if (!skipIntro) {
      setTimeout(() => {
        setIntro(false);
        sessionStorage.setItem("introPlayed", "true");
      }, 2000);
    }
  });

  return (
    <>
      <AnimatePresence>
        {intro && !skipIntro && (
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
      <main
        css={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Navigation/>
      </main>
    </>
  );
}

export default App;
