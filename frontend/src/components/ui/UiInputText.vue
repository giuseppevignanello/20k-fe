<template>
    <div class="flex flex-col">
        <label class="font-bold font-size-1">{{ labelText }}</label>
        <input type="text" v-model="model" :placeholder="defaultValue" class="input-text" :name="model" :id="model" :value="model"/>
        <ErrorText :condition="errorCondition" :text="errorText"/>
    </div>
</template>

<script>
import ErrorText from "./ErrorText.vue";
export default {
    name: "UiInputText",
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