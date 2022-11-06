<template>
  <div class="ticket-detail">
    <div class="header">
      <div class="header-left">
        <h3 class="title">Ticket Detail: {{ticket?.title}}</h3>
        <p class="header-info">
          <span class="date">{{new Date(ticket?.createdAt).toLocaleString("cs")}}</span>
          <span class="location">Location: {{ticket?.location}}</span>
        </p>
      </div>

      <Galleria :value="ticket?.photos" :responsiveOptions="responsiveOptions" :numVisible="ticket?.photos?.length || 0" :circular="true" containerStyle="max-width: 640px; max-height: 300px;"
          :showItemNavigators="true" :showThumbnails="false">
          <template #item="slotProps">
            <div class="image-container">
              <Image class="ticket-image" :src="slotProps.item.url" alt="Image Text" preview>
              </Image>
            </div>
            </template>
      </Galleria>
    </div>
    <div class="ticket-description">
      {{ticket?.description}}
    </div>

    <h3> Stav: </h3>
    <div class="ticket-status" :class="{
      open : ticket?.status == 0,
      waiting : ticket?.status == 1,
      solved : ticket?.status == 2,
      denied : ticket?.status == 3}">
      <h3>
      {{getStatus(ticket?.status)}}
      </h3>
    </div>

    <div class="ticket-comments">
      <div class="ticket-comments-header">
        <h3>Comments</h3>
        <Button class="p-button-success" @click="showCommentDialog = true" style="color: white; background-color: var(--green-600); border-color: var(--green-600);">Add New Comment</Button>
      </div>
      <div class="ticket-comments-body">
        <div class="ticket-comment" v-for="comment in ticket?.comments" :key="comment.id">
          <div class="ticket-comment-body">
            {{comment.comment}}
          </div>
          <div class="ticket-comment-footer">
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
  import ticketsService from "@/services/ticketsService.js";
  import Image from "primevue/image";
  import Galleria from "primevue/galleria";
  import Button from "primevue/button";

  export default {
    components: {
      Image,
      Galleria,
      Button, 
    },
    name: "TicketDetailView",
    // props: {
    //   ticketId: Number
    // },
    data() {
      return {
        ticketId: this.$route.params.ticketId,
        ticket: {},
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
      this.ticketId = this.$route.params.ticketId
      
      this.ticket = await ticketsService.getTicket(this.ticketId)
    },
    methods: {
      getStatus(status) {
        switch (status) {
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
    },
  };
</script>


<style lang="scss">
  .ticket-status{
    color: white;
    border-radius: 10px;
    display: inline-block;
    padding: 0px 20px;
  }
  .open{
    border: 1px var(--blue-700) solid;
    background-color: var(--blue-700);
  }
  .waiting{
    border: 1px var(--orange-700) solid;
    background-color: var(--orange-700);
  }
  .solved{
    border: 1px var(--green-600) solid;
    background-color: var(--green-600);
  }
  .denied{
    border: 1px var(--red-700) solid;
    background-color: var(--red-700);
  }
  .image-container{
    width: 384px;
    height: 216px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .p-image{
    display: flex;
    justify-content: center;
  }
  .p-image img{
    max-width: 384px;
    max-height: 216px;
    margin: 0 auto;
  }
  .p-galleria-item-prev{
    z-index: 1;
  }

  .date{
    margin-right: 30px;
  }

  .ticket-detail{
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
      .ticket-image{
        width: 300px;
      }
    }
    .ticket-description{
      margin-top: 40px;
      line-height: 1.6em;
    } 
  }
  
  .ticket-comments-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 40px;
  }

  .ticket-comment{
    padding: 15px 20px;
    margin-top: 10px;
    border: 1px solid white;
  }

  .ticket-comment-footer{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
  }


  //responsive
  @media only screen and (max-width: 900px) {
    .ticket-detail{
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