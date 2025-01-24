<template>
    <div>
        <p> <strong> {{ user.username }} </strong></p>
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
        <div v-if="user.userCards">
            <div v-if="isCurrentUser">
                <ul class="flex gap-2">
                    <li class="list-unstyled" v-for="(card) in user.userCards" :key="card.value + card.suit">
                        <img :src="`/cards/${card.value + card.suit}.png`" :alt="`${card.value} ${card.suit}`"
                            width="80px" height="100px" />
                    </li>
                </ul>
            </div>
            <div v-else>
                <!-- TODO: change with a dynamic information -->
                <ul class="flex gap-2">
                    <li class="list-unstyled" v-for="(index) in 3" :key="index">
                        <img :src="`/back-card.jpg`" :alt="back - card" width="80px" height="100px" />
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
        }
    },
    data() {
        return {

        };
    },
    methods: {
    },
    computed: {
        isCurrentUser() {
            return this.user.username === this.currentUsername;
        }
    }
};
</script>


<style scoped>
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
