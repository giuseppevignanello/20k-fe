class Game {
  constructor(room) {
    this.room = room;
    this.deck = this.generateDeck();
  }

  generateDeck() {
    return [];
  }

  start() {
    this.room.startGame();
    this.distributeCards();
    this.startTurn();
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

module.exports = Game;
