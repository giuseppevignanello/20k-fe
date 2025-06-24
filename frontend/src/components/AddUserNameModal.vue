<template>
    <div>
        <div class="mb-3">
            <UiInputText
                v-model="username"
                default-value="Inserisci il tuo nome utente"
                label-text="Nome Utente"
                :error-condition="!username"
                error-text="Il nome utente è obbligatorio"
            />
        </div>
        <UiButtonPrincipal
            :click-action="joinRoomWithUserName"
            button-text="Unisciti alla stanza"
        />
    </div>
</template>


<script>
import { websocket } from "../websocket"
import UiInputText from "./ui/UiInputText.vue";
import UiButtonPrincipal from "./ui/UiButtonPrincipal.vue";
export default {
    props: {
        roomId: {
            type: String,
            required: true,
        },

    },
    components: {
        UiInputText,
        UiButtonPrincipal,
    },
    name: "AddUserNameModal",
    data() {
        return {
            username: "",
            messages: [],
        };
    },
    methods: {
        connectWebSocket() {
            websocket.connect(import.meta.env.VITE_WS_BASE_URL);
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