const DealerSelectionService = require("../Services/DealerSelectionService");

class PreGamePhaseController {
  constructor(room) {
    this.room = room;
  }

  startDealerPhase() {
    const dealerSelectionService = new DealerSelectionService(this.room);
    dealerSelectionService.selectFirstDealer();
  }
}

module.exports = PreGamePhaseController;
