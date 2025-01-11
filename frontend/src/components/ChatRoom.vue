<template>
    <div>
        <h2>Room ID: {{ roomId }}</h2>
        <div v-for="message in messages" :key="message.id">
            {{ message.text }}
        </div>
        <input v-model="chatMessage" placeholder="Type a message" />
        <button @click="sendMessage">Send</button>
    </div>
</template>

<script>
export default {
    props: ["roomId"],
    data() {
        return {
            ws: null,
            messages: [],
            chatMessage: "",
        };
    },
    methods: {
        connectWebSocket() {
            this.ws = new WebSocket("ws://localhost:3000");
            this.ws.onopen = () => {
                this.ws.send(
                    JSON.stringify({ type: "join-room", roomId: this.roomId })
                );
            };
            this.ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                if (message.type === "chat" || message.type === "user-joined") {
                    this.messages.push({ text: message.message, id: Date.now() });
                }
            };
            this.ws.onclose = () => {
                console.log("Disconnected from server");
            };
        },
        sendMessage() {
            if (this.ws) {
                this.ws.send(
                    JSON.stringify({ type: "chat", text: this.chatMessage })
                );
                this.chatMessage = "";
            }
        },
    },
    mounted() {
        this.connectWebSocket();
    },
};
</script>