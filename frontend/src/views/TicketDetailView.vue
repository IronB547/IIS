<template>
  <div class="ticket-detail">
    <div class="ticket-header">
      <div class="ticket-header-main">
        <div class="ticket-header-main-top">
          <h3 class="title">{{ticket?.title}}</h3>
          <Button class="p-button-primary p-button-sm p-button-title">Upravit ticket</Button>

        </div>
        <div class="ticket-header-main-bottom">
          <p class="header-info">
            <span class="date">{{new Date(ticket?.createdAt).toLocaleString("cs")}}</span>
            <span class="location">Lokace: {{ticket?.location}}</span>
          </p>
          <span class="creator"> Vytvořil: {{ticket?.userName}} {{ticket?.userSurname}} </span>
        </div>
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
    <flexbox>
      <div class="ticket-status" :class="{
        open : ticket?.status == 0,
        waiting : ticket?.status == 1,
        solved : ticket?.status == 2,
        denied : ticket?.status == 3}">
        <h3>
        {{getStatus(ticket?.status)}}
        </h3>
      </div>
      <Dropdown class="changestate" v-model="changeState" :options="states" optionLabel="name" placeholder="Změnit stav" />
    </flexbox>

    <div class="ticket-comments">
      <div class="ticket-comments-header">
        <h3>Komentáře</h3>
        <router-link :to="`/requests`">
          <Button class="p-button-primary">
            Servisní požadavky
          </Button>
        </router-link>

        <Button class="p-button-primary" @click="showCommentDialog = true">
          Přidat komentář
        </Button>
      </div>
      <div class="ticket-comments-body">
        <div class="ticket-comment" v-for="comment in ticket?.comments" :key="comment.id">
          <div class="ticket-comment-body">
            {{comment.comment}}
          </div>
          <div class="ticket-comment-footer">
            <span>{{comment.userName}} {{comment.userSurname}}</span>
            <span>{{new Date(comment.createdAt).toLocaleString("cs")}}</span>
          </div>
        </div>
      </div>
    </div>
  </div> 

  <Dialog v-model:visible="showCommentDialog">
      <template #header>
      <h3>Přidat komentář</h3>
    </template>
    <Textarea class="comment" auto-resize="true" v-model="commentText" rows="5" cols="30" />

    <template #footer>
      <Button label="Zrušit" icon="pi pi-times" class="p-button-text" @click="showCommentDialog = false"/>
      <Button label="Odeslat" icon="pi pi-check" autofocus />
    </template>
  </Dialog>
</template>
  
<script>
  // @ is an alias to /src
  import ticketsService from "@/services/ticketsService.js";
  import Image from "primevue/image";
  import Galleria from "primevue/galleria";
  import Button from "primevue/button";
  import Dialog from "primevue/dialog";
  import Textarea from "primevue/textarea";
  import Dropdown from 'primevue/dropdown';

  export default {
    components: {
      Image,
      Galleria,
      Button, 
      Dialog,
      Dropdown,
      Textarea
    },
    name: "TicketDetailView",
    // props: {
    //   ticketId: Number
    // },
    data() {
      return {
        ticketId: this.$route.params.ticketId,
        ticket: {},
        showCommentDialog: false,
        commentText: "",
        changeState: null,
        states: [
          {name: 'Vytvořeno'},
          {name: 'Čeká na schválení'},
          {name: 'Vyřešeno'},
          {name: 'Zamítnuto'}
        ],
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
  .p-button-title {
    min-width: 120px;
  }
  .comment{
    width: 600px;
  }
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
</style>

<style scoped lang="scss">
  h3{
    word-wrap: break-word;
  }

  .image-container{
    width: 384px;
    height: 216px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .date{
    margin-right: 30px;
  }

  .ticket-detail{
    width: 900px;
    margin: 0 auto;
    text-align: left;
    
    .ticket-header{
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;

      .creator{
        min-width: 200px;
        text-align: right;
      }
      .ticket-header-main{
        justify-content: space-between;
        align-items: center;
        width: 100%;
        margin-right: 20px;
      }
      .ticket-header-main-top {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }
      .ticket-header-main-bottom {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        p{
          margin: 0px 0px;
        }
      }
      .title{
        font-size: 2rem;
        word-wrap: anywhere;
        margin: 0px 0px;
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
  .p-inputtextarea{
    font-size: 1rem;
    min-width: 300px;
  }

  flexbox{
    display: flex;
    justify-content: space-between;
    align-items: center;
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

