<template>
    <div>
        <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <input v-model="username" type="text" class="form-control" name="username" id="username" value="username"
                aria-describedby="helpId" placeholder="" />
        </div>

        <button @click="joinRoomWithUserName">Join Room</button>
    </div>
</template>


<script>
import { websocket } from "../websocket"
export default {
    props: {
        roomId: {
            type: String,
            required: true,
        },

    },
    data() {
        return {
            username: "",
            messages: [],
        };
    },
    methods: {
        connectWebSocket() {
            websocket.connect("ws://localhost:3000");
        },
        async joinRoomWithUserName() {
            if (!this.username) {
                //TODO: change this alert with an efective error message
                alert("Scrivi un nome utente");
                return;
            }
            websocket.sendMessage({
                type: "join-room",
                roomId: this.roomId,
                username: this.username,
            });
        },
    },
    mounted() {
        this.connectWebSocket();
        window.addEventListener("room-details", (event) => {
            this.$emit("user-joined", {
                score: event.detail.score,
                users: event.detail.users,
                username: this.username,
                roomDetails: {
                    users: [this.username],
                },
            });
        });
    }
};
</script>