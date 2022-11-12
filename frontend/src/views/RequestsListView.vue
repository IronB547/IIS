<template>
  <div class="requests-list">
    <RequestItem v-for="request in requests" v-bind:key="request.id" :request="request"/>
  </div>
</template>

<script>
import requestsService from "@/services/requestService";

import RequestItem from "@/components/ServiceItem.vue";

export default {
  name: "RequestsListView",
  components: {
    RequestItem
  },
  data() {
    return {
      requests: [],
      
    }
  },
  async mounted() {
    this.requests = await requestsService.getAll()
  },
  methods: {
    
  },
  
};
</script>

<style lang="scss">
  .requests-list{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 50px;
    max-width: 1450px;
    margin: 0 auto;

  }
  .requests-list > div{
    box-sizing : border-box;
  }
</style>