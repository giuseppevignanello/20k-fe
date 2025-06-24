<template>
    <div>
        <p> <strong> {{ user.username }} </strong></p>
        <div v-if="userOnTurn.user.username == user.username">
            è il tuo turno
        </div>

        <div v-if="user.dealerDistributionVisibleCards">
            <ul class="flex gap-2 dealer-cards-ul">
                <li class="list-unstyled dealer-cards-li" v-for="(card, index) in user.dealerDistributionVisibleCards"
                    :key="index" :style="{
                        '--card-index': index,
                        '--card-rotation': (Math.random() * 10 - 5).toFixed(2)
                    }">
                    <img :src="`/cards/${card.value + card.suit}.png`" :alt="`${card.value} ${card.suit}`" width="80px"
                        height="100px" />
                </li>
            </ul>
        </div>
        <div v-if="user.userCards" class="hand-container">
            <div v-if="isCurrentUser">
                <ul class="card-hand">
                    <li v-for="(card, index) in user.userCards" :key="card.value + card.suit" :class="getCardClass(index)">
                        <img :src="`/cards/${card.value + card.suit}.png`" :alt="`${card.value} ${card.suit}`"
                            class="card-img" />
                    </li>
                </ul>
            </div>
            <div v-else class="hand-container">
                <ul class="card-hand-back">
                    <li v-for="(card, index) in getBackCardCounter()" :key="index" :class="getCardClass(index)">
                        <img :src="`/back-card.jpg`" alt="back-card" class="card-img" />
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>


<script>

export default {
    props: {
        user: {
            type: Object,
            required: true,
        },
        currentUsername: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
        userOnTurn: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
        };
    },
    methods: {
        getCardClass(index) {
            return index < 3 ? 'card-bottom' : 'card-top';
        },
        getBackCardCounter() {
            if (this.status == 'three-card-distributed') {
                return 3;
            } else if (this.status == 'two-card-distributed') {
                return 5;
            }
        }
    },
    computed: {
        isCurrentUser() {
            return this.user.username === this.currentUsername;
        }

    }
};
</script>


<style scoped>
.card-hand, .card-hand-back {
  position: relative;
  width: 100%;
  height: 140px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.card-hand li, .card-hand-back li {
  position: absolute;
  transition: transform 0.3s ease, z-index 0.3s;
}

.card-img {
  width: 80px;
  height: 100px;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  cursor: pointer;
}

.card-bottom {
    z-index: 1;
}

.card-bottom:nth-child(1) {
  transform: translate(-55px, 10px) rotate(-20deg);
}
.card-bottom:nth-child(2) {
  transform: translate(0px, 5px) rotate(0deg);
}
.card-bottom:nth-child(3) {
  transform: translate(55px, 10px) rotate(20deg);
}

.card-top:nth-child(4) {
  transform: translate(-35px, -60px) rotate(-10deg);
}
.card-top:nth-child(5) {
  transform: translate(35px, -60px) rotate(10deg);
}

.card-hand li:hover {
  transform: translateY(-20px) scale(1.05) !important;
  z-index: 10;
}

.user-card p {
    margin: 5px 0;
}

.user-card .dealer-cards-ul {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.user-card .dealer-cards-li {
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
