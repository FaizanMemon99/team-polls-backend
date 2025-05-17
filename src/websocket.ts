import { Server as WebSocketServer } from 'ws';
import { Server as HTTPServer } from 'http';
import type { WebSocket } from 'ws'; // ✅ from ws package

const socketMap = new Map<string, Set<WebSocket>>();

export function setupWebSocket(server: HTTPServer) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws, req) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const pollId = url.pathname.split('/').pop();

    if (!pollId) {
      ws.close();
      return;
    }

    if (!socketMap.has(pollId)) {
      socketMap.set(pollId, new Set());
    }
    socketMap.get(pollId)!.add(ws);

    ws.on('close', () => {
      socketMap.get(pollId)!.delete(ws);
    });
  });
}

export function broadcastToPoll(pollId: string, data: any) {
  const sockets = socketMap.get(pollId);
  if (!sockets) return;

  const json = JSON.stringify(data);
  for (const ws of sockets) {
    if (ws.readyState === ws.OPEN) {
      ws.send(json);
    }
  }
}
