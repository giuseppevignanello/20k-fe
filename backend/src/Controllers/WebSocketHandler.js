const Room = require("../Models/Room");
const Player = require("../Models/Player");
const Game = require("../Models/Game");

class WebSocketHandler {
  constructor(wss) {
    this.wss = wss;
    this.rooms = {};
  }

  handleConnection(socket) {
    socket.on("message", (data) => {
      const message = JSON.parse(data);
      this.handleMessage(socket, message);
    });
  }

  handleMessage(socket, message) {
    switch (message.type) {
      case "join-room":
        this.joinRoom(socket, message);
        break;
      default:
        break;
    }
  }

  joinRoom(socket, message) {
    const { roomId, username } = message;

    if (!this.rooms[roomId]) {
      socket.send(
        JSON.stringify({ type: "error", message: "Room does not exist" })
      );
      return;
    }

    const room = this.rooms[roomId];
    const player = new Player(username, socket);

    if (room.addPlayer(player)) {
      socket.roomId = roomId;
      socket.username = username;

      socket.send(
        JSON.stringify({
          type: "room-details",
          roomId,
          players: room.players,
          users: room.users,
        })
      );

      room.updateRoom();

      if (room.isFull()) {
        const game = new Game(room);
        game.start();
      }
    } else {
      socket.send(
        JSON.stringify({ type: "room-full", message: "Room is full" })
      );
      socket.close();
    }
  }
}

module.exports = WebSocketHandler;
