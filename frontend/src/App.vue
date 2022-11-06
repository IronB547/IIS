<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/tickets">Tickets</router-link> |
    <router-link to="/requests">Requests</router-link> |
    <router-link to="/login">Login</router-link> |
    <router-link to="/register">Register</router-link>
  </nav>
  <router-view />
</template>

<script>

import mitt from 'mitt';

const emitter = mitt();

export default {
  data() {
    return {
      name: 'Smart City',
      list: [
        {email: "milda@gmail.com", login: "milda"},
        {email: "milda2@gmail.com", login: "milda2"},
      ],
      user: {}
    }
  },
  methods: {
    addNew(){
      this.list.push({email: "email", login: this.name})
    }
  }
}

emitter.on('userLoggedIn', e => {
  console.log('foo event fired', e); 
})

</script>

<style lang="scss" scope="global">
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
