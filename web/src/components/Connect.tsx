import {
  FC,
  FormEventHandler,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";

import * as Separator from "@radix-ui/react-separator";

import { getFirestore, getDoc } from "firebase/firestore";

// google stun servers
// i hecking love google
const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

// The connect component creates a code
// other users can use the host component to connect to a host
// with their screen rtc stream
const Connect: FC = () => {
  const [status, setStatus] = useState({
    color: "secondary",
    text: "select something to stream",
    active: false,
  });
  const localStream = useRef(new MediaStream());
  const pc = useRef(new RTCPeerConnection(servers));

  const handleMediaClick: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    navigator.mediaDevices
      .getDisplayMedia({
        video: true,
      })
      .then((stream) => {
        // stop all previous streams
        console.log(localStream.current.getTracks());

        localStream.current.getTracks().forEach((v) => {
          console.log("STOP");
          v.stop();
          localStream.current.removeTrack(v);
        });

        stream.getTracks().forEach((v) => {
          localStream.current.addTrack(v);
          pc.current.addTrack(v, localStream.current);
          v.onended = () => {
            console.log("END");
            v.stop();
            localStream.current.removeTrack(v);
            setStatus({
              color: "secondary",
              text: "select something to stream",
              active: false,
            });
          };
        });

        setStatus({
          color: "success",
          text: "stream found! enter code to connect",
          active: true,
        });
      })
      .catch((e) => {
        console.log(e);
        setStatus({
          color: "error",
          text: "error :/",
          active: false,
        });
      });
  };

  const handleConnect: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (localStream.current.getTracks() == []) return;
    // https://stackoverflow.com/questions/29907163/how-to-work-with-form-elements-in-typescript#29907188
    // @ts-ignore too lazy to write an interface for this
    const code = e.target.elements.code.value;
    console.log(code);

    
  };

  return (
    <div>
      <div>
        <p
          css={{
            marginBottom: "0.5rem",
          }}
        >
          <span
            id="status"
            css={{
              "&:before": {
                content: "' '",
                display: "inline-block",
                width: "10px",
                height: "10px",
                marginRight: "10px",
                borderRadius: "100%",
                backgroundColor: `var(--${status.color})`,
              },
            }}
          />
          <span className="label-large">{status.text}</span>
        </p>
        <button
          onClick={handleMediaClick}
          data-color="secondary"
          data-variant="filled"
        >
          <span className="label-large">
            {localStream === undefined ? "connect" : "change"} media
          </span>
        </button>
      </div>
      <Separator.Root
        css={{
          height: 2,
          width: "100%",
          backgroundColor: "var(--outline)",
          margin: "1rem 0",
        }}
      ></Separator.Root>
    </div>
  );
};

export default Connect;