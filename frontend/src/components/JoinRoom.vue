<template>
    <div>
        <input v-model="joinRoomId" placeholder="Enter Room ID" />
        <button @click="joinRoom">Join Room</button>

        <!-- room details -->
        <div v-if="isConnected" class="room-details">
            <span><strong>Points:</strong> {{ roomDetails.score }}</span>
            <span><strong>Users:</strong> {{ roomDetails.users.length }}</span>
            <span><strong>Current User:</strong> {{ username }}</span>
        </div>

        <UiModal :visible="showAddUsernameModal" @close="showAddUsernameModal = false">
            <AddUserNameModal :room-id="joinRoomId" @user-joined="handleUserJoined" />
        </UiModal>
    </div>
</template>

<script>
import axios from "axios";
import UiModal from "./ui/UiModal.vue";
import AddUserNameModal from "./AddUserNameModal.vue";

export default {
    components: { UiModal, AddUserNameModal },
    data() {
        return {
            joinRoomId: "",
            showAddUsernameModal: false,
            isConnected: false,
            roomDetails: null,
            username: "",
        };
    },
    methods: {
        async joinRoom() {
            const response = await axios.get(
                `http://localhost:3000/room-exists/${this.joinRoomId}`
            );
            if (response.data.exists) {
                this.showAddUsernameModal = true;
            } else {
                alert("Room does not exist!");
            }
        },
        handleUserJoined({ username, roomDetails }) {
            this.username = username;
            this.roomDetails = roomDetails;
            this.isConnected = true;
            this.showAddUsernameModal = false;
        },
    },
    created() {
        // Ascolta l'evento 'room-details' emesso dal websocket.js
        window.addEventListener("room-details", (event) => {
            this.roomDetails.score = event.detail.score;
            this.roomDetails.users = event.detail.users;
        });

        // Ascolta l'evento 'room-update' emesso dal websocket.js
        window.addEventListener("room-update", (event) => {
            const { users, score, roomId } = event.detail;
            if (roomId === this.joinRoomId) {
                this.roomDetails = { ...this.roomDetails, users, score };
            }
        });
    },
};
</script>
