<template>
    <div>
        <div v-if="!isConnected">
            <input v-model="joinRoomId" placeholder="Enter Room ID" />
            <button @click="joinRoom">Join Room</button>
        </div>
        <!-- room details -->
        <div v-if="isConnected" class="room-details">
            <span><strong>Points:</strong> {{ roomDetails.score }}</span>
            <span><strong>Users:</strong> {{ roomDetails.users.length }}</span>
            <span><strong>Current User:</strong> {{ username }}</span>
        </div>

        <UiModal :visible="showAddUsernameModal" @close="showAddUsernameModal = false">
            <AddUserNameModal :room-id="joinRoomId" @user-joined="handleUserJoined" />
        </UiModal>

        <GameRoom v-if="isConnected" :gameDataProp="gameData">

        </GameRoom>

    </div>
</template>

<script>
import axios from "axios";
import UiModal from "./ui/UiModal.vue";
import AddUserNameModal from "./AddUserNameModal.vue";
import GameRoom from "./GameRoom.vue";

export default {
    components: { UiModal, AddUserNameModal, GameRoom },
    data() {
        return {
            joinRoomId: "",
            showAddUsernameModal: false,
            isConnected: false,
            roomDetails: null,
            username: "",
            gameData: {
                username: null,
                score: null,
                users: null,
                roomDetails: null,
                isConnected: null,
                showAddUsernameModal: null,
            }
        };
    },
    methods: {
        async joinRoom() {
            const response = await axios.get(
                `http://localhost:3000/room-exists/${this.joinRoomId}`
            );
            if (!response.data.exists) {
                alert("Room does not exist!");
                return;
            } else if (response.data.full) {
                alert("Room is full!");
                return;
            }

            this.showAddUsernameModal = true;
        },
        handleUserJoined({ username, roomDetails, score, users }) {
            this.username = username;
            this.score = score;
            this.users = users;
            this.roomDetails = roomDetails;
            this.isConnected = true;
            this.showAddUsernameModal = false;
            this.gameData = {
                username: username,
                score: score,
                users: users,
                roomId: this.joinRoomId,
                roomDetails: this.roomDetails,
                isConnected: this.isConnected,
                showAddUsernameModal: this.showAddUsernameModal,
            }
        },
    },
    created() {
        window.addEventListener("room-update", (event) => {
            const { users, score, roomId } = event.detail;
            if (roomId === this.joinRoomId) {
                this.roomDetails = { ...this.roomDetails, users, score };
            }
        });
        window.addEventListener("room-full", () => {
            // TODO: Change this alert with an effective message;
            alert("Room is full!");
        });
    },
};
</script>
