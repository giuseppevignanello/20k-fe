<template>
    <div>
        <div class="mb-3">
            <UiSelect
                :label-text="'Punti'"
                v-model="settings.maxScore"
                :option-texts="['40', '20', '10']"
                :option-values="[40, 20, 10]"
                default-value="Seleziona il punteggio"
                :error-condition="errors.maxScore"
                error-text="Il punteggio è obbligatorio"
            />
        </div>
        <div class="mb-3">
            <UiSelect
                :label-text="'Numero di Giocatori'"
                v-model="settings.playersNum"
                :option-texts="['4', '5']"
                :option-values="[4, 5]"
                default-value="Seleziona il numero di giocatori"
                :error-condition="errors.playersNum"
                error-text="Il numero di giocatori è obbligatorio"/>
        </div>
        <UiButtonPrincipal
            :click-action="createRoom"
            button-text="Crea Stanza"/>
    </div>
</template>


<script>
import axios from "axios";
import UiSelect from "./ui/UiSelect.vue";
import UiButtonPrincipal from "./ui/UiButtonPrincipal.vue";
export default {
    name: "CreateRoomModal",
    components: {
        UiSelect,
        UiButtonPrincipal,
    },
    data() {
        return {
            settings: {
                playersNum: "",
                maxScore: "",
            },
            errors: {
                playersNum: false,
                maxScore: false,
            },
        };
    },
    methods: {
        async createRoom() {
            if (!this.settings.maxScore) {
                this.errors.maxScore = true;
            } else {
                this.errors.maxScore = false;
            }

            if (!this.settings.playersNum) {
                this.errors.playersNum = true;
            } else {
                this.errors.playersNum = false;
            }

            if (this.errors.maxScore || this.errors.playersNum) {
                return;
            }

            try {
                const baseUrl = import.meta.env.VITE_API_URL;
                const response = await axios.post(`${baseUrl}/create-room`, this.settings);
                this.$emit("room-created", response.data.roomId);
            } catch (error) {
                //TODO: change this console.error with an efective error message
                console.error("Error creating room:", error);
            }
        },
    },
};
</script>