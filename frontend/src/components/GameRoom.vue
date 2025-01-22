<template>
    <div class="game-table">
        <div v-if="gameData && gameData.users" class="players-circle">
            <UserSlot v-for="(user, index) in calculateVisualOrder(gameData.users, gameData.username)" :key="index"
                :user="user" class="user-card" :class="[
                    'position-' + index,
                    { 'current-player': user.username === username }]">
            </UserSlot>
            <div v-if="isDistributionComplete">
                Il dealer è {{ gameData.dealer.username }}
            </div>
        </div>
    </div>
</template>


<script>
import { ref, reactive, computed } from 'vue';
import { websocket } from "../websocket"
import UserSlot from "./UserSlot.vue";

export default {
    components: { UserSlot },
    props: {
        gameDataProp: {
            type: Object,
            required: true,
        },
    },
    setup() {
        const userFirstThreeCards = [];
        const dealerDistributionCards = ref(null);
        const selectedDealer = ref(null);
        const gameData = reactive({
            users: [],
            dealer: null,
        });
        const isDistributionComplete = ref(false);

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
                user.visibleCards = [];
            });

            let userIndex = 0;
            const distributeNextCard = (index) => {
                if (index >= dealerDistributionCards.value.length) {
                    dealerDistributionCards.value = [];
                    isDistributionComplete.value = true;
                    setTimeout(() => distributeFirstThreeCards(), 2000);
                    return;
                }

                const card = dealerDistributionCards.value[index];
                gameData.users[userIndex].cards.push(card);
                gameData.users[userIndex].visibleCards.push(card);

                userIndex = (userIndex + 1) % gameData.users.length;

                setTimeout(() => distributeNextCard(index + 1), 300);
            };

            distributeNextCard(0);
            gameData.dealer = selectedDealer.value;
        }

        function distributeFirstThreeCards() {
            gameData.users.forEach((user) => {
                user.visibleCards = [];
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

        return {
            dealerDistributionCards,
            selectedDealer,
            gameData,
            isDistributionComplete,
            orderedUsers,
            connectWebSocket,
            distributeDealerSelectionCards,
            distributeFirstThreeCards,
            calculateVisualOrder,
            userFirstThreeCards,
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
            this.userFirstThreeCards = event.detail.cards;
            console.log(event);
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
    transform-origin: center;
}

/* Positions for 5 players */
.user-card.position-0 {
    bottom: 10%;
    left: 50%;
    transform: translateX(-50%);
}

.user-card.position-1 {
    bottom: 30%;
    right: 10%;
}

.user-card.position-2 {
    top: 0%;
    right: 35%;
}

.user-card.position-3 {
    top: 20%;
    left: 20%;
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
