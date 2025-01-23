const PreGamePhaseController = require("./PreGamePhaseController");

class GameController {
  constructor(room) {
    this.room = room;
  }

  start() {
    const preGamePhaseController = new PreGamePhaseController(this.room);
    const dealerResponse = preGamePhaseController.startDealerPhase();
    const firstThreeCardsDistributionResponse =
      preGamePhaseController.firstThreeCardsDistribution();
    const firstThreeCardsDistribution =
      firstThreeCardsDistributionResponse.firstThreeCards;
    this.room.remainingDeck = firstThreeCardsDistributionResponse.remainingDeck;
    this.room.broadcast(dealerResponse);

    this.room.users.forEach((user, index) => {
      const playerCards = {
        type: "initial-cards",
        cards: firstThreeCardsDistribution[user.username],
      };

      user.socket.send(JSON.stringify(playerCards));
    });
  }
}

module.exports = GameController;
