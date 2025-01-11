<template>
    <div>
        <input v-model="joinRoomId" placeholder="Enter Room ID" />
        <button @click="joinRoom">Join Room</button>
    </div>
</template>

<script>
import axios from "axios";

export default {
    props: ["onRoomJoined"],
    data() {
        return {
            joinRoomId: "",
        };
    },
    methods: {
        async joinRoom() {
            const response = await axios.get(
                `http://localhost:3000/room-exists/${this.joinRoomId}`
            );
            if (response.data.exists) {
                this.onRoomJoined(this.joinRoomId);
            } else {
                alert("Room does not exist!");
            }
        },
    },
};
</script>