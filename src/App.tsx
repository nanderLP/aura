import { animate, AnimatePresence, motion } from "framer-motion";
import { FC, useEffect, useRef, useState } from "react";
import { Bounce, Spinner } from "./components/Spinner";

import "./lib/firebase";
import { getFirestore } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";

import "./styles/gradient.css";
import Host from "./components/Host";
import Share from "./components/Share";

type Client = {
  name: string;
};

function App() {
  const [intro, setIntro] = useState(true);
  const [mode, setMode] = useState<"host" | "share">("share"); // TODO: change to share when done

  useEffect(() => {
    setTimeout(() => setIntro(false), 3000); // rework, i can just chain the animations
  }, []);

  const Client: FC<{ client: Client }> = ({ client }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-dp-1 p-2 rounded-lg"
    >
      <p className="text-high">
        name: <span>{client.name}</span>
      </p>
    </motion.div>
  );

  return (
    <motion.main className="min-h-screen flex justify-center">
      <AnimatePresence>
        {intro && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="self-center absolute"
          >
            <h1 className="text-9xl font-black select-none gradient">aura</h1>
          </motion.div>
        )}
      </AnimatePresence>
      {!intro && (
        <motion.div
          transition={{ delay: 0.6 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-4 mt-[40vh] flex flex-col gap-8"
        >
          <motion.div
            layout="position"
            className="h-8 grid grid-cols-2 text-med"
          >
            <div className="flex items-center justify-center">
              <button
                onClick={() => setMode("share")}
                className={`absolute text-lg hover:text-high${
                  mode === "share" ? " text-high" : ""
                }`}
              >
                share
              </button>
              {mode === "share" && (
                <motion.div
                  layoutId="selected"
                  className="bg-dp-2 w-full h-full rounded-lg px-12 py-5"
                />
              )}
            </div>
            <div className="flex items-center justify-center">
              <button
                onClick={() => setMode("host")}
                className={`absolute text-lg hover:text-high${
                  mode === "host" ? " text-high" : ""
                }`}
              >
                host
              </button>
              {mode === "host" && (
                <motion.div
                  layoutId="selected"
                  className="bg-dp-2 w-full h-full rounded-lg px-12 py-5"
                />
              )}
            </div>
          </motion.div>
          <div>{mode === "host" ? <Host /> : <Share />}</div>
        </motion.div>
      )}
    </motion.main>
  );
}

export default App;
