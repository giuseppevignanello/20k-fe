<template>
    <div class="flex justify-center">
        <button
            class="bg-primary text-white font-bold p-05 rounded"
            type="button" @click="showCreateRoomModal = true">
            Create Room
        </button>
    </div>
    <UiModal :visible="showCreateRoomModal" @close="showCreateRoomModal = false">
        <CreateRoomModal @room-created="setRoomId" />
    </UiModal>
    <div v-show="showCreateRoomModal">

    </div>
    <div v-if="roomId != null" class="flex">
        Room Id
        <input class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight" type="text"
            :value="roomId" disabled>
        <button
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button" @click="copyURL(roomId)">
            Copy
        </button>
        <div v-if="copied" class="copied p-3 rounded">Copied!</div>

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
            copied: false

        };
    },
    methods: {
        setRoomId(id) {
            this.roomId = id;
            this.showCreateRoomModal = false;
        },
        async copyURL(text) {
            try {
                await navigator.clipboard.writeText(text);
                this.copied = true;
                // setTimeout(() => {
                //     this.copied = false;
                // }, 3000);
            } catch ($e) {
                alert('Cannot copy');
            }
        }
    },
};
</script>
