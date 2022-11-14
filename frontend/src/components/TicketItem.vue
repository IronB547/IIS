<template>
  <Card class="ticket-item">
    <template #title>
      <div class="ticket-item-header">
        <h4>{{limitLength(ticket.title,30)}}</h4>
        <!-- <h3 class="ticket-status" :class="{
        open : ticket?.status == 0,
        waiting : ticket?.status == 1,
        solved : ticket?.status == 2,
        denied : ticket?.status == 3} ">{{getStatus(ticket.status)}}</h3> -->
        <Badge :severity="severity" size="large">
          {{getStatus(ticket.status)}}
        </Badge>
      </div>
    </template>
    <!-- <template #title>
        Advanced Card
    </template> -->
    <template #content>
      <p class="ticket-item-body">
        {{limitLength(ticket.description)}}
      </p>
    </template>
    <template #footer>
      <div class="ticket-item-footer">
        <p>{{new Date(ticket.createdAt).toLocaleString("cs")}}</p>
        
        <router-link :to="`tickets/`+ticket.id">
          <Button class="p-button-primary">Detail</Button>
        </router-link>
      </div>
    </template>
  </Card>
</template>

<script>
// eslint-disable-next-line
import Button from 'primevue/button';
import Card from 'primevue/card';
import Badge from 'primevue/badge';

export default {
  components: {
    Button,
    Card,
    Badge
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
    severity() {
      switch (this.ticket.status) {
        case 0:
          return "info";
        case 1:
          return "warning";
        case 2:
          return "success";
        case 3:
          return "danger";
        default:
          return "info";
      }
    },
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
    limitLength(text, lengthLimit = 30){
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
  width: 100%;
  margin: 0 auto;
  // border: 1px solid rgb(255, 255, 255);
  // display: flex;
  // flex-direction: column;
  // justify-content: space-between;

  .ticket-item-header{
    display: flex;
    justify-content: space-between;
    align-items: center;

    h4{
      margin: 0;
      font-size: 1.3rem;
    }
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