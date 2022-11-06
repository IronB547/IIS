<template>
  <h1>Log In</h1>
  <Toast />

  <form v-on:submit="logIn" class="login-form">

    <InputText id="email" type="text" v-model="credentials.email" />
    <br>
    <br>
    <Password v-model="credentials.password" :feedback="false" showIcon="pi pi-eye" hideIcon="pi pi-eye-slash"/>
    <br>
    <br>
    <Button label="Log In" icon="pi pi-check" iconPos="right" @click="logIn"/>
  
  </form>
</template>
  
<script>

  import userService from '@/services/userService';
  import Button from 'primevue/button';
  import InputText from 'primevue/inputtext';
  import Password from 'primevue/password';
  import mitt from 'mitt';

  const emitter = mitt();
  // @ is an alias to /src
  
  export default {
    name: "RequestsListView",
    components: {
      Button,
      InputText,
      Password
    },
    data() {
    return {
      credentials: {
        email: "admin@admin.cz",
        password: "admin"
      },
      user: {},
    }},
    methods: {
      async logIn(){
        const response = await userService.logIn(this.credentials)
        if(response.data){
          //emit to event bus
          // this.$eventBus.$emit('userLoggedIn', response.data)
          emitter.emit('userLoggedIn', response.data)
          this.$router.push({name: "tickets"})
        }else{
          this.$toast.add({
            severity: "error",
            summary: "Wrong credentials",
            detail: "The email or password is incorrect",
            life: 3000,
          });
        }
      }
    }
  };
</script>

<style lang="scss">
.login-form{
  // *{
  //   width: 100%;
  // }
  // InputText{
  //   width: 100%;
  // }
}
</style>