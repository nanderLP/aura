import {
  addDoc,
  collection,
  CollectionReference,
  DocumentData,
  DocumentReference,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  QueryDocumentSnapshot,
  updateDoc,
  where,
} from "firebase/firestore";
import { AnimatePresence } from "framer-motion";
import { FC, FormEventHandler, useEffect, useRef, useState } from "react";
import stunServers from "../lib/stun";

const db = getFirestore();

// enter code and share screen to host

const Share: FC = () => {
  const [loading, setLoading] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);

  let pc: RTCPeerConnection;
  let localStream: MediaStream;

  useEffect(() => {
    // we can't init the refs here because we need to wait for the code
    // same with localStream

    pc = new RTCPeerConnection(stunServers);
  }, []);

  const startSharing: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);

    const code = (e.target as HTMLFormElement).code?.value;

    try {
      const docQuery = query(
        collection(db, "connections"),
        where("code", "==", code)
      );

      const querySnapshot = (await getDocs(docQuery)).docs[0];
      const docRef = querySnapshot.ref;
      const docData = querySnapshot.data();
      const hostRef = collection(docRef, "host");
      const clientRef = collection(docRef, "client");

      pc.onicecandidate = (event) => {
        event.candidate && addDoc(clientRef, event.candidate.toJSON());
      };

      // get screen stream
      localStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      localStream
        .getTracks()
        .forEach((track) => pc.addTrack(track, localStream));
      if (localVideoRef.current) localVideoRef.current.srcObject = localStream;

      // create answer
      const offerDescription = docData.offer;
      await pc.setRemoteDescription(
        new RTCSessionDescription(offerDescription)
      );

      const answerDescription = await pc.createAnswer();
      await pc.setLocalDescription(answerDescription);

      // save answer to db
      updateDoc(docRef, {
        answer: { sdp: answerDescription.sdp, type: answerDescription.type },
      });

      onSnapshot(hostRef, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          console.log(change);
          if (change.type === "added") {
            let data = change.doc.data();
            pc.addIceCandidate(new RTCIceCandidate(data));
          }
        });
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-high">share</h1>

      <form className="flex flex-col gap-2" onSubmit={startSharing}>
        <label htmlFor="code" className="text-med text-lg text-center">
          enter code
        </label>
        <input
          type="text"
          id="code"
          name="code"
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
      </form>
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
