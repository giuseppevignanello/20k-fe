const DealerSelectionService = require("../Services/DealerSelectionService");

class PreGamePhaseController {
  constructor(room) {
    this.room = room;
  }

  startDealerPhase() {
    const dealerSelectionService = new DealerSelectionService(this.room);
    return dealerSelectionService.selectFirstDealer();
  }

  firstThreeCardsDistribution() {
    return ["AA", "BB", "CC", "DD"];
  }
}

module.exports = PreGamePhaseController;
