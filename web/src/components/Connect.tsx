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
import servers from "../lib/stun";
import useStore from "../lib/store";
import Button from "./primitives/Button";
import { styled } from "../styles/stitches.config";

// The connect component creates a code
// other users can use the host component to connect to a host
// with their screen rtc stream
const Connect: FC = () => {
  const [status, setStatus] = useState<{
    color: "secondary" | "error" | "success";
    text: string;
    active: boolean;
  }>({
    color: "secondary",
    text: "select something to stream",
    active: false,
  });
  const { current: localStream } = useRef(new MediaStream());
  const { current: pc } = useRef(new RTCPeerConnection(servers));

  // connected hosts
  const clients = useStore((state) => state.clients);

  const handleMediaClick: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    navigator.mediaDevices
      .getDisplayMedia({
        video: true,
      })
      .then((stream) => {
        // stop all previous streams
        console.log(localStream.getTracks());

        localStream.getTracks().forEach((v) => {
          console.log("STOP");
          v.stop();
          localStream.removeTrack(v);
        });

        stream.getTracks().forEach((v) => {
          localStream.addTrack(v);
          pc.addTrack(v, localStream);
          v.onended = () => {
            console.log("END");
            v.stop();
            localStream.removeTrack(v);
            setStatus({
              color: "secondary",
              text: "select something to stream",
              active: false,
            });
          };
        });

        setStatus({
          color: "success",
          text: "stream found! select a host to connect to.",
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
    if (localStream.getTracks() == []) return;
    // https://stackoverflow.com/questions/29907163/how-to-work-with-form-elements-in-typescript#29907188
    // @ts-ignore too lazy to write an interface for this
    const code = e.target.elements.code.value;
    console.log(code);
  };

  const Status = styled("span", {
    "&:before": {
      content: "' '",
      display: "inline-block",
      width: "10px",
      height: "10px",
      marginRight: "10px",
      borderRadius: "100%",
    },
    variants: {
      status: {
        secondary: {
          "&:before": {
            backgroundColor: "$secondary",
          },
        },
        success: {
          "&:before": {
            backgroundColor: "$success",
          },
        },
        error: {
          "&:before": {
            backgroundColor: "$error",
          },
        },
      },
    },
  });

  const StyledSeparator = styled(Separator.Root, {
    height: 2,
    width: "100%",
    backgroundColor: "$outline",
    margin: "1rem 0",
  });

  return (
    <div>
      <div>
        <p
          css={{
            marginBottom: "0.5rem",
          }}
        >
          <Status status={status.color} />
          <span className="label-large">{status.text}</span>
        </p>
        <Button onClick={handleMediaClick} color="secondary" variant="filled">
          {localStream === undefined ? "connect" : "change"} media
        </Button>
      </div>
      <StyledSeparator orientation="horizontal"/>
      <div>
        {clients
          .filter((c) => c.mode === "host")
          .map((c, i) => (
            <div key={i}>{c.id}</div>
          ))}
      </div>
    </div>
  );
};

export default Connect;
