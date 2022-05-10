import { serve, ConnInfo } from "https://deno.land/std@0.137.0/http/server.ts";
  
class Client {
  ip: string;
  socket: WebSocket;
  constructor(socket: WebSocket, req: Request, connInfo: ConnInfo) {
    this.socket = socket
    this.ip = req.headers.get("X-Forwarded-For")?[0] || (connInfo.remoteAddr as Deno.NetAddr).hostname
  }
}

class Room {
  
}

function handler(req: Request, connInfo: ConnInfo): Response {
  const upgrade = req.headers.get("upgrade") || "";
  const ip = (connInfo.remoteAddr as Deno.NetAddr).hostname;
  let response: Response, socket: WebSocket;
  try {
    ({ response, socket } = Deno.upgradeWebSocket(req));
  } catch {
    return new Response("request isn't trying to upgrade to websocket.");
  }
  socket.onopen = () => console.log("socket opened");
  socket.onmessage = (e) => {
    console.log("socket message:", e.data);
    socket.send("remoteAddr: "+ip + " x-forwarded-for: "+req.headers.get("X-Forwarded-For"));
  };
  socket.onerror = (e) => console.log("socket errored:", e);
  socket.onclose = () => console.log("socket closed");
  return response;
}

serve(handler);
