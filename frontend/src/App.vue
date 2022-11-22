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
      <li role="menuitem" aria-level="1" aria-setsize="6" aria-posinset="5">
        <div class="p-menuitem-content">
          <a @click="displaySettingsDialog = true" class="p-menuitem-link router-link-active router-link-active-exact" tabindex="-1" aria-hidden="true">
            <span class="p-menuitem-icon pi pi-fw pi-cog"></span>
            <span class="p-menuitem-text"></span>
          </a>
        </div>
      </li>
      </ul>
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

  <Dialog header="Nastavení" v-model:visible="displaySettingsDialog" :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '50vw'}" :modal="true">
      <p class="m-0">Doba nečinnosti (minuty)</p>
      <InputText v-model="inactivityDurationSetting" type="number" />
      <p class="m-0">Vynucení barevního módu (vyžaduje refresh stránky):</p>
      <p>Aktuální: {{getColorMode(store.displayMode)}}</p>
      <p>Bude nastaveno: {{getColorMode(forceColorMode)}}</p>
      <TriStateCheckbox v-model="forceColorMode" />
      <template #footer>
          <Button label="OK" class="p-button-primary" icon="pi pi-check" autofocus @click="displaySettingsDialog= false; submitSettings()" />
      </template>
  </Dialog>


</template>

<script>

import Menubar from 'primevue/menubar';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import TriStateCheckbox from 'primevue/tristatecheckbox';

// import {useAuthStore} from '@/stores/AuthStore.js';

// eslint-disable-next-line
// const store = useAuthStore();

import { useAuthStore } from '@/stores/AuthStore';

export default {
  components: {
    Menubar,
    Dialog,
    Button,
    InputText,
    TriStateCheckbox,
  },
  setup() {
    const store = useAuthStore();
    return {
      store,
    }
  },
  mounted() {
    console.log(this.store.displayMode);
    if(this.store.displayMode == "dark"){
      import ("primevue/resources/themes/lara-dark-indigo/theme.css")
    }else{
      import ("primevue/resources/themes/lara-light-indigo/theme.css")
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
          command: () => {this.$router.push({name:'tickets'})}
        },
        {
          label: 'Požadavky',
          icon: 'pi pi-fw pi-question',
          command: () => {this.$router.push({name:'requests'})},
          visible: () => this.store.hasRole(1)
        },
        {
          label: 'Seznam uživatelů',
          icon: 'pi pi-fw pi-users',
          command: () => {this.$router.push({name:'users'})},
          visible: () => this.store.hasRole(2)
        },
        {
          label: 'Přihlásit se',
          icon: 'pi pi-fw pi-sign-in',
          command: () => {this.$router.push({name:'login'})},
          visible: () => !this.store.isLoggedIn 
        },
        {
          label: 'Registerovat se',
          icon: 'pi pi-fw pi-user-plus',
          command: () => {this.$router.push({name:'register'})},
          visible: () => !this.store.isLoggedIn
        },
      ],
      displayInactiveDialog: false,
      inactivityDuration: 270,
      inactivityDurationSetting: 5,
      displaySettingsDialog: false,
      forceColorMode: null,
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

    submitSettings(){
      if(this.forceColorMode === true){
        this.store.setDisplayMode("dark");
      }
      else if(this.forceColorMode === false){
        this.store.setDisplayMode("light");
      }
      else{
        this.store.removeDisplayMode();
      }
      this.inactivityDuration = this.inactivityDurationSetting*60;
      this.$forceUpdate();
    },
    getColorMode(mode){
      if(mode === "dark" || mode === true)
        return "tmavý";
      else if(mode === "light" || mode === false)
        return "světlý";
      return "automatický (podle systému)";
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
  color: var(--text-color);
  // text-shadow: 0 0 2px #000;
}
.menu-bar
{
  margin-bottom: 2rem;

  .p-focus .p-menuitem-content{
    background-color: inherit !important;
    .p-menuitem-icon{
      // color: rgba(255, 255, 255, 0.6) !important;
      color: var(--text-color-secondary) !important;
    }
  }
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
  color: var(--text-color);
  margin: 0;
}

.v-idle{
  display: none;
}
</style>