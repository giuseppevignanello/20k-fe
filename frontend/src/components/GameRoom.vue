<template>
    <div class="game-table">
        <div v-if="gameData && gameData.users" class="players-circle">
            <div v-for="(user, index) in calculateVisualOrder(gameData.users, gameData.username)" :key="index"
                class="user-card" :class="[
                    'position-' + index,
                    { 'current-player': user.username === username }]">
                <p> <strong> {{ user.username }} </strong></p>
                <ul class="flex gap-2">
                    <li class="list-unstyled" v-for="(card, index) in user.visibleCards" :key="index" :style="{
                        '--card-index': index,
                        '--card-rotation': (Math.random() * 10 - 5).toFixed(2) // Rotazione casuale tra -5 e 5 gradi
                    }">
                        <img :src="`/cards/${card.value + card.suit}.png`" :alt="`${card.value} ${card.suit}`"
                            width="80px" height="100px" />
                    </li>

                </ul>
            </div>
            <div v-if="isDistributionComplete">
                Il dealer è {{ gameData.dealer.username }}
            </div>
        </div>
    </div>
</template>


<script>
import { websocket } from "../websocket"

export default {
    props: {
        gameDataProp: {
            type: Object,
            required: true,
        },

    },
    data() {
        return {
            dealerDistributionCards: null,
            selectedDealer: null,
            gameData: {
                users: [],
            },
            isDistributionComplete: false,
        };
    },
    methods: {
        connectWebSocket() {
            websocket.connect("ws://localhost:3000");
        },
        distributeCards() {
            if (!this.dealerDistributionCards.length) return;

            this.gameData.users.forEach((user) => {
                if (!user.cards) user.cards = [];
                user.visibleCards = [];
            });

            let userIndex = 0;
            const distributeNextCard = (index) => {
                if (index >= this.dealerDistributionCards.length) {
                    this.dealerDistributionCards = [];
                    this.isDistributionComplete = true;
                    return;
                }

                const card = this.dealerDistributionCards[index];
                this.gameData.users[userIndex].cards.push(card);
                this.gameData.users[userIndex].visibleCards.push(card);

                userIndex = (userIndex + 1) % this.gameData.users.length;

                setTimeout(() => distributeNextCard(index + 1), 300);
            };

            distributeNextCard(0);
            this.gameData.dealer = this.selectedDealer;
        },

        calculateVisualOrder(users, currentUsername) {
            if (!users || !currentUsername) return users;

            const currentUserIndex = users.findIndex(user => user.username === currentUsername);
            if (currentUserIndex === -1) return users;

            return [
                ...users.slice(currentUserIndex),
                ...users.slice(0, currentUserIndex)
            ];
        }

    },

    mounted() {
        this.gameData = this.gameDataProp;
        this.connectWebSocket();
    },
    created() {
        window.addEventListener("dealer-selection", (event) => {
            console.log(event);
            this.dealerDistributionCards = event.detail.distributedCards;
            this.selectedDealer = event.detail.tenOfDenariPlayer;
            this.distributeCards();
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

.flex {
    display: flex;
}

.gap-2 {
    gap: 10px;
}

.list-unstyled {
    list-style-type: none;
}

.user-card {
    border: 1px solid #ddd;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
    background-color: #f9f9f9;
}

.user-card p {
    margin: 5px 0;
}

.user-card ul {
    position: relative;
    width: 100px;
    height: 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.user-card li {
    position: absolute;
    top: calc(var(--card-index) * 5px);
    left: 0;
    z-index: var(--card-index);
    transition: transform 0.3s ease, top 0.3s ease;
}

.user-card li:hover {
    transform: translateY(-40px);
}
</style>
