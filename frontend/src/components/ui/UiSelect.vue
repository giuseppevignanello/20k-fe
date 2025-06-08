<template>
            <label>{{ labelText }}</label>
             <select v-model="model">
                <option v-for="(text, index) in optionTexts" :key="index" :value="optionValues[index]">
                    {{ text }}
                </option>
            </select>
            <ErrorText :condition="errorCondition" :text="errorText"/>
</template>

<script>
import ErrorText from "./ErrorText.vue";
export default {
    name: "UiSelect",
    components: {
        ErrorText,
    },
    props: {
        modelValue: {
            required: true,
        },
        defaultValue: {
            type: String,
            default: "Select an option",
        },
        optionTexts: {
            type: Array,
        },
        optionValues: {
            type: Array,
        },
        labelText: {
            type: String,
            default: "Select an option",
        },
        errorCondition: {
            type: Boolean,
            default: false,
        },
        errorText: {
            type: String,
            default: "This field is required",
        },
    },
    computed: {
        model: {
            get() {
                return this.modelValue;
            },
            set(value) {
                this.$emit("update:modelValue", value);
            },
        },
    },
};
</script>