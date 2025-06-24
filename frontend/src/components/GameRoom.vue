<template>
    <div class="game-table">
        <div v-if="gameData && gameData.users" class="players-circle">
            <div v-for="(user, index) in calculateVisualOrder(gameData.users, gameData.username)" :key="index">
                <UserSlot :userOnTurn="getUserOnTurn()" :status="gameData.status" :user="user"
                    :currentUsername="gameData.username" class="user-card" :class="[
                        'position-' + index]">
                </UserSlot>
                <UiModal v-if="user.userCards" :visible="showSuitSelectionModal()" :hasClose="false"
                    @close="suitSelectionPhase = false">
                    <SuitSelectionModal :userCards="user.userCards" />
                </UiModal>
                {{ user.username }}
                {{ index }}
                <UiModal v-if="showPlayingDecisionPhaseModal()" :visible="showPlayingDecisionPhaseModal()"
                    :hasClose="false">
                    <PlayingDecisionPhaseModal :user="user" :userCards="user.userCards" />
                </UiModal>
            </div>
            <div v-if="isDistributionComplete">
                Il dealer è {{ gameData.dealer.username }}
            </div>
            <div v-if="gameData.suit">
                La briscola è {{ gameData.suit }}
            </div>
        </div>
    </div>
</template>


<script>
import { ref, reactive, computed } from 'vue';
import { websocket } from "../websocket"
import UserSlot from "./UserSlot.vue";
import UiModal from "./ui/UiModal.vue"
import SuitSelectionModal from "./SuitSelectionModal.vue";
import PlayingDecisionPhaseModal from "./PlayingDecisionPhaseModal.vue"

export default {
    components: { UserSlot, UiModal, SuitSelectionModal, PlayingDecisionPhaseModal },
    props: {
        gameDataProp: {
            type: Object,
            required: true,
        },
    },
    setup() {
        const userFirstThreeCards = ref([]);
        const userTwoCards = ref([]);
        const dealerDistributionCards = ref(null);
        const selectedDealer = ref(null);
        let userOnTurn = reactive({ index: null, user: [] });
        const dealerIndex = ref(null);
        const gameData = reactive({
            users: [],
            dealer: {
                'username': null,
            },
            suit: null,
            status: 'pre-game',
        });
        const isDistributionComplete = ref(false);
        const suitSelectionPhase = ref(false);
        const playingDecisionPhase = ref(false);

        const orderedUsers = computed(() =>
            calculateVisualOrder(gameData.users, gameData.username)
        );

        function connectWebSocket() {
            websocket.connect("ws://localhost:3000");
        }

        function distributeDealerSelectionCards() {
            if (!dealerDistributionCards.value.length) return;

            gameData.users.forEach((user) => {
                if (!user.cards) user.cards = [];
                user.dealerDistributionVisibleCards = [];
            });

            let userIndex = 0;
            const distributeNextCard = (index) => {
                
                // distribution completed
                if (index >= dealerDistributionCards.value.length) {
                    dealerDistributionCards.value = [];
                    gameData.dealer = selectedDealer.value;
                    isDistributionComplete.value = true;
                    setTimeout(() => {
                        // distributeFirstThreeCards();
                        // start suit selection phase
                        suitSelectionPhase.value = true;
                        console.log("Dealer selection completed, starting suit selection phase");
                    }, 1500);
                    return;
                }

                const card = dealerDistributionCards.value[index];
                gameData.users[userIndex].cards.push(card);
                gameData.users[userIndex].dealerDistributionVisibleCards.push(card);

                userIndex = (userIndex + 1) % gameData.users.length;

                setTimeout(() => distributeNextCard(index + 1), 300);
            };

            distributeNextCard(0);
            gameData.dealer = selectedDealer.value;
        }

        function distributeFirstThreeCards() {
            gameData.users.forEach((user) => {
                user.dealerDistributionVisibleCards = [];
                user.userCards = userFirstThreeCards.value.value;
            });
            gameData.status = "three-card-distributed";
            startSuitSelectionPhase();

        }

        // TODO: call this function only when userCards is populated to avoid concat error
        function distributeTwoCards() {
            gameData.users.forEach((user) => {
                user.userCards = user.userCards.concat(userTwoCards.value.value);
            })
            gameData.status = "two-card-distributed"

        }

        function startSuitSelectionPhase() {
            dealerIndex.value = gameData.users.findIndex(user => user.username === gameData.dealer.username);

            const firstToTalkIndex = (dealerIndex.value + 1) % gameData.users.length;

            const firstToTalk = gameData.users[firstToTalkIndex];

            Object.assign(userOnTurn, {
                index: firstToTalkIndex,
                user: firstToTalk
            });
        }

        function showSuitSelectionModal() {
            return suitSelectionPhase.value && gameData.username === userOnTurn.user.username;
        }

        function showPlayingDecisionPhaseModal() {
            return playingDecisionPhase.value && gameData.username === userOnTurn.user.username;
        }


        function handleSuitSelection(event) {
            const suit = event.selectedSuit;
            suitSelectionPhase.value = false;

            websocket.sendMessage({
                type: "suit-selected",
                roomId: gameData.roomId,
                suit: suit,
                userOnTurnIndex: userOnTurn.index,
            });

        }

        function handlePlayingDecision(event) {
            const playingDecision = event.playingDecision;
            const user = event.user;
            websocket.sendMessage({
                type: "playing-decision",
                roomId: gameData.roomId,
                playingDecision: playingDecision,
                user: user,
                userOnTurnIndex: userOnTurn.index,
            });

        }

        function calculateVisualOrder(users, currentUsername) {
            if (!users || !currentUsername) return users;

            const currentUserIndex = users.findIndex(user => user.username === currentUsername);
            if (currentUserIndex === -1) return users;

            return [
                ...users.slice(currentUserIndex),
                ...users.slice(0, currentUserIndex)
            ];
        }

        function getUserOnTurn() {
            return (
                userOnTurn
            );
        }

        function getFirstUserAfterSuitSelection(userOnTurnIndex) {
            const newUserOnTurn = this.gameData.users[userOnTurnIndex];
            Object.assign(this.userOnTurn, {
                index: userOnTurnIndex,
                user: newUserOnTurn
            });
            playingDecisionPhase.value = true;
        }

        function changeUserDecisionTurn(userOnTurnIndex) {
            Object.assign(userOnTurn, {
                index: userOnTurnIndex,
                user: gameData.users[userOnTurnIndex]
            });
        }

        function startGame() {
            alert("Game started!");
        }


        return {
            dealerIndex,
            dealerDistributionCards,
            selectedDealer,
            gameData,
            isDistributionComplete,
            orderedUsers,
            suitSelectionPhase,
            playingDecisionPhase,
            connectWebSocket,
            distributeDealerSelectionCards,
            distributeFirstThreeCards,
            distributeTwoCards,
            calculateVisualOrder,
            userFirstThreeCards,
            userTwoCards,
            startSuitSelectionPhase,
            handleSuitSelection,
            userOnTurn,
            getUserOnTurn,
            showSuitSelectionModal,
            showPlayingDecisionPhaseModal,
            getFirstUserAfterSuitSelection,
            handlePlayingDecision,
            changeUserDecisionTurn,
            startGame

        };
    },
    mounted() {
        Object.assign(this.gameData, this.gameDataProp);
        this.connectWebSocket();
    },
    created() {
        window.addEventListener("dealer-selection", (event) => {
            this.dealerDistributionCards = event.detail.distributedCards;
            this.selectedDealer = event.detail.tenOfDenariPlayer;
            this.distributeDealerSelectionCards();
        })
        window.addEventListener("initial-cards", (event) => {
            this.userFirstThreeCards.value = event.detail.cards;
        })
        window.addEventListener('two-cards', (event) => {
            this.userTwoCards.value = event.detail.cards;
            this.distributeTwoCards();
        })
        window.addEventListener("room-update", (event) => {
            const { roomId, users } = event.detail;
            if (roomId === this.gameData.roomId) {
                this.gameData.users = users.map(username => ({
                    username,
                    cards: [],
                    score: 0
                }));
            }
        });
        window.addEventListener("suit-selected", (event) => {
            const { roomId, suit, userOnTurnIndex } = event.detail;
            if (roomId === this.gameData.roomId) {
                this.gameData.suit = suit;
            }
            this.getFirstUserAfterSuitSelection(userOnTurnIndex);

        });
        window.addEventListener("playing-decision", (event) => {
            const { roomId, playingDecision, user, userOnTurnIndex } = event.detail;
            if (roomId === this.gameData.roomId) {
                if (userOnTurnIndex === this.dealerIndex) {
                    this.startGame();
                } else {
                    this.changeUserDecisionTurn(userOnTurnIndex);
                }
            }
        });
        this.emitter.on('suit-selected', (suit) => {
            this.handleSuitSelection(suit);
        })
        this.emitter.on('playing-decision', (decision) => {
            this.handlePlayingDecision(decision);
        })
    },
};
</script>



<style scoped>
.game-table {
    position: relative;
    width: 100%;
    height: 100vh;
}

.players-circle {
    position: relative;
    width: 100%;
    height: 80%;
}

.user-card {
    bottom: 0;
    position: absolute;
    width: 30%;
    height: 150px;
    transform-origin: center;
}

/* Positions for 5 players */
.user-card.position-0 {
    bottom: 0%;
    left: 50%;
    transform: translateX(-50%);
}

.user-card.position-1 {
    bottom: 35%;
    right: 10%;
}

.user-card.position-2 {
    top: 10%;
    right: 35%;
}

.user-card.position-3 {
    top: 40%;
    left: 5%;
}

.user-card.position-4 {
    bottom: 50%;
    left: 10%;
}

.user-card {
    border: 1px solid #ddd;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
    background-color: #f9f9f9;
}
</style>
