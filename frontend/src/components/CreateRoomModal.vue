<template>
    <div>
        <div class="mb-3">
            <UiSelect
                :label-text="'Punti'"
                v-model="settings.score"
                :option-texts="['40', '20', '10']"
                :option-values="[40, 20, 10]"
                default-value="Seleziona il punteggio"
                :error-condition="errors.score"
                error-text="Il punteggio è obbligatorio"
            />
        </div>
        <div class="mb-3">
            <UiSelect
                :label-text="'Giocatori'"
                v-model="settings.players"
                :option-texts="['4', '5']"
                :option-values="[4, 5]"
                default-value="Seleziona il numero di giocatori"
                :error-condition="errors.players"
                error-text="Il numero di giocatori è obbligatorio"/>
        </div>
        


        <button @click="createRoom">Create Room</button>
    </div>
</template>


<script>
import axios from "axios";
import UiSelect from "./ui/UiSelect.vue";
export default {
    name: "CreateRoomModal",
    components: {
        UiSelect,
    },
    data() {
        return {
            settings: {
                players: "",
                score: "",
            },
            errors: {
                players: false,
                score: false,
            },
        };
    },
    methods: {
        async createRoom() {
            if (!this.settings.score) {
                this.errors.score = true;
            } else {
                this.errors.score = false;
            }

            if (!this.settings.players) {
                this.errors.players = true;
            } else {
                this.errors.players = false;
            }

            if (this.errors.score || this.errors.players) {
                return;
            }

            try {
                const response = await axios.post("http://localhost:3000/create-room", this.settings);
                this.$emit("room-created", response.data.roomId);
            } catch (error) {
                //TODO: change this console.error with an efective error message
                console.error("Error creating room:", error);
            }
        },
    },
};
</script>