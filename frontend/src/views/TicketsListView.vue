<template>
  <main class="main">
    <ticket-header class="ticket-header">
      <h1 class="tickets">Tickety</h1>
      <span class="p-input-icon-left">
        <i class="pi pi-search" />
        <InputText type="text" class="p-inputtext-lg" v-model="value" placeholder="Hledat"/>
      </span>
      <router-link :to="`tickets/newticket`">
        <Button class="p-button-lg p-button-primary">
          Vytvoř ticket
        </Button>
      </router-link>
    </ticket-header>
      <div class="tickets-list">
        <TicketItem v-for="ticket in tickets" v-bind:key="ticket.id" :ticket="ticket"/>
    </div>
  </main>
</template>
  
<script>
  // @ is an alias to /src
  import ticketsService from "@/services/ticketsService";
  import InputText from 'primevue/inputtext';
  import Button from 'primevue/button';
  import TicketItem from "@/components/TicketItem.vue";

  
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
      this.tickets = await ticketsService.getBySearch()
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
    max-width: 1450px;
    margin: 0 auto;

  }
  .tickets-list > div{
    box-sizing : border-box;
  }
</style>