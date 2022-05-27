import { FC, useEffect, useRef } from "react";
import useStore from "../lib/store";
import { styled } from "../styles/stitches.config";

const Host: FC = () => {
  const me = useStore((state) => state.me);
  const remoteStream = useStore((state) => state.remoteStream);

  const vidRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (remoteStream && vidRef.current) {
      vidRef.current.srcObject = remoteStream;
    }
  });

  const Video = styled("video", {
    aspectRatio: "16:9",
    width: "1000px",
  });

  return (
    <div>
      People will see you as <b>{me.name}</b>
      <Video autoPlay playsInline ref={vidRef}></Video>
    </div>
  );
};

export default Host;
