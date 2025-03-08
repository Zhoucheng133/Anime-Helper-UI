import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { definePreset } from '@primeuix/themes';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import { createPinia } from 'pinia';
import router from './router';

const color="sky";
const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: `{${color}.50}`,
      100: `{${color}.100}`,
      200: `{${color}.200}`,
      300: `{${color}.300}`,
      400: `{${color}.400}`,
      500: `{${color}.500}`,
      600: `{${color}.600}`,
      700: `{${color}.700}`,
      800: `{${color}.800}`,
      900: `{${color}.900}`,
      950: `{${color}.950}`
    }
  }
});

const pinia = createPinia()

const app = createApp(App);

app.use(router)
app.use(pinia)
app.use(PrimeVue, {
  theme: {
    preset: MyPreset
  }
});

app.mount('#app')
