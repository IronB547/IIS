<template>
    <div class="request-item">
      <div class="request-item-header">
        <h4>{{limitLength(request.title,35)}}</h4>
        <h3 class="request-status" :class="{
            unsolved : request?.solutionState == 0,
            solved : request?.solutionState == 1} ">{{getStatus(request.solutionState)}}</h3>
      </div>
      <p class="request-item-body">
        {{limitLength(request.description)}}
      </p>
      <div class="request-item-footer">
        <p>{{new Date(request.createdAt).toLocaleString("cs")}}</p>
        <router-link :to="`requests/`+request.id"><Button class="p-button-primary">Detail</Button></router-link>
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
  name: "RequestItem",
  data() {
    return {
    };
  },
  props: {
    request: Object,
  },
  computed: {
    
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

.request-item{
  width: 450px;
  margin: 0 auto;
  border: 1px solid rgb(255, 255, 255);
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .request-item-header{
    display: flex;
    justify-content: space-between;
  }
  .request-item-body{
    text-align: left;
    margin-top: 10px;
    height: 100%;
  }
  .request-item-footer{
    display: flex;
    justify-content: space-between;
  }
}
</style>
