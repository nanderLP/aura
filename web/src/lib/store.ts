import { useEffect, useRef } from "react";
import create from "zustand";
import { combine } from "zustand/middleware";
import servers from "./stun";

/**
 * the current mode of the client
 */
type Mode = "connect" | "host";

interface Client {
  /**
   * The client's unique id, generated by the server with nanoid
   */
  id: string;
  mode: Mode;
  /**
   * human-readable name, based on the moby name generation
   */
  name: string;
  /**
   * object for storing important data for establishing a webrtc connection between two clients
   */
  rtc: {
    // TODO: rtc stuff types
  };
}

// the init event sends a me object with information about yourself
interface Me {
  id?: string;
  name?: string;
}

interface State {
  /**
   * the clients in the room
   */
  clients: Client[];

  /**
   * information about yourself in the room-context
   */
  me: Me;

  /**
   * class that manages p2p connections through webrtc, hopefully works
   * ignored, i have to add pc in the 2nd combine object, because i have to add listeners to it
   *
   * pc: RTCPeerConnection;
   */

  /**
   * id of the peer that you are connected to / trying to connect to
   * used for ice messages
   */
  connection?: string;

  /**
   * class that manages the local screen stream
   */
  localStream: MediaStream;

  /**
   * class that manages the remote screen stream
   */
  remoteStream: MediaStream;

  mode: Mode;

  /**
   * 4 digit code, used to identify the room and may be used for cross-wifi connection
   */
  code?: string;

  /**
   * specifies if you are connected to a room
   */
  connected: boolean;
}

const defaultMode: Mode = "connect";

const initialState: State = {
  clients: [],
  me: {},
  //pc: new RTCPeerConnection(servers),
  connection: undefined,
  localStream: new MediaStream(),
  remoteStream: new MediaStream(),
  code: undefined,
  mode: defaultMode,
  connected: false,
};

const useStore = create(
  combine(initialState, (set, get) => {
    const pc = new RTCPeerConnection(servers);

    pc.ontrack = (event) => {
      console.log("PC TRACK");

      event.streams[0].getTracks().forEach((track) => {
        console.log(track);

        get().remoteStream.addTrack(track);
      });
    };

    pc.onicecandidate = (event) => {
      const connectionCandidate = get().connection;
      if (event.candidate && connectionCandidate) {
        console.log("ICE");
        ws.send(
          JSON.stringify({
            type: "message",
            to: connectionCandidate,
            payload: {
              type: "ice",
              ice: event.candidate,
            },
          })
        );
      }
    };

    // websocket stuff
    const ws = new WebSocket("ws://localhost:8000?mode=" + defaultMode);

    ws.onopen = (e) => {
      console.log("CONNECTED", e);
      set({ connected: true });
    };

    ws.onclose = (e) => {
      console.log("DISCONNECTED", e);
      set({ connected: false });
    };

    ws.onerror = (e) => {
      console.log("ERROR", e);
    };

    ws.onmessage = async (e) => {
      const { payload, ...data } = JSON.parse(e.data);

      console.log("MESSAGE", data, payload);

      try {
        switch (data.type) {
          case "message": {
            // use message
            const { from } = data;
            const { type } = payload;
            switch (type) {
              case "offer": {
                // handle offer, start of connection
                set({ connection: from });

                const offer = new RTCSessionDescription(payload.offer);
                await pc.setRemoteDescription(offer);

                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);

                ws.send(
                  JSON.stringify({
                    type: "message",
                    to: from,
                    payload: {
                      type: "answer",
                      answer: {
                        type: answer.type,
                        sdp: answer.sdp,
                      },
                    },
                  })
                );
                break;
              }
              case "answer": {
                const answer = new RTCSessionDescription(payload.answer);
                await pc.setRemoteDescription(answer);
              }
              case "ice": {
                const candidate = new RTCIceCandidate(payload.ice);
                await pc.addIceCandidate(candidate);
              }
            }
            break;
          }
          case "mode": {
            // this is probably obsolete but i'll keep using it for debugging purposes
            const clientFound = get().clients.find((c) => c.id === payload.id);

            if (!clientFound) {
              throw new Error("client not found, that should not happen");
            }

            const modifiedClients = get().clients.map((c) => {
              if (c.id === payload.id) {
                c.mode = payload.mode;
              }
              return c;
            });

            // replace client in array
            // dunno if i can make this more efficient
            set({
              clients: modifiedClients,
            });
            break;
          }
          case "join": {
            const client = payload as Client;
            set((state) => ({
              clients: [...state.clients, client],
            }));
            break;
          }
          case "leave": {
            const leaverId = payload.id;
            set((state) => ({
              clients: state.clients.filter((c) => c.id !== leaverId),
            }));
            break;
          }
          case "init": {
            // save all the stuff we get (clients)
            const { clients, me, code } = payload;
            set({
              clients,
              me,
              code,
            });
            break;
          }
        }
      } catch (e) {
        console.log("ONMESSAGE ERROR", e);
        console.log("CLIENTS", get().clients);
      }
    };

    return {
      pc,
      setMode(mode: Mode) {
        console.log("SETMODE", mode);

        // reset streams
        const l = get().localStream;
        const r = get().remoteStream;
        l.getTracks().forEach((t) => t.stop());
        r.getTracks().forEach((t) => t.stop());

        // broadcast mode change
        ws.send(JSON.stringify({ type: "mode", payload: { mode } }));
        set({
          mode,
        });
      },
      async connectToHost(id: string) {
        set({ connection: id });
        const offer = await pc.createOffer({ offerToReceiveVideo: true });
        await pc.setLocalDescription(offer);
        console.log("CONNECT TO HOST", id);
        ws.send(
          JSON.stringify({
            type: "message",
            to: id,
            payload: {
              type: "offer",
              offer: {
                sdp: offer.sdp,
                type: offer.type,
              },
            },
          })
        );
      },
    };
  })
);

export default useStore;