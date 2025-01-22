const Deck = require("../Models/Deck");
const DealerSelectionService = require("../Services/DealerSelectionService");

class PreGamePhaseController {
  constructor(room) {
    this.room = room;
    this.deckModel = new Deck();
  }

  startDealerPhase() {
    const dealerSelectionService = new DealerSelectionService(this.room);
    return dealerSelectionService.selectFirstDealer();
  }

  firstThreeCardsDistribution() {
    const deck = this.deckModel.getRandomDeck();
    const firstThreeCards = [];
    this.room.users.forEach((user) => {
      const cards = deck.splice(0, 3);
      firstThreeCards[user.username] = cards;
    });
    return firstThreeCards;
  }
}

module.exports = PreGamePhaseController;
