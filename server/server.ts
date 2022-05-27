import { ConnInfo, serve } from "https://deno.land/std@0.137.0/http/server.ts";
import { nanoid } from "https://deno.land/x/nanoid@v3.0.0/mod.ts";

import { generateNameCustom } from "https://deno.land/x/docker_names/mod.ts";

class Client {
  ip: string;
  id: string;
  name: string;
  socket: WebSocket;
  mode: string;
  constructor(
    socket: WebSocket,
    req: Request,
    connInfo: ConnInfo,
    mode: string,
  ) {
    this.socket = socket;
    this.ip = req.headers.get("X-Forwarded-For")?.split(/\s*.\s*/)[0] ||
      (connInfo.remoteAddr as Deno.NetAddr).hostname;
    this.id = nanoid();
    this.name = generateNameCustom(" ");
    this.mode = mode;

    /*
      const ip = (connInfo.remoteAddr as Deno.NetAddr).hostname;
      socket.send("remoteAddr: "+ip + " x-forwarded-for: "+req.headers.get("X-Forwarded-For"));
      */
  }

  /**
   * removes sensitive information from the client object, used for sending to other clients
   * @returns a parsable representation of the client
   */
  sanitize = () => ({
    id: this.id,
    mode: this.mode,
    name: this.name,
  });
}

class Room {
  clients: Client[] = [];
  code: string;
  constructor() {
    // hot oneliner
    this.code = Math.floor(Math.random() * 10000).toLocaleString(undefined, {
      useGrouping: false,
      minimumIntegerDigits: 4,
    });
  }

  addClient(client: Client) {
    console.log(`[${client.mode}] ${client.ip} connected`);
    // notify all clients
    this.clients.forEach((c) => {
      c.socket.send(
        JSON.stringify({
          type: "join",
          payload: client.sanitize(),
        }),
      );
    });
    client.socket.onopen = () => {
      client.socket.send(
        JSON.stringify({
          type: "init",
          payload: {
            clients: this.clients.filter((c) => c.id !== client.id).map((
              c,
            ) => {
              return c.sanitize();
            }),
            me: client.sanitize(),
            code: this.code,
          },
        }),
      );
    };
    client.socket.onmessage = (message) => this.onMessage(client, message);
    client.socket.onclose = () => this.removeClient(client);
    // notify client of current clients and room information
    this.clients.push(client);
  }

  removeClient(client: Client) {
    console.log(`[${client.mode}] ${client.ip} disconnected`);
    this.clients = this.clients.filter((c) => c.id !== client.id);
    // notify all clients
    this.clients.forEach((c) => {
      c.socket.send(
        JSON.stringify({ type: "leave", payload: { id: client.id } }),
      );
    });
  }

  onMessage(client: Client, message: MessageEvent) {
    // TODO: maybe heartbeat, disconnect event, mode changing and message relaying
    const data = JSON.parse(message.data);
    const payload = data.payload;
    try {
      switch (data.type) {
        case "message": {
          const recipient = this.clients.find((c) => c.id === data.to);
          if (!recipient) throw new Error("recipient not found");
          recipient.socket.send(
            JSON.stringify({
              type: "message",
              from: client.id,
              payload,
            }),
          );
          break;
        }
        case "mode": {
          const newMode = payload.mode;
          if (newMode !== "host" && newMode !== "connect") {
            throw new Error("invalid mode");
          }
          // identical mode, don't do anything
          if (newMode === client.mode) return;

          client.mode = newMode;

          // notify all clients
          this.clients.forEach((c) => {
            // don't notify yourself
            if (c.id == client.id) return;

            c.socket.send(
              JSON.stringify({
                type: "mode",
                payload: client.sanitize(),
              }),
            );
          });
          break;
        }
        case "disconnect": {
          // calls onclose event, which does the rest
          client.socket.close();
          break;
        }
      }
    } catch (e) {
      client.socket.send(
        JSON.stringify({ type: "error", payload: { message: e.message } }),
      );
    }
  }
}

// key is ip, this will not work with ipv6 (don't know if that's possible)
const rooms = new Map<string, Room>();

function handler(req: Request, connInfo: ConnInfo): Response {
  // const upgrade = req.headers.get("upgrade") || ""; this isn't used?
  const mode = new URL(req.url).searchParams.get("mode") || undefined;
  if (!mode) {
    return new Response("no mode specified", { status: 400 });
  }
  if (mode !== "host" && mode !== "connect") {
    return new Response("invalid mode", { status: 400 });
  }
  let response: Response, socket: WebSocket;
  try {
    ({ response, socket } = Deno.upgradeWebSocket(req));
  } catch {
    return new Response("request isn't trying to upgrade to websocket.");
  }
  const client = new Client(socket, req, connInfo, mode);
  // check if room for that ip exists
  if (!rooms.has(client.ip)) {
    // create room for that ip
    rooms.set(client.ip, new Room());
  }
  // add client to room
  // @ts-ignore maps dont work with ts i guess flop
  rooms.get(client.ip).addClient(client);
  return response;
}

serve(handler);
