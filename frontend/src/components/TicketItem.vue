<template>
  <div class="ticket-item">
    <div class="ticket-item-header">
      <h4>{{limitLength(ticket.title,35)}}</h4>
      <h3>{{getStatus(ticket.status)}}</h3>
    </div>
    <p class="ticket-item-body">
      {{limitLength(ticket.description)}}
    </p>
    <div class="ticket-item-footer">
      <p>{{new Date(ticket.createdAt).toLocaleString("cs")}}</p>
      <router-link :to="`tickets/`+ticket.id"><Button>Open</Button></router-link>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line
import Button from 'primevue/button';

export default {
  components: {
    Button
  },
  name: "TicketItem",
  data() {
    return {
    };
  },
  props: {
    ticket: Object,
  },
  computed: {
    
  },
  methods: {
    getStatus(status){
      switch(status){
        case 0:
          return "Open"
        case 1:
          return "Waiting"
        case 2:
          return "Solved"
        case 3:
          return "Rejected"
      }
    },
    limitLength(text, lengthLimit = 100){
      let numUpper = text.length - text.replace(/[A-Z]/g, '').length;  
      if(numUpper > lengthLimit/2){
        return text.substring(0, Math.round(lengthLimit/1.5)-3) + "..."
      }if(text.length > lengthLimit){
        return text.substring(0, lengthLimit-3) + "..."
      }
      return text
    }
  },
};
</script>


<style lang="scss">
.ticket-item{
  width: 400px;
  margin: 0 auto;
  border: 1px solid rgb(255, 255, 255);
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .ticket-item-header{
    display: flex;
    justify-content: space-between;
  }
  .ticket-item-body{
    text-align: left;
    margin-top: 10px;
    height: 100%;
  }
  .ticket-item-footer{
    display: flex;
    justify-content: space-between;
  }
}
</style>