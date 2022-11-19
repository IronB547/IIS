<template>
    <Dialog :visible="showUserInfo" closeIcon="">
      <template #header>
        <h3>Info o uživateli:</h3>
      </template>

      Jméno:{{user.name}}<br>
      
      Příjmení:{{user.surname}}<br>

      E-mail:{{user.email}}<br>

      Telefonní číslo:{{user.phoneNum}}<br>

      <template #footer>
        <Button label="Zavřít" icon="pi pi-times"  @click="$emit('closeUserInfo')"/>
      </template>
    </Dialog>
</template>

<script> 
import Dialog from 'primevue/dialog';
import Button from "primevue/button";

export default {
  components: {
    Dialog,
    Button
  },
  name: "userInfoDialog",
  data() {
    return {
    };
  },
  props: {
    user: Object,
    showUserInfo: {
      type: Boolean,
      default: false
    }
  },
  computed: {
  },
  methods: {
  },
};
</script>

<style lang="scss">
    .p-dialog{
      min-width: 400px;
      
    }
</style>