import { FC } from "react";
import supabase from "../lib/supabase";

const Host: FC = () => {
  
  const pc = new RTCPeerConnection();
  pc.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
  };

  return <div></div>;
};

export default Host;
