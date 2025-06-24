<template>
           <button @click="clickAction" type="button" class="bg-primary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                {{ buttonText }}
           </button>
</template>

<script>
export default {
    name: "UiButtonPrincipal",
    props: {
        clickAction: {
            type: Function,
            required: true,
        },
        buttonText: {
            type: String,
            default: "Click",
        },
    },
};
</script>