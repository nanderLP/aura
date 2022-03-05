import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  getFirestore,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { FC, useEffect, useRef, useState } from "react";
import stunServers from "../lib/stun";

const randomCode = () =>
  Array.from(Array(4), () =>
    Math.floor(Math.floor(1 + Math.random() * 9))
  ).join("");

const db = getFirestore();

// show code and accept connection from share client

const Host: FC<{ onSize: CallableFunction }> = (props) => {
  const [code, setCode] = useState<string | null>(null);
  const [connectionState, setConnectionState] =
    useState<RTCIceConnectionState | null>(null);

  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  let pc: RTCPeerConnection;
  let remoteStream: MediaStream;

  // new document for new session
  let docRef: DocumentReference;
  // collection inside docRef for host offers
  let hostRef: CollectionReference;
  // collection inside docRef for client answers
  let clientRef: CollectionReference;

  useEffect(() => {
    pc = new RTCPeerConnection(stunServers);
    remoteStream = new MediaStream();
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;

    /*setInterval(() => {
      console.log("REMOTE STREAM", remoteStream.active);
      console.log("CONNECTION STATE", pc.iceConnectionState);
      console.log("GATHERING STATE", pc.iceGatheringState);
    }, 1000);*/

    docRef = doc(collection(db, "connections"));

    const code = randomCode();
    setDoc(docRef, { code }).then(() => {
      console.log("new doc with code", code);
      setCode(code);
    });

    hostRef = collection(docRef, "host");
    clientRef = collection(docRef, "client");

    pc.ontrack = (event) => {
      console.log("TRACK DETECTED");

      event.streams[0].getTracks().forEach((track) => {
        console.log("ADDING TRACK", track);

        remoteStream.addTrack(track);
      });
    };

    pc.oniceconnectionstatechange = (event) => {
      console.log("ICE CONNECTION STATE CHANGE", pc.iceConnectionState);
      setConnectionState(pc.iceConnectionState);
    };

    pc.onconnectionstatechange = (event) => {
      console.log("CONNECTION STATE CHANGE", event);
    };

    remoteStream.onremovetrack = (event) => {
      console.log("REMOVING TRACK", event);
    };

    // Get candidates for caller, save to db
    pc.onicecandidate = (event) => {
      event.candidate && addDoc(hostRef, event.candidate.toJSON());
    };

    pc.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    }).then((offer) => {
      pc.setLocalDescription(offer);
      updateDoc(docRef, {
        offer: { sdp: offer.sdp, type: offer.type },
      });
    });

    onSnapshot(docRef, (doc) => {
      const data = doc.data();
      if (!pc.currentRemoteDescription && data?.answer) {
        console.log("REMOTE ANSWER", data.answer);
        const answerDescription = new RTCSessionDescription(data.answer);
        pc.setRemoteDescription(answerDescription);
      }
    });

    onSnapshot(clientRef, (doc) => {
      doc.docChanges().forEach((change) => {
        if (change.type === "added") {
          console.log("NEW ICE CANDIDATE", change.doc.data());
          const candidate = new RTCIceCandidate(change.doc.data());
          pc.addIceCandidate(candidate);
        }
      });
    });
  }, []);

  //await setDoc(doc(db, "hosts", randomCode()), offer);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-high">host</h1>
      {code && <p>{code}</p>}
      <video ref={remoteVideoRef} autoPlay playsInline></video>
    </div>
  );
};

export default Host;
