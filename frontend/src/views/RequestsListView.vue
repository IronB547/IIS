<template>
  <section class="requests-list-header">
    <h1>Servisní požadavky</h1>
    <router-link :to="`/requests/newrequest`">
      <Button class="p-button-primary">
        Nový servisní požadavek
      </Button>
    </router-link>
  </section>
  <div class="requests-list">
    <RequestItem v-for="request in requests" v-bind:key="request.id" :request="request"/>
  </div>
</template>

<script>
import RequestItem from "@/components/ServiceItem.vue";

import { useRequestsStore } from "@/stores/RequestsStore";

import Button from "primevue/button";

export default {
  name: "RequestsListView",
  components: {
    RequestItem,
    Button,
  },
  data() {
    return {
      requests: [],
      
    }
  },
  async mounted() {
    const requestsStore = useRequestsStore();
    this.requests = await requestsStore.getBySearch()
  },
  methods: {
    
  },
  
};
</script>

<style lang="scss" scoped>
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

  .requests-list-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto;
    max-width: 1450px;
    padding: 0 20px;
    margin-bottom: 2rem;
  }
</style>