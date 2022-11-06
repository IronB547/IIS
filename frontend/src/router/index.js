import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import TicketsListView from "../views/TicketsListView.vue";
import TicketDetailView from "../views/TicketDetailView.vue";
import RequestsListView from "../views/RequestsListView.vue";
import RequestDetailView from "../views/RequestDetailView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView,
  },
  {
    path: "/tickets/:ticketId",
    name: "ticketsDetail",
    component: TicketDetailView,
  },{
    path: "/tickets",
    name: "tickets",
    component: TicketsListView,
  },
  {
    path: "/requests",
    name: "requests",
    component: RequestsListView,
  },
  {
    path: "/requests/:requestID",
    name: "requestsDetail",
    component: RequestDetailView,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
