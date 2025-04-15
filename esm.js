import ws from './ws.mjs';

const { createWebSocketStream, WebSocketServer, Receiver, Sender, WebSocket } = ws;

export {
  ws as default,
  createWebSocketStream,
  WebSocketServer,
  Receiver,
  Sender,
  WebSocket,
}

