<template>
    <div class="tickets-list">
      <TicketItem v-for="ticket in tickets" v-bind:key="ticket.id" :ticket="ticket"/>
    </div>
</template>
  
<script>
  // @ is an alias to /src
  import ticketsService from "@/services/ticketsService";

  import TicketItem from "@/components/TicketItem.vue";

  
  export default {
    name: "TicketsListView",
    components: {
      TicketItem
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

<style  scoped lang="scss">
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