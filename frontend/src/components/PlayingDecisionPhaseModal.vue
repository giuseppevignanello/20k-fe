<template>
    <div>
        <h3>Vuoi giocare?</h3>
        <button @click="playingDecision(true)">
            Sì
        </button>
        <button @click="playingDecision(false)">
            No
        </button>
        <h4>Le tue carte</h4>
        <div class="flex gap-2">
            <div v-for="(card, index) in userCards" :key="index">
                <img :src="`cards/${card.value}${card.suit}.png`" :alt="`carta ${card.number} di ${card.suit}`"
                    width="40px" height="50px" />
            </div>
        </div>
    </div>

</template>

<script>
export default {
    props: {
        userCards: {
            type: Object,
            required: true,
        },
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
        playingDecision(decision) {
            this.emitter.emit("playing-decision", {
                playingDecision: decision,
                user: this.user
            });
        },
    },
};
</script>