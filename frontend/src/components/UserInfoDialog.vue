<template>
    <Dialog :visible="showUserInfo" closeIcon="">
      <template #header>
        <h3>Info o uživateli:</h3>
      </template>

      <table>
        <tr>
          <th style="width:50%"></th>
          <th style="width:50%"></th>
        </tr>
        <tr>
          <td>Jméno:</td>
          <td>{{user.name}}</td>
        </tr>
        <tr>
          <td>Příjmení:</td>
          <td>{{user.surname}}</td>
        </tr>
        <tr>
          <td>E-mail:</td>
          <td>{{user.email}}</td>
        </tr>
        <tr>
          <td>Telefonní číslo:</td>
          <td>{{user.phoneNum}}</td>
        </tr>
        <tr>
          <td>Typ uživatele:</td>
          <td><UserTypeBadge :userType="user.userType"/></td>
        </tr>
      </table>
      <template #footer>
        <Button label="Zavřít" icon="pi pi-times"  @click="$emit('closeUserInfo')"/>
      </template>
    </Dialog>
</template>

<script> 
import Dialog from 'primevue/dialog';
import Button from "primevue/button";
import UserTypeBadge from './UserTypeBadge.vue';

export default {
  components: {
    Dialog,
    Button,
    //eslint-disable-next-line
    UserTypeBadge
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
      min-width: 500px;
    }
    tr{
      td{
        text-align: left;
      }
      line-height: 1.6rem;
    }
</style>