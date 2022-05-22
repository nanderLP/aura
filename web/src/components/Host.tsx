import { FC, useRef } from "react";
import useStore from "../lib/store";
import servers from "../lib/stun";

const Host: FC = () => {
  const { current: pc } = useRef(new RTCPeerConnection(servers));
  const { current: remoteStream } = useRef(new MediaStream());
  pc.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
  };

  const me = useStore((state) => state.me);

  return (
    <div>
      People will see you as <b>{me.name}</b>
    </div>
  );
};

export default Host;
