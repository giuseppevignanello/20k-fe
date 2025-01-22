<template>
    <div>
        <p> <strong> {{ user.username }} </strong></p>
        <ul class="flex gap-2">
            <li class="list-unstyled" v-for="(card, index) in user.visibleCards" :key="index" :style="{
                '--card-index': index,
                '--card-rotation': (Math.random() * 10 - 5).toFixed(2)
            }">
                <img :src="`/cards/${card.value + card.suit}.png`" :alt="`${card.value} ${card.suit}`" width="80px"
                    height="100px" />
            </li>
        </ul>
    </div>
</template>


<script>

export default {
    props: {
        user: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {

        };
    },
    methods: {


    },
};
</script>


<style scoped>
.flex {
    display: flex;
}

.gap-2 {
    gap: 10px;
}

.list-unstyled {
    list-style-type: none;
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
