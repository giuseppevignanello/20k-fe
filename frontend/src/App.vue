<template>
  <div>
    <h1>Game Rooms</h1>
    <div v-if="!roomId">
      <CreateRoom @room-created="setRoomId" />
      <JoinRoom @room-joined="setRoomId" />
    </div>
    <div v-else>
      <ChatRoom :roomId="roomId" />
    </div>
  </div>
</template>

<script>
import CreateRoom from "./components/CreateRoom.vue";
import JoinRoom from "./components/JoinRoom.vue";
import ChatRoom from "./components/ChatRoom.vue";

export default {
  components: { CreateRoom, JoinRoom, ChatRoom },
};
</script>
