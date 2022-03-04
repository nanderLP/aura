import { getFirestore } from "firebase/firestore";
import { AnimatePresence } from "framer-motion";
import { FC, useRef, useState } from "react";
import stunServers from "../lib/stun";

const db = getFirestore();

// enter code and share screen to host

const Share: FC = () => {
  const [localStream, setLocalStream] = useState<MediaStream>(
    new MediaStream()
  );
  const [loading, setLoading] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);

  const pc = new RTCPeerConnection(stunServers);

  const startSharing = async () => {
    setLoading(true);
    navigator.mediaDevices
      .getDisplayMedia({ video: true })
      .then(async (stream) => {
        setLocalStream(stream);
        const offerDescription = await pc.createOffer();
        await pc.setLocalDescription(offerDescription);
        const offer = {
          sdp: offerDescription.sdp,
          type: offerDescription.type,
        };
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-high">view</h1>

      <div className="flex flex-col gap-2">
        <label htmlFor="code" className="text-med text-lg text-center">
          enter code
        </label>
        <input
          type="text"
          id="code"
          className="p-3 rounded-xl text-xl text-center"
          size={4}
          maxLength={4}
          placeholder="1234"
          onChange={(e) => {
            if (e.currentTarget.maxLength === e.currentTarget.value.length)
              document.getElementById("connect")?.focus();
          }}
        />
        <button
          id="connect"
          className="bg-dp-2 rounded-xl p-2"
          disabled={loading}
        >
          connect
        </button>
      </div>
      <video ref={localVideoRef} autoPlay playsInline></video>
    </div>
  );
};

export default Share;

/* local code stuff
      <div className="flex flex-col items-center gap-2">
        <AnimatePresence>
          {clients.length === 0 ? (
            <motion.p
              exit={{ opacity: 0, position: "absolute" }}
              className="text-xl font-semibold text-med"
            >
              searching for devices...
            </motion.p>
          ) : (
            clients.map((c, i) => <Client key={i} client={c} />)
          )}
        </AnimatePresence>
        <span className="">
          <Bounce />
        </span>
      </div>
      */
