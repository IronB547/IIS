<template>
  <main class="main">
    <div class="ticket-header">
      <h1 class="tickets">Tickety</h1>
      <span class="p-input-icon-left">
        <i class="pi pi-search" />
        <InputText type="text" class="p-inputtext-lg" placeholder="Hledat"/>
      </span>
      <router-link :to="`tickets/newticket`">
        <Button class="p-button-lg p-button-primary">
          Vytvoř ticket
        </Button>
      </router-link>
    </div>
    <div class="tickets-list">
      <TicketItem v-for="ticket in tickets" v-bind:key="ticket.id" :ticket="ticket"/>
    </div>
  </main>
</template>
  
<script>
  // @ is an alias to /src
  import InputText from 'primevue/inputtext';
  import Button from 'primevue/button';
  import TicketItem from "@/components/TicketItem.vue";

  import {useTicketsStore} from '@/stores/TicketsStore';
  
  export default {
    name: "TicketsListView",
    components: {
      TicketItem,
      InputText,
      Button
    },
    data() {
      return {
        tickets: [],
        
      }
    },
    async mounted() {
      this.tickets = await useTicketsStore().getBySearch();
    },
    methods: {
      
    },
    
  };
</script>

<style scoped lang="scss">
  main{
    max-width: 1450px;
    margin: 0 auto;
  }
  .tickets{
    color: white;
    background-color: var(--indigo-700);
    border-radius: 10px;
    display: inline-block;
    padding: 7px 20px;
  }
  .ticket-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
  }
  .tickets-list{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 50px;
    max-width: calc(100% - 40px);
    // max-width: 1450px;
    margin: 0 auto;
    margin-bottom: 1rem;
  }
  .tickets-list > div{
    box-sizing : border-box;
  }

  @media screen and (max-width: 768px) {
    .tickets-list{
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    }
  }
</style>