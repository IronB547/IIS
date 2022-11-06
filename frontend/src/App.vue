<template>
    <Menubar class="menu-bar" :model="navigation">
      <template #start>
        <h3 class="navbar-title">Smart City</h3>
      </template>
      <template #end>
        <ul class="p-menubar-root-list">
        <li v-if="isAuthenticated" class="p-menuitem" role="menuitem" aria-label="Log Out" aria-level="1" aria-setsize="6" aria-posinset="5">
          <div class="p-menuitem-content">
            <a href="#/login" @click="logOut" class="p-menuitem-link router-link-active router-link-active-exact" tabindex="-1" aria-hidden="true">
              <span class="p-menuitem-icon pi pi-fw pi-sign-out"></span>
              <span class="p-menuitem-text">Log Out</span>
            </a>
          </div><!---->
        </li>
        </ul>
      </template>
    </Menubar>
  <router-view />
</template>

<script>

import mitt from 'mitt';
import Menubar from 'primevue/menubar';

const emitter = mitt();

export default {
  components: {
    Menubar
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
          to: '/requests'
        },
        {
          label: 'Log In',
          icon: 'pi pi-fw pi-sign-in',
          to: '/login',
          visible: () => !localStorage.getItem('token') 
        },
        {
          label: 'Register',
          icon: 'pi pi-fw pi-user-plus',
          to: '/register',
          visible: () => !localStorage.getItem('token')
        },
      ]
    }
  },
  methods: {
    addNew(){
      this.list.push({email: "email", login: this.name})
    },
    logOut(){
      localStorage.removeItem('token')
      this.$router.push({name: "login"})
    }
  },
  computed: {
    isAuthenticated(){
      return localStorage.getItem('token') != null
    }
  },
}

emitter.on('userLoggedIn', e => {
  console.log('foo event fired', e); 
})

</script>

<style lang="scss" scope="global">
.navbar-title {
  margin: 0 0.2rem 0 0.4rem;
  padding: 0;
  font-size: 1.2rem;
  font-weight: 500;
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

.list{
  width: 800px;
  margin: 0 auto;

  
  .list-item{
    
    display: flex;
    justify-content: space-around;
  }
}





nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #485e74;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
