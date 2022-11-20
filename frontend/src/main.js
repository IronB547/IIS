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
app.use(Vidle)

app.directive('tooltip', Tooltip);

// eslint-disable-next-line
app.component("Toast", Toast)
// eslint-disable-next-line
app.component("Card", Card)

app.mount("#app");


const timeoutInMS = 10*60*1000;
let timeoutId;

setupTimers();
function handleInactive() {
    // Here you want to logout a user and/or ping your token
    console.log("User is inactive");
}

function startTimer() { 
    // setTimeout returns an ID (can be used to start or clear a timer)
    timeoutId = setTimeout(handleInactive, timeoutInMS);
}

function resetTimer() { 
    clearTimeout(timeoutId);
    startTimer();
}
 
function setupTimers () {
    document.addEventListener("keypress", resetTimer, false);
    document.addEventListener("mousemove", resetTimer, false);
    document.addEventListener("mousedown", resetTimer, false);
    document.addEventListener("touchmove", resetTimer, false);
     
    startTimer();
}

// dark-mode media query matched or not
let matched = window.matchMedia('(prefers-color-scheme: dark)').matches;

if(matched)
	console.log('Currently in dark mode');
else
	console.log('Currently not in dark mode');

// app.component('ToastService', ToastService);