<template>
    <div class="error" v-if="condition">
        <small class="text-alert">{{ text }} </small>
    </div>
</template>

<script>
export default {
    props: {
        condition: {
            type: Boolean,
            required: true,
        },
        text: {
            type: String,
            default: "This field is required.",
        },
    },
};
</script>