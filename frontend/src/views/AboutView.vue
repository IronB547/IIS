<template>
  <div class="about">
    <h1>Credits:</h1>
    <h1>Tomáš Dvořák & Juraj Dedič</h1>
    <h3>{{store.getUser}}</h3>

    <br>
    <button @click="$router.push({ name: 'about', query: {id: '123'} })"></button>

    {{$route.query}}

    Plenus venter non studet libenter
  </div>
</template>


<script>

import { useAuthStore } from '@/stores/AuthStore';

export default {
  name: 'AboutView',
  setup() {
    const store = useAuthStore();
    return {
      store,
    }
  },
}

</script>