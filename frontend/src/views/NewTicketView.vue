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
                  <ConfirmPopup/>
                  <Button class="image-delete-button p-button-danger p-button-rounded" @click="removePhoto(slotProps.item)" icon="pi pi-trash" v-tooltip.top="'Smazat fotku'"/>
                </div>
              </template>
              </Galleria>
            </div>

            <div class="input-photo">
              <span class="p-float-label">
                <InputText type="url" v-model="newPhoto" />
                <label for="title">Přidat foto</label>
              </span>
              <Button icon="pi pi-check" class="p-button-rounded p-button-sm" @click="addPhotoToBuffer(newPhoto)" v-tooltip.top="'Uložit fotku'"/>
            </div>

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
    import ConfirmPopup from 'primevue/confirmpopup';
    import Toast from 'primevue/toast';

    import { useTicketsStore } from '@/stores/TicketsStore';
    
    export default {
      name: "NewTicketView",
      components: {
        Textarea,
        InputText,
        Button,
        Galleria,
        Image,
        ConfirmPopup,
        Toast
      },
      data() {
        return {
          
          ticket: {
            title: "",
            location: "",
            description: ""
          },

          newPhoto: "",

          photos:[],

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
          const response_ticket = await ticketsStore.createTicket(this.ticket);
          
          const ticketID = response_ticket.data.insertId;

          console.log(ticketID);

          var photoCount = 0;
          for(let photo of this.photos){
            let response_photo = await ticketsStore.addPhoto(ticketID, photo.url);
            if(response_photo.message){
              photoCount++;
            }
          }

          if(response_ticket.message && photoCount == this.photos?.length){
          this.$toast.add({
            severity: "success",
            summary: "Úspěch",
            detail: response_ticket?.message || "Ticket byl úspěšně přidán",
            life: 3000,
          })

          setTimeout(async () => {
            await this.$router.push({
            name: "tickets"
            })
          }, 1000);
          }
          else {
            this.$toast.add({
              severity: "error",
              summary: "Chyba",
              detail: response_ticket?.error || "Chyba při přidávání ticketu",
              life: 3000,
            })
        }
        },
        addPhotoToBuffer(photoUrl){
          if(photoUrl == ""){
            this.$toast.add({
              severity: "error",
              summary: "Chyba",
              detail: "URL fotky nemůže být prázdná hodnota",
              life: 3000,
            })
            
            return
          }
          this.photos.push({url: photoUrl});

          this.newPhoto = "";

          this.$toast.add({
            severity: "success",
            summary: "Úspěch",
            detail: "Fotka úspěšně přidána",
            life: 3000,
          })
        },

        removePhoto(photoObject){
          this.$confirm.require({
            target: event.currentTarget,
            message: 'Opravdu chcete smazat fotku?',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Potvrdit',
            rejectLabel: 'Zrušit',
            acceptIcon: 'pi pi-check',
            rejectIcon: 'pi pi-times',
            accept:() => {
              console.log(this.photos)
              const photoIndex = this.photos.indexOf(photoObject)

              if(photoIndex > -1) { // only splice when item is found
                this.photos.splice(photoIndex, 1)

                this.$toast.add({
                  severity: "success",
                  summary: "Úspěch",
                  detail: "Fotka úspěšně smazána",
                  life: 3000,
                })

                this.galleriaIndex = 0;
              }
            },
            reject: () => {},
            onShow: () => {},
            onHide: () => {}
          });
        },
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
.image-container{
    width: 384px;
    height: 216px;
    display: flex;
    justify-content: center;
    align-items: center;
    :deep(.image-delete-button){
      position: absolute;
      bottom: 0;
      left: calc(50% - 24px);
      z-index: 1;
    }
  }
  .header{
    margin-bottom: 50px;
  }

  main{
    max-width: 900px;
    margin: 0 auto;
  }
  .content{
    .content-header{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 50px;

      .content-header-right{

        .input-photo{
          display: inline-flex;
          justify-content: space-between;
          align-items: flex-end;
          width: 100%;
          margin-top: 30px;

          .p-float-label{
            margin-bottom: 0;
          }

          .p-button-rounded{
            margin-left: 10px;
          }
        }
      }
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