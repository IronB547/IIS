<template>
  
  <div class="registration-container container-reponsive">
    
    <section class="register container-item">
      <h2>Máte už vytvořený účet?</h2>
      <Button label="Přihlásit se" class="p-button-secondary p-button-lg" @click="$router.push('login')"/>
    </section>


    <main class="login container-item">

      <Toast />
      
    <form class="register-form" @submit.prevent="handleSubmit()">
      <h1>Registrace</h1>

      <div class="name-block">
        <div class="name-block-item">
          <label for="name">Jméno</label>
          <InputText id="name" type="text" v-model="credentials.name"  class="p-inputtext-lg" required :class="{'p-invalid' : !credentials.name && submitted}"/>
        </div>

        <div class="name-block-item">
          <label for="surname">Příjmení</label>
          <InputText id="surname" type="text" v-model="credentials.surname" class="p-inputtext-lg" required :class="{'p-invalid' : !credentials.surname && submitted}"/>
        </div>
      </div>

      <label for="email">E-mail</label>
      <InputText id="email" type="email" v-model="credentials.email" class="p-inputtext-lg" required/>

      <label for="phone">Telefonní číslo</label>
      <InputText id="phone" type="tel" v-model="credentials.phoneNum" class="p-inputtext-lg" required :class="{'p-invalid' : !credentials.phoneNum.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im) && submitted}"/>

      <label for="password">Heslo</label>
      <Password v-model="credentials.password" prompt-label="Vyberte heslo" weakLabel="Slabé heslo" mediumLabel="Průměrné heslo" strongLabel="Silné heslo"  class="p-inputtext-lg" toggleMask required :class="{'p-invalid' : (credentials.password.length < 8) && submitted}">
        <template #footer>
            <Divider />
            <p class="mt-2">Podmínka</p>
            <ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
                <li>Alespoň 8 znaků</li>
            </ul>
        </template>
      </Password>
<!-- 
      <label for="password-again">Password again</label>
      <Password v-model="credentials.passwordRepeat" class="p-inputtext-lg" toggleMask required/> -->

      <Button type="submit" label="Zaregistrovat se" icon="pi pi-check" iconPos="right" class="p-button-lg p-button-primary"/>

    </form> 

    </main>

  </div>
</template>
  
<script>


  import Button from 'primevue/button';
  import InputText from 'primevue/inputtext';
  import Password from 'primevue/password';
  import {useAuthStore} from '@/stores/AuthStore';
  import Divider from 'primevue/divider';
  
  // @ is an alias to /src
  export default {
    name: "RegisterView",
    components: {
      Button,
      InputText,
      Password,
      Divider
    },
    data() {
    return {
      credentials: {
        email: "",
        password: "",
        passwordRepeat: "",
        name: "",
        surname: "",
        phoneNum: "",
      },
      user: {},
      submitted: false,
    }},
    methods: {
      async register(){
        const authStore = useAuthStore();
        const response = await authStore.register(this.credentials)
        console.log(response)
        if(response.affectedRows){
          //emit to event bus
          // this.$eventBus.$emit('userLoggedIn', response.data)
          this.$toast.add({severity:'success', summary: 'Úspěch', detail: 'Registrace byla úspěšná', life: 3000});
          setTimeout(() => {
            this.$router.push({name: 'login'})
          }, 1000);
        }else{
          this.$toast.add({
            severity: "error",
            summary: "Nepodařilo se vytvořit účet",
            detail: response.message || "Při registraci došlo k chybě",
            life: 3000,
          });
        }
      },
      handleSubmit(isFormValid) {
        console.log(isFormValid)
        this.submitted = true;

        this.register();
      },
    },
  };
</script>


<style lang="scss" scoped>

main {  flex-grow: 2; }
section{  flex-grow: 1; }

.register-form{
  width: 400px;
  margin: 0 auto;
  text-align: left;

  h1{
    margin-bottom: 30px;
  }
  .name-block{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .name-block-item{
      width: calc(50% - 10px);
    }
  }

  label{
    display: block;
    text-align: left;
    color: lightgrey;
    margin-bottom: 5px;
  }
  .p-password{
    width: 100%;
    .p-password-input{
      width: 100%;
    }
  }
  .p-inputtext{
    width: 100%;
    margin-bottom: 1.1rem;
  }
  .p-button{
    margin-top: 1rem;
    width: 100%;
  }

  //responsive container
  @media only screen and (max-width: 768px) {
    .name-block{
      flex-direction: column;
      .name-block-item{
        width: 100%;
      }
    }
  }
}
</style>