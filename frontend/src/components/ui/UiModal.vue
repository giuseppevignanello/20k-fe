<template>
    <div v-show="visible" class="modal-overlay" @click.self="close">
        <div class="modal-content">
            <button v-if="hasClose" class="modal-close" @click="close">✖</button>
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        visible: {
            type: Boolean,
            required: true,
        },
        hasClose: {
            type: Boolean,
            default: true,
        },
    },
    methods: {
        close() {
            this.$emit("close");
        },
    },
    computed: {
        listeners() {
            return { ...this.$attrs };
        },
    },
};
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    border-radius: 8px;
    padding: 20px;
    max-width: 90%;
    max-height: 90%;
    overflow-y: auto;
    position: relative;
}

.modal-close {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
}
</style>