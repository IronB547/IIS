<template>
  <div class="about">
    <h1>Credits:</h1>
    <h1>Tomáš Dvořák & Juraj Dedič</h1>

    <button @click="itIsWhatItIs" style="height:1px;width:1px"></button>

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
  methods:{
    itIsWhatItIs(){
      new Audio('https://www.myinstants.com/media/sounds/savetweetvid_tadwtrm1nizoqxxv.mp3').play()
    }
  }
}

</script>