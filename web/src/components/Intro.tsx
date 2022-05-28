import { AnimatePresence } from "framer-motion";
import { FC } from "react";
import { m } from "framer-motion";
import { keyframes, styled } from "../styles/stitches.config";

const Intro: FC<{ active: boolean }> = ({ active }) => {
  const gradient = keyframes({
    "0%": {
      backgroundPosition: "0% 0%",
    },
    "100%": {
      backgroundPosition: "100% 0%",
    },
  });

  const Title = styled(m.h1, {
    fontSize: "8rem",
    fontWeight: "bold",
    fontFeatureSettings: "'salt' on",
    animation: `${gradient} 5s linear infinite`,
    backgroundImage: `linear-gradient(
      90deg,
      #9adcff,
      #ffb2a6,
      #ff8aae,
      #9adcff,
      #ffb2a6
    );`,
    backgroundSize: "400%, 100%",
    backgroundClip: "text",
    "-webkit-background-clip": "text",
    color: "transparent",
  });

  return (
    <AnimatePresence>
      {active && (
        <m.div
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            display: "grid",
            placeItems: "center",
            userSelect: "none",
          }}
        >
          <Title
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              y: -30,
              transition: { delay: 1, duration: 0.5 },
            }}
            transition={{ duration: 0.5 }}
          >
            aura
          </Title>
        </m.div>
      )}
    </AnimatePresence>
  );
};

export default Intro;
