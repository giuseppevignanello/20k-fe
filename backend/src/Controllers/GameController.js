const PreGamePhaseController = require("./PreGamePhaseController");

class GameController {
  constructor(room) {
    this.room = room;
  }

  start() {
    const preGamePhaseController = new PreGamePhaseController(this.room);
    const dealerResponse = preGamePhaseController.startDealerPhase();
    const firstThreeCardsDistribution =
      preGamePhaseController.firstThreeCardsDistribution();

    this.room.broadcast(dealerResponse);

    this.room.users.forEach((user, index) => {
      const playerCards = {
        type: "initial-cards",
        cards: firstThreeCardsDistribution[index],
      };

      user.socket.send(JSON.stringify(playerCards));
    });
  }
}

module.exports = GameController;
