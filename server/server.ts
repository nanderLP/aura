import { ConnInfo, serve } from "https://deno.land/std@0.137.0/http/server.ts";
import { nanoid } from "https://deno.land/x/nanoid@v3.0.0/mod.ts";

class Client {
  ip: string;
  id: string;
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
    this.mode = mode;

    /*
      const ip = (connInfo.remoteAddr as Deno.NetAddr).hostname;
      socket.send("remoteAddr: "+ip + " x-forwarded-for: "+req.headers.get("X-Forwarded-For"));
      */
  }
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
          client: { id: client.id, mode: client.mode },
        }),
      );
    });
    client.socket.onopen = () => {
      client.socket.send(
        JSON.stringify({
          type: "connect",
          clients: this.clients.filter((c) => c.id !== client.id),
          me: {
            id: client.id,
            mode: client.mode,
          },
          code: this.code,
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
        JSON.stringify({ type: "leave", client: { id: client.id } }),
      );
    });
  }

  onMessage(client: Client, message: MessageEvent) {
    // TODO: maybe heartbeat, disconnect event, mode changing and message relaying
  }

  /* changeMode(client: Client, mode: string) {
    // notify all clients
    this.clients.forEach((c) => {
      c.socket.send(
        JSON.stringify({ type: "mode", client: { id: client.id, mode: mode } }),
      );
    });
    client.mode = mode;
  }*/
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
