<template>
  <Menubar class="menu-bar" :model="navigation">
    <template #start>
      <h3 class="navbar-title">Chytré město</h3>
    </template>
    <!-- <template #item="{item}">
        <router-link :to="item.to" custom v-slot="{href, route, navigate, isActive, isExactActive}">
            <a :href="href" @click="navigate" :class="{'active-link': isActive, 'active-link-exact': isExactActive}">{{route.fullPath}}</a>
        </router-link>
    </template> -->
    <template #end>
      <span></span>
      <ul class="p-menubar-root-list">
      <li v-if="store.isLoggedIn" class="p-menuitem" role="menuitem" aria-label="Log Out" aria-level="1" aria-setsize="6" aria-posinset="5">
        <div class="p-menuitem-content">
          <a href="#/login" @click="logOut" class="p-menuitem-link router-link-active router-link-active-exact" tabindex="-1" aria-hidden="true">
            <span class="p-menuitem-icon pi pi-fw pi-sign-out"></span>
            <span class="p-menuitem-text">Odhlásit se</span>
          </a>
        </div>
      </li>
      </ul>
    </template>
  </Menubar>
  <router-view />

  <v-idle
  @idle="onidle"
  :loop="true"
  :wait="30"
  :duration="inactivityDuration" />

  <Dialog header="Upozornění" v-model:visible="displayInactiveDialog" :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '50vw'}" :modal="true">
      <p class="m-0">Byli jste odhlášeni z důvodu nečinnosti.</p>
      <template #footer>
          <Button label="Zavřít" class="p-button-warning" icon="pi pi-check" autofocus @click="displayInactiveDialog = false; inactivityDuration = 270" />
      </template>
  </Dialog>


</template>

<script>

import Menubar from 'primevue/menubar';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
// import {useAuthStore} from '@/stores/AuthStore.js';

// eslint-disable-next-line
// const store = useAuthStore();

import { useAuthStore } from '@/stores/AuthStore';

export default {
  components: {
    Menubar,
    Dialog,
    Button
  },
  setup() {
    const store = useAuthStore();
    return {
      store,
    }
  },
  data() {
    return {
      name: 'Smart City',
      list: [
        {email: "milda@gmail.com", login: "milda"},
        {email: "milda2@gmail.com", login: "milda2"},
      ],
      user: {},
      navigation: [
        // {
        //   label: 'Domů',
        //   icon: 'pi pi-fw pi-home',
        //   to: '/'
        // },
        // {
        //   label: 'Informace',
        //   icon: 'pi pi-fw pi-info',
        //   to: '/about'
        // },
        {
          label: 'Tickety',
          icon: 'pi pi-fw pi-ticket',
          to: '/tickets'
        },
        {
          label: 'Požadavky',
          icon: 'pi pi-fw pi-question',
          to: '/requests',
          visible: () => this.store.hasRole(1)
        },
        {
          label: 'Seznam uživatelů',
          icon: 'pi pi-fw pi-users',
          to: '/users',
          visible: () => this.store.hasRole(2)
        },
        {
          label: 'Přihlásit se',
          icon: 'pi pi-fw pi-sign-in',
          to: '/login',
          visible: () => !this.store.isLoggedIn 
        },
        {
          label: 'Registerovat se',
          icon: 'pi pi-fw pi-user-plus',
          to: '/register',
          visible: () => !this.store.isLoggedIn
        },
      ],
      displayInactiveDialog: false,
      inactivityDuration: 270,
    }
  },
  methods: {
    addNew(){
      this.list.push({email: "email", login: this.name})
    },
    logOut(){
      this.store.logOut();
      this.$router.push({name: "login"})
    },

    onidle() {
      this.logOut();
      this.displayInactiveDialog = true;
    },
  },
  computed: {
  }
}

</script>

<style lang="scss">
.navbar-title {
  margin: 0 1rem 0 0.4rem;
  padding: 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-color);
  text-shadow: 0 0 2px #000;
}
.menu-bar
{
  margin-bottom: 2rem;
}
body{
  margin: 0;
  min-height: 100vh;
  // background-color: #1d1d1d;
  background-color: var(--surface-ground);
  
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  // color: #2c3e50;
  color: white;
  margin: 0;
}

.v-idle{
  display: none;
}
</style>