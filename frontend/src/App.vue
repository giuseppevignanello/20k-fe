<template>
  <div>
    <div class="flex justify-center">
        <h1>Game Rooms</h1>
        
    </div>
    <div>
      <CreateRoom />
      <JoinRoom />
    </div>
  </div>
</template>

<script>
import CreateRoom from "./components/CreateRoom.vue";
import JoinRoom from "./components/JoinRoom.vue";

export default {
  components: { CreateRoom, JoinRoom },
};
</script>
