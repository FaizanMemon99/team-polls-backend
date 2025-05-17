import http from 'http';
import app from './app';
import { setupWebSocket } from './websocket';

const PORT = process.env.PORT || 8080;

const server = http.createServer(app);

setupWebSocket(server); // 🧠 Add WebSocket support

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
