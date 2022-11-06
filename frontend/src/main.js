import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import Toast from "primevue/toast";
import Card from "primevue/card";
import Skeleton from 'primevue/skeleton';

// import "primevue/resources/themes/vela-green/theme.css"; //theme
import "primevue/resources/themes/lara-dark-indigo/theme.css"
import "primevue/resources/primevue.min.css"; //core css
import "primeicons/primeicons.css"; //icons

let app = createApp(App)
app.use(router)
app.use(PrimeVue)
app.use(ToastService)
app.use(Skeleton)
// eslint-disable-next-line
app.component("Toast", Toast)
// eslint-disable-next-line
app.component('Card', Card)
app.mount("#app");


// app.component('ToastService', ToastService);