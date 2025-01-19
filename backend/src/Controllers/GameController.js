const PreGamePhaseController = require("./PreGamePhaseController");

class GameController {
  constructor(room) {
    this.room = room;
  }

  start() {
    this.room.broadcast({
      type: "game-started",
      message: "The game has started!",
    });
    const preGamePhaseController = new PreGamePhaseController(this.room);
    preGamePhaseController.startDealerPhase();
    this.startTurn();
    this.distributeCards();
  }

  distributeCards() {}

  startTurn() {
    const player = this.room.users[this.room.currentTurn];
    this.sendTurnMessage(player);
  }

  sendTurnMessage(player) {
    player.socket.send(
      JSON.stringify({
        type: "your-turn",
        message: `${player.username}'s turn`,
      })
    );
  }
}

module.exports = GameController;
