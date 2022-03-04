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
  const [mode, setMode] = useState<"host" | "share">("share");

  useEffect(() => {
    setTimeout(() => setIntro(false), 500); // rework, i can just chain the animations
  }, []);

  /*useEffect(() => {
    localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);
  */

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
    <motion.main className="min-h-screen grid place-items-center">
      <AnimatePresence>
        {intro && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute"
          >
            <h1 className="text-9xl font-black gradient">aura</h1>
          </motion.div>
        )}
      </AnimatePresence>
      {!intro && (
        <motion.div
          transition={{ delay: 0.6 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid px-4 max-w-xs md:max-w-xl w-full"
        >
          {mode === "host" ? <Host /> : <Share />}
        </motion.div>
      )}
    </motion.main>
  );
}

export default App;
