<template>
  <div class="request-detail">
    <div class="header">
      <div class="header-left">
        <h3 class="title">{{request?.title}}</h3>
        <p class="header-info">
          <span class="date">{{new Date(request?.createdAt).toLocaleString("cs")}}</span>
          
        </p>
      </div>
      
    </div>
    <div class="request-description">
      {{request?.description}}
    </div>

    <h3>Stav: </h3>
    <div class="request-status" :class="{
      unsolved : request?.solutionState == 0,
      solved : request?.solutionState == 1}">
      <h3>{{getStatus(request?.solutionState)}}</h3>
    </div>

    <div class="request-comments">
      <div class="request-comments-header">
        <h3>Komentáře</h3>
        <Button class="p-button-success" @click="showCommentDialog = true" style="color: white; background-color: var(--green-600); border-color: var(--green-600);">Přidat komentář</Button>
      </div>
      <div class="request-comments-body">
        <div class="request-comment" v-for="comment in request?.comments" :key="comment.id">
          <div class="request-comment-body">
            {{comment.comment}}
          </div>
          <div class="request-comment-footer">
            <span>{{comment.userID}}</span>
            <span>{{new Date(comment.createdAt).toLocaleString("cs")}}</span>
          </div>
        </div>
      </div>
    </div>
  </div> 
</template>

<script>
  // @ is an alias to /src
  import requestsService from "@/services/requestService.js";
  import Button from "primevue/button";

  export default {
    components: {
      Button, 
    },
    name: "RequestDetailView",
    // props: {
    //   ticketId: Number
    // },
    data() {
      return {
        requestID: this.$route.params.requestID,
        request: {},
        responsiveOptions: [
        {
            breakpoint: '1024px',
            numVisible: 5
        },
        {
            breakpoint: '768px',
            numVisible: 3
        },
        {
            breakpoint: '560px',
            numVisible: 1
        }],
      };
    },
    async mounted() {
      this.requestID = this.$route.params.requestID
      
      this.request = await requestsService.getServiceRequest(this.requestID)
    },
    methods: {
      getStatus(solutionState) {
        switch (solutionState) {
          case 0:
            return "Nevyřešeno";
          case 1:
            return "Vyřešeno";
        }
      },
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

  .date{
    margin-right: 30px;
  }

  .request-detail{
    width: 900px;
    margin: 0 auto;
    text-align: left;
    
    .header{
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title{
        font-size: 2rem;
        word-wrap: anywhere;
        margin-bottom: 10px;
      }
    }
    .request-description{
      margin-top: 40px;
      line-height: 1.6em;
    } 
  }
  
  .request-comments-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 40px;
  }

  .request-comment{
    padding: 15px 20px;
    margin-top: 10px;
    border: 1px solid white;
  }

  .request-comment-footer{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
  }


  //responsive
  @media only screen and (max-width: 900px) {
    .request-detail{
      margin: 0 20px;
      width: 100%;
      .header{
        flex-direction: column;
        align-items: flex-start;
        .title{
          font-size: 1.5rem;
        }
      }
    }
  }
</style>