<template>
    <div v-if="gameData && gameData.users">
        <div v-for="user in gameData.users" :key="user.id" class="user-card">
            <p> <strong> {{ user.username }} </strong></p>
            <ul class="flex gap-2">
                <li class="list-unstyled" v-for="(card, index) in user.visibleCards" :key="index">
                    <img :src="`/cards/${card.value + card.suit}.png`" alt="{{ card.value }} {{ card.suit }}"
                        width="80px" height="100px" />
                </li>
            </ul>
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
            }
        };
    },
    methods: {
        connectWebSocket() {
            websocket.connect("ws://localhost:3000");
        },
        prueba() {
            websocket.send(JSON.stringify({
                type: 'join-room',
                payload: {
                    roomId: this.gameData.roomId,
                    username: this.gameData.username
                }
            }));
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
                    return;
                }

                // Aggiungi la carta all'utente corrente
                const card = this.dealerDistributionCards[index];
                this.gameData.users[userIndex].cards.push(card);
                this.gameData.users[userIndex].visibleCards.push(card);

                userIndex = (userIndex + 1) % this.gameData.users.length;

                setTimeout(() => distributeNextCard(index + 1), 300);
            };

            distributeNextCard(0);
        },
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

<style>
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
</style>
