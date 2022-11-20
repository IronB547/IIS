<template>

  <div class="registration-container">
    <main class="login container-item">

    <h1>Přihlášení</h1>
    <Toast />

    <form class="login-form" @submit.prevent="logIn">

      <InputText id="email" type="text" v-model="credentials.email" class="p-inputtext-lg" required placeholder="E-mail"/>
      <br>
      <br>
      <Password v-model="credentials.password" class="p-inputtext-lg" toggleMask required :feedback="false" placeholder="Heslo"/>
      <br>
      <br>
      <Button type="submit" label="Přihlásit se" icon="pi pi-check" iconPos="right" class="p-button-lg p-button-primary"/>

    </form> 

    </main>

    <section class="register container-item">
      <h2>Nemáte ještě účet?</h2>
      <Button label="Zaregistrovat se" class="p-button-secondary p-button-lg" @click="$router.push('register')"/>
    </section>
  </div>
</template>
  
<script>

  // import userService from '@/services/userService';
  import Button from 'primevue/button';
  import InputText from 'primevue/inputtext';
  import Password from 'primevue/password';
  import mitt from 'mitt';
  import {useAuthStore} from '@/stores/AuthStore';
  import Toast from 'primevue/toast';

  const emitter = mitt();
  // @ is an alias to /src
  
  export default {
    name: "LoginView",
    components: {
      Button,
      InputText,
      Password,
      Toast
    },
    data() {
    return {
      credentials: {
        email: "lorem.ipsum@gmail.com",
        password: "loremipsum"
      },
      user: {},
    }},
    methods: {
      async logIn(){
        const authStore = useAuthStore();
        const response = await authStore.logIn(this.credentials)
        if(response.data){
          //emit to event bus
          // this.$eventBus.$emit('userLoggedIn', response.data)
          emitter.emit('userLoggedIn', response.data)
          this.$router.push({name: "tickets"})
        }else{
          this.$toast.add({
            severity: "error",
            summary: "Wrong credentials",
            detail: response.error || "The email or password is incorrect",
            life: 3000,
          });
        }
      }
    }
  };
</script>

<style lang="scss" scoped>

.p-button-label{
  text-decoration: none;
}

main {  flex-grow: 2;}
section{flex-grow: 1;}

.login-form{
  width: 400px;
  margin: 0 auto;

  
  .p-password{
    width: 100%;
    .p-password-input{
    width: 100%;
    }
  }

  .p-inputtext{
    width: 400px;
  }
}
</style>


<style lang="scss">
$credentials-margin-bottom: (1.1em);
.registration-container{
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.p-password{
    width: 100%;
  .p-password-input{
    width: 100%;
  }
  margin-bottom: $credentials-margin-bottom;
}

@media only screen and (max-width: 768px) {
  .registration-container{
    flex-direction: column-reverse;
  }
}

</style>