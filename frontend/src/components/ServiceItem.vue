<template>
  <Card class="request-item">
    <template #title>
      <div class="request-item-header">
        <h4>{{limitLength(request.title,35)}}</h4>
        <Badge :severity="severity" size="large">
          {{getStatus(request?.solutionState)}}
        </Badge>
        
      </div>
    </template>

    <template #content>
      <p class="request-item-body">
        {{limitLength(request.description)}}
      </p>
      
      </template>
      <template #footer>
        <div class="request-item-footer">
        <p>{{new Date(request.createdAt).toLocaleString("cs")}}</p>
        <router-link :to="`requests/`+request.id"><Button class="p-button-primary">Detail</Button></router-link>
      </div>
      </template>
  </Card>
  </template>

<script>
// eslint-disable-next-line
import Button from 'primevue/button';
import Badge from 'primevue/badge';
import Card from 'primevue/card';

export default {
  components: {
    Button,
    Badge,
    Card
  },
  name: "RequestItem",
  data() {
    return {
    };
  },
  props: {
    request: Object,
  },
  computed: {
    severity() {
      switch (this.request.solutionState) {
        case 0:
          return "danger";
        case 1:
          return "success";
        default:
          return "danger";
      }
    },
  },
  methods: {
    getStatus(solutionState){
      switch(solutionState){
        case 0:
          return "Nevyřešeno"
        case 1:
          return "Vyřešeno"
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
.p-card-body{
  height: 100%;
}

.p-card-content {
  height: 140px;
}

.request-item{
  width: 100%;
  margin: 0 auto;
  .request-item-header{
    display: flex;
    justify-content: space-between;

    h4{
      min-height: 54px;
      margin: 0;
      font-size: 1.3rem;
      text-align: left;
    }
    .p-badge{
      min-width: 116px;
    }
  }
  .request-item-body{
    text-align: left;
    height: 100%;
  }
  .request-item-footer{
    display: flex;
    justify-content: space-between;
  }
}

.request-status{
    color: white;
    border-radius: 10px;
    display: inline-block;
    padding: 0px 20px;
  }
  .unsolved{
    border: 1px var(--red-700) solid;
    background-color: var(--red-700);
  }
  .solved{
    border: 1px var(--green-600) solid;
    background-color: var(--green-600);
  }

</style>
