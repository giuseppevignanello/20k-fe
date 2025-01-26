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

export default {
    components: { UserSlot, UiModal, SuitSelectionModal },
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
                if (index >= dealerDistributionCards.value.length) {
                    dealerDistributionCards.value = [];
                    isDistributionComplete.value = true;
                    setTimeout(() => {
                        distributeFirstThreeCards();
                        suitSelectionPhase.value = true;
                    }, 2000);
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
            gameData.status = "three-card-distributed"
        }

        // TODO: call this function only when userCards is populated to avoid concat error
        function distributeTwoCards() {
            gameData.users.forEach((user) => {
                user.userCards = user.userCards.concat(userTwoCards.value.value);
            })
            gameData.status = "two-card-distributed"

        }

        function showSuitSelectionModal() {
            const dealerIndex = gameData.users.findIndex(user => user.username === gameData.dealer.username);

            const firstToTalkIndex = (dealerIndex + 1) % gameData.users.length;

            const firstToTalk = gameData.users[firstToTalkIndex];

            Object.assign(userOnTurn, {
                index: firstToTalkIndex,
                user: firstToTalk
            });

            return suitSelectionPhase.value && gameData.username === firstToTalk.username;
        }


        function handleSuitSelection(event) {
            const suit = event.selectedSuit;
            suitSelectionPhase.value = false;
            websocket.sendMessage({
                type: "suit-selected",
                roomId: gameData.roomId,
                suit: suit,
            });

            console.log("Prev User On Turn")
            console.log(userOnTurn)
            const newIndex = (userOnTurn.index + 1) % gameData.users.length;
            userOnTurn.index = newIndex;
            userOnTurn.user = gameData.users[newIndex];

            console.log("New User On Turn")
            console.log(userOnTurn)

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


        return {
            dealerDistributionCards,
            selectedDealer,
            gameData,
            isDistributionComplete,
            orderedUsers,
            connectWebSocket,
            distributeDealerSelectionCards,
            distributeFirstThreeCards,
            distributeTwoCards,
            calculateVisualOrder,
            userFirstThreeCards,
            userTwoCards,
            showSuitSelectionModal,
            handleSuitSelection,
            userOnTurn,
            getUserOnTurn
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
            const { roomId, suit } = event.detail;
            if (roomId === this.gameData.roomId) {
                this.gameData.suit = suit;
            }
        });
        this.emitter.on('suit-selected', (suit) => {
            this.handleSuitSelection(suit);
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
    height: 100%;
}

.user-card {
    position: absolute;
    width: 300px;
    height: 150px;
    transform-origin: center;
}

/* Positions for 5 players */
.user-card.position-0 {
    bottom: 25%;
    left: 50%;
    transform: translateX(-50%);
}

.user-card.position-1 {
    bottom: 50%;
    right: 10%;
}

.user-card.position-2 {
    top: 0%;
    right: 45%;
}

.user-card.position-3 {
    top: 20%;
    left: 5%;
}

.user-card.position-4 {
    bottom: 30%;
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
