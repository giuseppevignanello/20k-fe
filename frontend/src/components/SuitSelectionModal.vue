<template>
    <div>
        <h3>Seleziona il seme che sarà la briscola per questo turno</h3>
        <div class="flex flex-col align-center">
            <div class="flex gap-2 mb-2">
                <div v-for="(suit, index) in suits" :key="index">
                    <img @click="suitSelection(suit)" :src="`cards/1${suit}.png`" :alt="`asso di ${suit}`" width="80px"
                        height="100px" />
                </div>
            </div>
        </div>
        <h3>Le tue carte</h3>
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
    },
    data() {
        return {
            suits: [
                'mazze',
                'denari',
                'coppe',
                'spade'
            ]
        };
    },

    methods: {
        suitSelection(suit) {
            this.emitter.emit("suit-selected", {
                selectedSuit: suit,
            });
        },
    },
};
</script>