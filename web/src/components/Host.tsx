import { FC, useRef } from "react";
import servers from "../lib/stun";

const Host: FC = () => {
  const { current: pc } = useRef(new RTCPeerConnection(servers));
  const { current: remoteStream } = useRef(new MediaStream());
  pc.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
  };

  return <div></div>;
};

export default Host;
