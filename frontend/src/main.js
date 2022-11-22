import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import { createPinia } from 'pinia'
import ConfirmationService from 'primevue/confirmationservice';
import Tooltip from 'primevue/tooltip';
import Vidle from 'v-idle-3'
import Toast from "primevue/toast";
import Card from "primevue/card";

// dark-mode media query matched or not
// import "primevue/resources/themes/vela-green/theme.css"; //theme


import "primevue/resources/primevue.min.css"; //core css
import "primeicons/primeicons.css"; //icons

let app = createApp(App)
const pinia = createPinia()
app.use(pinia)

app.use(router)
app.use(PrimeVue, {ripple: true})
app.use(ToastService)
app.use(ConfirmationService)
app.use(Vidle)

app.directive('tooltip', Tooltip);

// eslint-disable-next-line
app.component("Toast", Toast)
// eslint-disable-next-line
app.component("Card", Card)

app.mount("#app");



// if(matched)
// 	console.log('Currently in dark mode');
// else
// 	console.log('Currently not in dark mode');

// app.component('ToastService', ToastService);