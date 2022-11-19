import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import TicketsListView from "../views/TicketsListView.vue";
import TicketDetailView from "../views/TicketDetailView.vue";
import NewTicketView from "../views/NewTicketView.vue";
import RequestsListView from "../views/RequestsListView.vue";
import RequestDetailView from "../views/RequestDetailView.vue";
import NewRequestView from "../views/NewRequestView.vue";
import UsersListView from "../views/UsersListView.vue";
import { useAuthStore } from "@/stores/AuthStore";


// const store = useAuthStore()

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
    path: "/tickets-detail/:ticketID",
    name: "ticketsDetail",
    component: TicketDetailView,
  },
  {
    path: "/tickets/:page?",
    name: "tickets",
    component: TicketsListView,
  },
  {
    path: "/requests/:page?",
    name: "requests",
    component: RequestsListView,
  },
  {
    path: "/requests-detail/:requestID",
    name: "requestsDetail",
    component: RequestDetailView,
  },
  {
    path: "/newticket",
    name: "newTicket",
    component: NewTicketView,
  },
  {
    path: "/newrequest",
    name: "newRequest",
    component: NewRequestView,
  },
  {
    path: "/users",
    name: "users",
    component: UsersListView,
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// router.beforeEach((to, from, next) => {
//   // we wanted to use the store here
//   if (store.isLoggedIn) next()
//   else next('/login')
// })

router.beforeEach((to) => {
  // ✅ This will work because the router starts its navigation after
  // the router is installed and pinia will be installed too
  // eslint-disable-next-line
  const store = useAuthStore()

  if (to.meta.requiresAuth && !store.isLoggedIn) return '/login'
})

export default router;
