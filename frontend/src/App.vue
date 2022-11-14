<template>
  <Menubar class="menu-bar" :model="navigation">
    <template #start>
      <h3 class="navbar-title">Smart City</h3>
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
            <span class="p-menuitem-text">Log Out</span>
          </a>
        </div>
      </li>
      </ul>
    </template>
  </Menubar>
  <router-view />
</template>

<script>

import Menubar from 'primevue/menubar';
// import {useAuthStore} from '@/stores/AuthStore.js';

// eslint-disable-next-line
// const store = useAuthStore();

import { useAuthStore } from '@/stores/AuthStore';

export default {
  components: {
    Menubar
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
        {
          label: 'Home',
          icon: 'pi pi-fw pi-home',
          to: '/'
        },
        {
          label: 'About',
          icon: 'pi pi-fw pi-info',
          to: '/about'
        },
        {
          label: 'Tickets',
          icon: 'pi pi-fw pi-ticket',
          to: '/tickets'
        },
        {
          label: 'Requests',
          icon: 'pi pi-fw pi-question',
          to: '/requests',
          visible: () => this.store.hasRole(1)
        },
        {
          label: 'Users',
          icon: 'pi pi-fw pi-users',
          to: '/users',
          visible: () => this.store.hasRole(2)
        },
        {
          label: 'Log In',
          icon: 'pi pi-fw pi-sign-in',
          to: '/login',
          visible: () => !this.store.isLoggedIn 
        },
        {
          label: 'Register',
          icon: 'pi pi-fw pi-user-plus',
          to: '/register',
          visible: () => !this.store.isLoggedIn
        },
      ]
    }
  },
  methods: {
    addNew(){
      this.list.push({email: "email", login: this.name})
    },
    logOut(){
      this.store.logOut();
      this.$router.push({name: "login"})
    }
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
  color: #fff;
  text-shadow: 0 0 2px #000;
}
.menu-bar
{
  margin-bottom: 2rem;
}
body{
  margin: 0;
  min-height: 100vh;
  background-color: #1d1d1d;
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
</style>

<style>
</style>
