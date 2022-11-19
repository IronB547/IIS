import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import Toast from "primevue/toast";
import Card from "primevue/card";
import { createPinia } from 'pinia'
import ConfirmationService from 'primevue/confirmationservice';
import Tooltip from 'primevue/tooltip';

// import "primevue/resources/themes/vela-green/theme.css"; //theme
import "primevue/resources/themes/lara-dark-indigo/theme.css"
import "primevue/resources/primevue.min.css"; //core css
import "primeicons/primeicons.css"; //icons

let app = createApp(App)
const pinia = createPinia()
app.use(pinia)

app.use(router)
app.use(PrimeVue, {ripple: true})
app.use(ToastService)
app.use(ConfirmationService)
app.directive('tooltip', Tooltip);

// eslint-disable-next-line
app.component("Toast", Toast)
// eslint-disable-next-line
app.component('Card', Card)
app.mount("#app");


// app.component('ToastService', ToastService);