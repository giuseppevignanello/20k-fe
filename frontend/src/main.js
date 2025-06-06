import { createApp } from "vue";
import mitt from "mitt";
import App from "./App.vue";
import '../public/style.css'

const emitter = mitt();
const app = createApp(App);

app.config.globalProperties.emitter = emitter;
app.mount("#app");
