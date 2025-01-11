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
  console.log("Request body:", req.body);

  const { players, score } = req.body;

  if (!players || !score) {
    return res
      .status(400)
      .json({ error: "Missing 'players' or 'score' in body" });
  }

  console.log(players, score);
  const roomId = uuidv4();
  rooms[roomId] = new Set();
  res.json({ roomId });
});

app.get("/room-exists/:roomId", (req, res) => {
  const roomId = req.params.roomId;
  res.json({ exists: !!rooms[roomId] });
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
      const { roomId } = message;
      if (rooms[roomId]) {
        rooms[roomId].add(socket);
        socket.roomId = roomId;
        console.log(`Client joined room: ${roomId}`);

        broadcast(roomId, {
          type: "user-joined",
          message: `A new user joined room ${roomId}`,
        });
      } else {
        socket.send(
          JSON.stringify({ type: "error", message: "Room does not exist" })
        );
      }
    } else if (message.type === "chat") {
      const roomId = socket.roomId;
      if (roomId) {
        broadcast(roomId, {
          type: "chat",
          message: message.text,
        });
      }
    }
  });

  socket.on("close", () => {
    const roomId = socket.roomId;
    if (roomId && rooms[roomId]) {
      rooms[roomId].delete(socket);
      console.log(`Client left room: ${roomId}`);
    }
  });
});

function broadcast(roomId, data) {
  if (rooms[roomId]) {
    rooms[roomId].forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify(data));
      }
    });
  }
}
