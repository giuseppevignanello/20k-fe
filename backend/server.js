const express = require("express");
const { WebSocketServer } = require("ws");
const cors = require("cors");
const WebSocketHandler = require("./src/Controllers/WebSocketHandler");
const { v4: uuidv4 } = require("uuid");
const Room = require("./src/Models/Room");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

const wss = new WebSocketServer({ noServer: true });
const webSocketHandler = new WebSocketHandler(wss);

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

wss.on("connection", (socket) => {
  webSocketHandler.handleConnection(socket);
});

app.post("/create-room", (req, res) => {
  const { players, score } = req.body;
  if (!players || !score) {
    return res
      .status(400)
      .json({ error: "Missing 'players' or 'score' in body" });
  }

  const roomId = uuidv4();
  const room = new Room(roomId, players, score);
  webSocketHandler.rooms[roomId] = room;

  res.json({ roomId });
});

app.get("/room-exists/:roomId", (req, res) => {
  const roomId = req.params.roomId;
  const room = webSocketHandler.rooms[roomId];

  if (!room) {
    return res.json({ exists: false });
  }
  if (room.users.length >= room.players) {
    return res.json({ exists: true, full: true });
  }

  return res.json({ exists: true, full: false });
});
