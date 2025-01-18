const express = require("express");
const { WebSocketServer } = require("ws");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const rooms = {};

app.post("/create-room", (req, res) => {
  const { players, score } = req.body;
  if (!players || !score) {
    return res
      .status(400)
      .json({ error: "Missing 'players' or 'score' in body" });
  }
  const roomId = uuidv4();
  rooms[roomId] = {
    clients: new Set(),
    players,
    score,
    users: [],
  };
  res.json({ roomId });
});

app.get("/room-exists/:roomId", (req, res) => {
  const roomId = req.params.roomId;
  const room = rooms[roomId];
  if (!room) {
    return res.json({ exists: false });
  }
  if (room.users.length >= room.players) {
    return res.json({ exists: true, full: true });
  }
  return res.json({ exists: true, full: false });
});

const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

wss.on("connection", (socket, req) => {
  socket.on("message", (data) => {
    const message = JSON.parse(data);
    if (message.type === "join-room") {
      const { roomId, username } = message;
      if (rooms[roomId]) {
        if (rooms[roomId].users.length >= rooms[roomId].players) {
          socket.send(
            JSON.stringify({ type: "room-full", message: "Room is full" })
          );
          socket.close();
          return;
        }
        rooms[roomId].clients.add(socket);
        rooms[roomId].users.push(username);
        socket.roomId = roomId;
        socket.username = username;

        socket.send(
          JSON.stringify({
            type: "room-details",
            roomId,
            players: rooms[roomId].players,
            score: rooms[roomId].score,
            users: rooms[roomId].users,
          })
        );

        broadcast(roomId, {
          type: "room-update",
          users: rooms[roomId].users,
          score: rooms[roomId].score,
          roomId: roomId,
        });
      } else {
        socket.send(
          JSON.stringify({ type: "error", message: "Room does not exist" })
        );
      }
    }
  });
});

function broadcast(roomId, data) {
  if (rooms[roomId]) {
    rooms[roomId].clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify(data));
      }
    });
  }
}
