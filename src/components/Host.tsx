import { FC, useEffect, useRef, useState } from "react";

const randomCode = () =>
  Array.from(Array(4), () =>
    Math.floor(Math.floor(1 + Math.random() * 9))
  ).join("");

// show code and accept connection from share client

const Host: FC = () => {
  const [code, setCode] = useState(null);

  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const [remoteStream, setRemoteStream] = useState<MediaStream>(
    new MediaStream()
  );

  //await setDoc(doc(db, "hosts", randomCode()), offer);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-high">host</h1>
      {code && <p>{code}</p>}
      {remoteStream && (
        <video ref={remoteVideoRef} autoPlay playsInline></video>
      )}
    </div>
  );
};

export default Host;
