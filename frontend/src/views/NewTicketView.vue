<template>
  <main>
    <Toast/>
    <div class="header">
      <h1>Nový Ticket</h1>
    </div>
    <form class="content" @submit.prevent="addTicket">
      <div class="content-header">

          <div class="content-header-left">
            <span class="p-float-label">
              <InputText type="text" v-model="ticket.title" />
              <label for="title">Nadpis Ticketu</label>
            </span>

            <span class="p-float-label">
              <InputText type="text" v-model="ticket.location" />
              <label for="ticket">Lokace</label>
            </span>
          </div>

          <div class="content-header-right">
            <div class="content-header-photo">
              <Galleria :value="photos" :responsiveOptions="responsiveOptions" :numVisible="photos?.length || 0" :circular="true" containerStyle="max-width: 640px; max-height: 300px;"
            :showItemNavigators="true" :showThumbnails="false">
              <template #item="slotProps">
                <div class="image-container">
                  <Image :activeIndex="galleriaIndex" class="ticket-image" :src="slotProps.item?.url" alt="Image Text" preview>
                  </Image>
                </div>
              </template>
              </Galleria>
            </div>
            <InputText type="url" v-model="photos.url" />
          </div>

      </div>
          
      <div>
          <span class="p-float-label">
              <Textarea :autoResize="true" name="description" rows="10" class="textarea" type="text" v-model="ticket.description" />
              <label for="description">Popis Ticketu</label>
          </span>
      </div>

      <Button type="submit" label="Vytvořit nový požadavek"/>

    </form>
        
    </main>
</template>
    
  <script>
    // @ is an alias to /src
    import Textarea from 'primevue/textarea';
    import InputText from 'primevue/inputtext';
    import Button from 'primevue/button';
    import Image from "primevue/image";
    import Galleria from "primevue/galleria";

    import { useTicketsStore } from '@/stores/TicketsStore';
    
    export default {
      name: "NewTicketView",
      components: {
        Textarea,
        InputText,
        Button,
        Galleria,
        Image
      },
      data() {
        return {
          ticket: {
            title: "",
            location: "",
            description: ""
          },
          photos:[
            {url: "https://1gr.cz/fotky/idnes/17/071/r7/ZT6c7291_131822_2546162.jpg"},
            {url: "https://thumbs.dreamstime.com/b/beautiful-rain-forest-ang-ka-nature-trail-doi-inthanon-national-park-thailand-36703721.jpg"},
            
          ],
          galleriaIndex: 0,
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
          
        }
      },
      methods: {
        async addTicket() {
          const ticketsStore = useTicketsStore();
          const response = await ticketsStore.createTicket(this.ticket);
          if(response.message){
          this.$toast.add({
            severity: "success",
            summary: "Úspěch",
            detail: response?.message || "Ticket byl úspěšně přidán",
            life: 3000,
          })
          }
          else {
            this.$toast.add({
              severity: "error",
              summary: "Chyba",
              detail: response?.error || "Chyba při přidávání ticketu",
              life: 3000,
            })
        }
        }
      }
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

</style>

<style scoped lang="scss">

  main{
    max-width: 900px;
    margin: 0 auto;
  }
  .content{
    .content-header{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      .content-header-left:nth-child(1){
        width: calc(50% - 1rem);
      }
      
      div .p-float-label{
        width: 100%;
      }
    }
    .content-header-photo{
      height: 100%;
      
    }

    .p-float-label{
      margin-bottom: 2.5rem;
    }
    .dropdown{
      width: 100%;
    }
    :deep(.p-inputtext){
      width: 100%;
    }
}
</style>