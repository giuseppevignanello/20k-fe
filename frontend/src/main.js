import { createApp } from "vue";
import mitt from "mitt";
import { createI18n } from "vue-i18n";
import App from "./App.vue";
import '../public/style.css'

import it from './locales/it'   
import en from './locales/en'

const i18n = createI18n({
  locale: 'it',              
  fallbackLocale: 'en',      
  messages: { 
    it,
    en
  }     
});

const emitter = mitt();
const app = createApp(App);

app.config.globalProperties.emitter = emitter;

app.use(i18n);

app.mount("#app");
