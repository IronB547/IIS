<template>
  <div class="ticket-item">
    <div class="ticket-item-header">
      <h4>{{limitLength(ticket.title,35)}}</h4>
      <h3 class="ticket-status" :class="{
      open : ticket?.status == 0,
      waiting : ticket?.status == 1,
      solved : ticket?.status == 2,
      denied : ticket?.status == 3} ">{{getStatus(ticket.status)}}</h3>
    </div>
    <p class="ticket-item-body">
      {{limitLength(ticket.description)}}
    </p>
    <div class="ticket-item-footer">
      <p>{{new Date(ticket.createdAt).toLocaleString("cs")}}</p>
      
      <router-link :to="`tickets/`+ticket.id">
        <Button class="p-button-primary">Detail</Button>
      </router-link>
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
          return "Vytvořeno";
        case 1:
          return "Čeká na schválení";
        case 2:
          return "Vyřešeno";
        case 3:
          return "Zamítnuto";
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
  width: 450px;
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