const DealerSelectionService = require("../Services/DealerSelectionService");

class PreGamePhaseController {
  constructor(room) {
    this.room = room;
  }

  startDealerPhase() {
    const dealerSelectionService = new DealerSelectionService(this.room);
    const dealerSelection = dealerSelectionService.selectFirstDealer();
    const dealer = dealerSelection.tenOfDenariPlayer;
    this.room.reorderUsers(dealer);
  }
}

module.exports = PreGamePhaseController;
