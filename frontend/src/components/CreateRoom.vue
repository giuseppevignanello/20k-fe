<template>
    <div>
        <button @click="showCreateRoomModal = true">Create Room</button>
    </div>
    <UiModal :visible="showCreateRoomModal" @close="showCreateRoomModal = false">
        <CreateRoomModal @room-created="setRoomId" />
    </UiModal>
    <div v-show="showCreateRoomModal">

    </div>
</template>

<script>
import CreateRoomModal from "./CreateRoomModal.vue"
import UiModal from "./ui/UiModal.vue";
export default {
    components: { CreateRoomModal, UiModal },
    data() {
        return {
            showCreateRoomModal: false,
            roomId: null,
        };
    },
    methods: {
        setRoomId(id) {
            this.roomId = id;
            this.showCreateRoomModal = false;
        },
    },
};
</script>
