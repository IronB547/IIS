<template>
  <main class="main">
    <ticket-header class="ticket-header">
      <h2>Tickety</h2>
      <span class="p-input-icon-left">
        <i class="pi pi-search" />
        <InputText type="text" class="p-inputtext-lg" v-model="value" placeholder="Hledat"/>
      </span>
      <Button class="p-button-lg p-button-primary" style="color: white">
        Vytvoř ticket
      </Button>
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
  .ticket-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .tickets-list{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 20px;
    max-width: 1450px;
    margin: 0 auto;

  }
  .tickets-list > div{
    box-sizing : border-box;
  }
</style>