import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";

// breakpoints, following the material you specifications
const bp = (size: number) => `@media (min-width: ${size}px)`;
const medium = bp(600);
const expanded = bp(840);

function App() {
  const [intro, setIntro] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIntro(false);
    }, 2000);
  });

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
            transition={{ duration: 0.5 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
          >
            <h1
              className="gradient"
              css={{
                fontSize: "8rem",
              }}
            >
              aura
            </h1>
          </m.div>
        )}
      </AnimatePresence>
      <main
        css={{
          display: "flex",
          flexDirection: "column",
        }}
      ></main>
    </>
  );
}

export default App;
