<template>
    <div>
        <div class="flex justify-center mt-1" v-if="!isConnected">
            <UiInputText
                v-model="joinRoomId"
                default-value="$t('room.enter_room_id')"
                label-text="$t('room.room_id')"
                :error-condition="roomIdErrorText"
                :error-text="roomIdErrorText"
            />
            <UiButtonPrincipal
                :click-action="joinRoom"
                :button-text="$t('room.join_room')"
            />
        </div>
        <!-- room details -->
        <div v-if="isConnected" class="room-details">
            <span><strong>{{ $t('common.points') }}</strong> {{ roomDetails.score }}</span>
            <span><strong>{{ $t('common.users') }}:</strong> {{ roomDetails.users.length }}</span>
            <span><strong>{{ $t('common.current_user') }}:</strong> {{ username }}</span>
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
import UiInputText from "./ui/UiInputText.vue";
import UiButtonPrincipal from "./ui/UiButtonPrincipal.vue";

export default {
    components: { UiModal, AddUserNameModal, GameRoom, UiInputText, UiButtonPrincipal },
    data() {
        return {
            joinRoomId: "",
            roomIdErrorText: null,
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
            const baseUrl = import.meta.env.VITE_API_BASE_URL;
            const response = await axios.get(
                `${baseUrl}/room-exists/${this.joinRoomId}`
            );

            this.roomIdErrorText = !this.joinRoomId;
            
            if(!this.joinRoomId) {
                this.roomIdErrorText = "$t('error.room_id_required')";
                return;
            }
            else if (!response.data.exists) {
                this.roomIdErrorText = "$t('error.room_not_found')";
                return;
            } else if (response.data.full) {
                this.roomIdErrorText = "$t('error.room_full')";
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
            this.roomIdErrorText = "$t('error.room_full')";
            return;
        });
    },
};
</script>
