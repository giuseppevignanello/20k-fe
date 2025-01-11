<template>
    <div>
        <div class="mb-3">
            <label for="" class="form-label">Punti</label>
            <select v-model="settings.score" class="form-select form-select-lg" name="" id="">
                <option selected>Seleziona il punteggio</option>
                <option value="40">40</option>
                <option value="20">20</option>
                <option value="10">10</option>
            </select>
        </div>
        <div class="mb-3">
            <label for="" class="form-label">Giocatori</label>
            <select v-model="settings.players" class="form-select form-select-lg" name="" id="">
                <option selected>Seleziona il numero di giocatori</option>
                <option value="4">4</option>
                <option value="5">5</option>
            </select>
        </div>


        <button @click="createRoom">Create Room</button>
    </div>
</template>


<script>
import axios from "axios";
export default {
    data() {
        return {
            settings: {
                players: "",
                score: "",
            },
        };
    },
    methods: {
        async createRoom() {
            if (!this.settings.score || !this.settings.players) {
                //TODO: change this alert with an efective error message
                alert("Seleziona sia i punti che il numero di giocatori.");
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