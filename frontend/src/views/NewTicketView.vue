<template>
    <h1>Nový Ticket</h1>
    <Toast/>
    <div class="grid">
      <div class="text-container">
        <label class="labels" for="name">Název</label>
        <br>
          <InputText class="input" id="name" type="text" v-model="ticket.title" />
        <br>
          <label class="labels" for="location">Lokace</label>
        <br>
          <InputText class="input" id="location" type="text" v-model="ticket.location" />
        <br>
          <label class="labels" for="description">Popis</label>
        <br>
          <Textarea class="p-inputtext-area" auto-resize="true" v-model="ticket.description">
          </Textarea>

        </div>
          <div class ="photo-container">
            <label class="labels" for="description">Foto</label>
            <br>
            <InputText class="input" id="location" type="text" v-model="value" />

            <Button @click="createTicket">Create ticket</Button>
        </div>
    </div>    
</template>
    
  <script>
    // @ is an alias to /src
    import Textarea from 'primevue/textarea';
    import InputText from 'primevue/inputtext';
    import Button from 'primevue/button';

    import { useTicketsStore } from '@/stores/TicketsStore';
    
    export default {
      name: "NewTicketView",
      components: {
        Textarea,
        InputText,
        Button
      },
      data() {
        return {
          ticket: {
            title: "",
            location: "",
            description: ""
          },
          
        }
      },
      methods: {
        async createTicket() {
          const ticketsStore = useTicketsStore();
          const response = await ticketsStore.createTicket(this.ticket);
          if(response.error){
            this.$toast.add({
              severity: "error",
              summary: "Error",
              detail: response?.error || "The ticket could not be created",
              life: 3000,
            })
          }else{
            this.$toast.add({
              severity: "success",
              summary: "Ticket created",
              detail: response?.message || "A new ticket has been created",
              life: 3000,
            })
          }
        }
      }
    };
  </script>

<style scoped lang="scss">
  .input{
    margin-bottom: 25px;
    margin-top: 5px;
    width: 100%;
  }
  .grid{
    display: grid;
    grid-template: "left right";
    gap: 200px;
    align-items: center;
    margin: 100px 100px 0px 100px;
  }
  .text-container{
    grid-area: left;
  }
  .photo-container{
    grid-area: right;
  }
  .labels{
    float: left;
    
  }
  .p-inputtext-area{
    margin-top: 5px;
    width: 100%;
  }

  @media screen and (max-width: 768px) {
    .grid{
      display: grid;
      grid-template: "left" "right";
      gap: 200px;
      align-items: center;
      margin: 100px 100px 0px 100px;
    }
  }
</style>