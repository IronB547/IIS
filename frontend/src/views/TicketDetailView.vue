<template>
  <Toast/>
  <div class="ticket-detail">
    <div class="ticket-header">
      <div class="ticket-header-main">
        <div class="ticket-header-main-top">
          <h3 class="title" v-if="!editMode">{{ticket?.title}}</h3>
          <Textarea :autoResize="true" v-if="editMode" v-model="ticket.title"/>        
          <Galleria :value="ticket?.photos" :responsiveOptions="responsiveOptions" :numVisible="ticket?.photos?.length || 0" :circular="true" containerStyle="max-width: 640px; max-height: 300px;"
          :showItemNavigators="true" :showThumbnails="false">
          <template #item="slotProps">
            <div class="image-container">
              <Image :activeIndex="galleriaIndex" class="ticket-image" :src="slotProps.item?.url" alt="Image Text" preview>
              </Image>
              <Button v-if="editMode" class="image-delete-button p-button-danger p-button-rounded" @click="removePhoto(slotProps.item?.id)" icon="pi pi-trash" v-tooltip.top="'Smazat fotku'"/>
            </div>
            </template>
          </Galleria>
        </div>

        <div class="redirect-buttons">
            <span class="p-buttonset">
              <Button class="p-button-primary p-button-title" label="Upravit ticket" v-if="!editMode && (isOwner || isManager)" @click="editMode = !editMode"/>
              <Button 
                class="p-button-primary p-button-title" 
                label="Vytvořit požadavek" 
                v-if="!editMode && isManager" 
                @click="$router.push({
                  name: 'newRequest',
                  params: {
                    ticketID: ticket.id,
                  }
                })"/>
            </span>
        </div>

        <div class="edit-buttons" :class="{'edit-buttons-image': ticket?.photos?.length}" v-if="editMode">
            <Button icon="pi pi-times" class="p-button-rounded p-button-danger p-button-sm" @click="editMode = !editMode" v-tooltip.top="'Zrušit změny'"/>
            <Button icon="pi pi-check" class="p-button-rounded p-button-sm" @click="editTicket" v-tooltip.top="'Potvrdit změny'"/>
                        
            <Button class="p-button-secondary p-button-sm" v-if="editMode" @click="openAddPhoto" label="Přidat fotku"/>
            <ConfirmPopup group="addPhoto">
              <template #message="slotProps">
                <div class="add-photo-content">
                  <h3>Zadejte URL fotky:</h3>
                  <InputText type="url" v-model="newPhotoUrl"/>
                  <i :class="slotProps.message.icon" style="font-size: 1.5rem"></i>
                  <p class="pl-2">{{slotProps.message.message}}</p>
                </div>
              </template>
            </ConfirmPopup>

            <ConfirmPopup/> 
            <Button class="p-button-danger p-button-sm p-button-title" v-if="editMode" @click="deleteTicket(this.ticket.id)" label="Smazat ticket"/>
          </div>

        <div class="ticket-header-main-bottom">
          <span class="location" v-if="!editMode">Lokace: {{ticket?.location}}</span>
          <Textarea :autoResize="true" v-if="editMode" v-model="ticket.location"/>

          <p class="header-info">
          <span class="creator" @click="displayUserInfo(ticket)" 
          v-tooltip.top="'Klikněte na jméno pro více informací o uživateli'"> Vytvořil: {{ticket?.userName}} {{ticket?.userSurname}} </span>
          <br>
          <span class="date">{{new Date(ticket?.createdAt).toLocaleString("cs")}}</span>
        </p>
        </div>
      </div>
    </div>
    <div class="ticket-description">
      <div class="ticket-description-view" v-if="!editMode">
        {{ticket?.description}}
      </div>

      <Textarea :autoResize="true" v-if="editMode" v-model="ticket.description"/>
    </div>

    <h3> Stav: </h3>
    <div class="ticket-status-container">
      <div class="ticket-status" :class="{
        open : ticket?.status == 0,
        waiting : ticket?.status == 1,
        solved : ticket?.status == 2,
        denied : ticket?.status == 3}">
        <h3>
        {{getStatus(ticket?.status)}}
        </h3>
      </div>
      <Dropdown @change="stateChange($event)" class="changestate" v-model="changeState" v-if="isManager" :options="states" optionLabel="name" placeholder="Změnit stav" />
    </div>

    <div class="ticket-comments">
      <div class="ticket-comments-header">
        <h3>Komentáře</h3>

        <Button 
          class="p-button-primary" 
          v-if="isTechnician"
          @click="$router.push({
            name:'requests',
            query: {
              ticketID: ticket.id,
            }
          })"
          label="Servisní požadavky"
          />

        <Button class="p-button-primary" @click="showCommentDialog = true" :disabled="ticket?.status > 2" label="Přidat komentář"/>
      </div>
      <div class="ticket-comments-body">
        <div class="ticket-comment" v-for="comment in ticket?.comments" :key="comment.id">
          <Card>
            <template #content>
              <div class="ticket-comment-body">
                  <span>{{comment.comment}}</span>
                  <div class="ticket-comment-body-buttons" v-if="isCommentOwner(comment) || isAdmin">
                    <Button icon="pi pi-file-edit" class="p-button-rounded p-button-primary p-button-sm" @click="showEditCommentDialog = true; editingComment = comment.id; commentText = comment.comment" v-tooltip.top="'Editovat komentář'"/>
                    <ConfirmPopup/>
                    <Button icon="pi pi-times" class="p-button-rounded p-button-danger p-button-sm" @click="deleteComment(comment.id)" v-tooltip.top="'Smazat komentář'"/>
                  </div>
              </div>
            </template>

            <template #footer>
              <div class="ticket-comment-footer">
                <span @click="displayUserInfo(comment)" v-tooltip.top="'Klikněte na jméno pro více informací o uživateli'">Napsal: {{comment.userName}} {{comment.userSurname}}</span>
                <span class="date">{{new Date(comment.createdAt).toLocaleString("cs")}}</span>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>
  </div> 

  <Dialog v-model:visible="showCommentDialog">
      <template #header>
      <h3>Přidat komentář</h3>
    </template>
    <Textarea class="comment" :autoResize="true" v-model="commentText" rows="5" cols="30" />

    <template #footer>
      <Button label="Zrušit" icon="pi pi-times" class="p-button-text" @click="showCommentDialog = false"/>
      <Button label="Odeslat" icon="pi pi-check" autofocus @click="addComment"/>
    </template>
  </Dialog>

  <Dialog v-model:visible="showEditCommentDialog">
    <template #header>
      <h3>Upravit komentář</h3>
    </template>
    <Textarea class="comment" :autoResize="true" v-model="commentText" rows="5" cols="30" />

    <template #footer>
      <Button label="Zrušit" icon="pi pi-times" class="p-button-text" @click="showEditCommentDialog = false"/>
      <Button label="Odeslat" icon="pi pi-check" autofocus @click="editComment(editingComment)" />
    </template>
  </Dialog>

  <UserInfoDialogVue :user="selectedUser" :showUserInfo="isUserInfoVisible" @closeUserInfo="isUserInfoVisible = false">
    
  </UserInfoDialogVue>

</template>
  
<script>
  import UserInfoDialogVue from "@/components/UserInfoDialog.vue";

  // @ is an alias to /src
  import Image from "primevue/image";
  import Galleria from "primevue/galleria";
  import Button from "primevue/button";
  import Dialog from "primevue/dialog";
  import Textarea from "primevue/textarea";
  import Dropdown from 'primevue/dropdown';
  import { useTicketsStore } from "@/stores/TicketsStore";
  import { useAuthStore } from "@/stores/AuthStore";
  import ConfirmPopup from 'primevue/confirmpopup';
  import InputText from "primevue/inputtext";

  export default {
    components: {
      Image,
      Galleria,
      Button, 
      Dialog,
      Dropdown,
      Textarea,
      ConfirmPopup,
      UserInfoDialogVue,
      InputText
    },
    name: "TicketDetailView",
    // props: {
    //   ticketID: Number
    // },
    data() {
      return {
        ticketID: this.$route.params.ticketID,
        ticket: {},
        editMode: false,
        showCommentDialog: false,
        selectedUser: null,
        isUserInfoVisible: false,
        commentText: "",
        changeState: null,
        newPhotoUrl: "",
        states: [
          {name: 'Vytvořeno'},
          {name: 'Čeká na vyřízení'},
          {name: 'Vyřešeno'},
          {name: 'Zamítnuto'}
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

        showEditCommentDialog: false,
        editingComment: null
      };
    },
    async mounted() {
      this.ticketID = this.$route.params.ticketID

      const ticketsStore = useTicketsStore();
      this.ticketsStore = ticketsStore;
      
      this.loadTicket();
    },
    methods: {
      async loadTicket() {
        this.ticket = await this.ticketsStore.getTicket(this.ticketID)
        this.ticket.comments = this.ticket.comments.sort((objA, objB) => Number(new Date(objB.createdAt)) - Number(new Date(objA.createdAt)))
      },
      getUserFrom(parent){
        return {id: parent.userID, name: parent.userName, surname: parent.userSurname, userType: parent.userType}
      },
      displayUserInfo(parent){
        this.selectedUser = this.getUserFrom(parent);
        this.isUserInfoVisible = true;
      },
      async showRequests(ticketID){
        const ticketsStore = useTicketsStore();
        const response = await ticketsStore.showRequests(ticketID);

        if(response.error) {
          this.$toast.add({
            severity: "error",
            summary: "Chyba",
            detail: response?.error || "Chyba při načítání požadavků",
            life: 3000,
          })
        }
      },
      async deleteTicket(ticketID) {
        this.$confirm.require({
          target: event.currentTarget,
          message: 'Opravdu chcete smazat ticket?',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: 'Potvrdit',
          rejectLabel: 'Zrušit',
          acceptIcon: 'pi pi-check',
          rejectIcon: 'pi pi-times',
          accept: async () => {
            const response = await this.ticketsStore.deleteTicket(ticketID);

            if(response.message){
              this.$toast.add({
                severity: "success",
                summary: "Úspěch",
                detail: response?.message || "Ticket úspěšně smazán",
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
                detail: response?.error || "Smazání ticketu selhalo",
                life: 3000,
              })
            }
          },
          reject: () => {},
          onShow: () => {},
          onHide: () => {}
      });
      },
      getStatus(status) {
        switch (status) {
          case 0:
            return "Vytvořeno";
          case 1:
            return "Čeká na vyřízení";
          case 2:
            return "Vyřešeno";
          case 3:
            return "Zamítnuto";
        }
      },
      async stateChange(event){
        const ticketsStore = useTicketsStore();
        var state = 0

        switch(event.value.name) {
          case "Vytvořeno":
            state = 0
            break
          case "Čeká na vyřízení":
            state = 1
            break
          case "Vyřešeno":
            state = 2
            break
          case "Zamítnuto":
            state = 3
            break
        }

        const response = await ticketsStore.changeState(this.ticket, state);
        if(response.warn){
          this.$toast.add({
            severity: "warn",
            summary: "Pozor",
            detail: response?.warn || "Stav je již nastaven",
            life: 3000,
          })
        }
        else if(response.message){
          this.$toast.add({
            severity: "success",
            summary: "Úspěch",
            detail: response?.message || "Úspěšně změněn stav ticketu",
            life: 3000,
          })
        }
        else {
          this.$toast.add({
            severity: "error",
            summary: "Chyba",
            detail: response?.error || "Chyba při zmeně stavu",
            life: 3000,
          })
        }
        this.loadTicket();
      },
      async addComment() {
        const ticketsStore = useTicketsStore();
        const response = await ticketsStore.addComment(this.ticketID, {comment: this.commentText});
        if(response.message){
          this.$toast.add({
            severity: "success",
            summary: "Úspěch",
            detail: response?.message || "Komentář úspěšně přidán",
            life: 3000,
          })
          }
          else {
            this.$toast.add({
              severity: "error",
              summary: "Chyba",
              detail: response?.error || "Nelze přidat komentář",
              life: 3000,
            })
        }
        this.loadTicket();
        this.showCommentDialog = false;
      },
      commentButtonItems(comment) {
        return [
        {
          label: 'Edit ',
          icon: 'pi pi-file-edit',
          command: () => {
            this.commentText = comment.comment;
            this.showEditCommentDialog = true;
            this.editingComment = comment.id;
          }
        },
        {
          label: 'Delete',
          icon: 'pi pi-times',
          command: () => {
            this.deleteComment(comment.id);
          }
        },
        ]
      },
      async editComment(commentId) {
        const ticketsStore = useTicketsStore();
        const response = await ticketsStore.editComment(this.ticketID, commentId, {comment: this.commentText});

        if(response.message){
          this.$toast.add({
            severity: "success",
            summary: "Úspěch",
            detail: response?.message || "Komentář úspěšně editován",
            life: 3000,
          })
          }
          else {
            this.$toast.add({
              severity: "error",
              summary: "Chyba",
              detail: response?.error || "Editace komentáře selhala",
              life: 3000,
            })
        }

        this.loadTicket();
        this.showEditCommentDialog = false;
      },
      async deleteComment(commentId) {        
        this.$confirm.require({
                target: event.currentTarget,
                message: 'Opravdu chcete smazat komentář?',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'Potvrdit',
                rejectLabel: 'Zrušit',
                acceptIcon: 'pi pi-check',
                rejectIcon: 'pi pi-times',
                accept: async () => {
                  const response = await this.ticketsStore.deleteComment(commentId);

                  if(response.message){
                  this.$toast.add({
                    severity: "success",
                    summary: "Úspěch",
                    detail: response?.message || "Komentář úspěšně smazán",
                    life: 3000,
                  })
                  }
                  else {
                    this.$toast.add({
                      severity: "error",
                      summary: "Chyba",
                      detail: response?.error || "Smazání komentáře selhalo",
                      life: 3000,
                    })
                  }
                 this.loadTicket();
                },
                reject: () => {},
                onShow: () => {},
                onHide: () => {}
            });
        this.loadTicket();
      },
      openAddPhoto(){
        this.$confirm.require({
          target: event.currentTarget,
          group: 'addPhoto',
          // icon: 'pi pi-exclamation-triangle',
          acceptLabel: 'Potvrdit',
          rejectLabel: 'Zrušit',
          acceptIcon: 'pi pi-check',
          rejectIcon: 'pi pi-times',
          accept: async () => {
            const response = await this.ticketsStore.addPhoto(this.ticketID,this.newPhotoUrl);
            if(response.message){
              this.$toast.add({
                severity: "success",
                summary: "Úspěch",
                detail: response?.message || "Fotka úspěšně přidána",
                life: 3000,
              })
            }
            else {
              this.$toast.add({
                severity: "error",
                summary: "Chyba",
                detail: response?.error || "Přidání fotky selhalo",
                life: 3000,
              })
            }
            this.loadTicket();
          },
          reject: () => {},
          onShow: () => {},
          onHide: () => {}
        });
      },
      removePhoto(photoId){
        this.$confirm.require({
          target: event.currentTarget,
          message: 'Opravdu chcete smazat fotku?',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: 'Potvrdit',
          rejectLabel: 'Zrušit',
          acceptIcon: 'pi pi-check',
          rejectIcon: 'pi pi-times',
          accept: async () => {
            const response = await this.ticketsStore.removePhoto(this.ticketID,photoId);
            if(response.message){
              this.$toast.add({
                severity: "success",
                summary: "Úspěch",
                detail: response?.message || "Fotka úspěšně smazána",
                life: 3000,
              })
              this.galleriaIndex = 0;
            }
            else {
              this.$toast.add({
                severity: "error",
                summary: "Chyba",
                detail: response?.error || "Smazání fotky selhalo",
                life: 3000,
              })
            }
            this.loadTicket();
          },
          reject: () => {},
          onShow: () => {},
          onHide: () => {}
        });
      },
      async editTicket(){
        const response = await this.ticketsStore.updateTicket(this.ticket);
        if(response.message){
          this.$toast.add({
            severity: "success",
            summary: "Úspěch",
            detail: response?.message || "Tiket úspěšně upraven",
            life: 3000,
          })
          this.editMode = false;
        }
        else {
          this.$toast.add({
            severity: "error",
            summary: "Chyba",
            detail: response?.error || "Úprava tiketu selhala",
            life: 3000,
          })
        }
        this.loadTicket();
      },
      isCommentOwner(comment) {
        return comment.userID == useAuthStore().getUserData?.id;
      },
    },
    computed: {
      isTechnician(){
        return useAuthStore().hasRole(1);
      },
      isManager(){
        return useAuthStore().hasRole(2);
      },
      isAdmin(){
        return useAuthStore().hasRole(3);
      },
      isOwner(){
        return this.ticket?.userID == useAuthStore().getUserData?.id;
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
    :deep(.image-delete-button){
      position: absolute;
      bottom: 0;
      left: calc(50% - 24px);
      z-index: 1;
    }
  }

  .p-confirm-popup .add-photo-content{
    margin: 20px;

    .p-inputtext{
      width: 100%;
    }
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

      .ticket-header-main{
        justify-content: space-between;
        align-items: center;
        width: 100%;
      }

      .redirect-buttons{
        margin-bottom: 20px;
      }
      .edit-buttons{
          display: inline-flex;
          justify-content: space-between;
          margin-bottom: 20px;
          flex-wrap: wrap;

          .p-button-secondary{ // Přidat fotku
            min-width: 120px;
            display: block;
          }

          .p-button-danger:nth-child(4){ // Smazat ticket
            margin-left: 30px;

          }

          .p-button-rounded{
            margin-right: 25px;
          }

          .p-button-danger:nth-child(1){ // Deny button
            margin-left: 25px;
            margin-right: 15px;
          }
        }

      .ticket-header-main-top {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;

        .p-inputtextarea{
          width: 100%;
          font-size: 2rem;
          font-family: Avenir, Helvetica, Arial, sans-serif;
          font-weight: 700;
        }
        
        .edit-buttons-image{
          justify-content: space-evenly;
        }
        .p-button-primary{
          margin-right: 20px;
          margin-left: 20px;
          min-width: 123px;
        }
        .title{
          max-width: 750px;
          font-size: 2rem;
          word-wrap: anywhere;
          margin: 0px 0px;
        }
        .ticket-image{
            // width: 300px;
        }
      }
      .ticket-header-main-bottom {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;

        .p-inputtextarea{
          font-size: 1rem;
          width: 100%;
        }

        .header-info{
          text-align: right;
          min-width: 200px;
          max-width: 300px;
          .date{
            min-width: 160px;
          }
          .location{
            max-width: 575px;
          }
          .creator{
            cursor: pointer;
          }
        }
        p{
          margin: 0px 0px;          
        }
      }
    }
    .ticket-description{
      margin-top: 40px;
      line-height: 1.6em;
      .p-inputtextarea{
          line-height: 1.6em;
          width: 100%;
        }
    } 
  }
  .ticket-comments-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 40px;
  }
  .ticket-comment{
    margin-top: 20px;
    margin-bottom: 30px;
    .ticket-comment-body{
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      width: 100%;
      span{
        max-width: 731.5px;
      }
      .ticket-comment-body-buttons{
        max-height: 48px;
        min-width: 160px;
        text-align: right;
        .p-button-primary {
          margin-right: 10px;
        }
      }
    }
    .ticket-comment-footer{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;

      .date{
        min-width: 160px;
      }
      span{
        cursor: pointer;
        max-width: 687.5px;
      }
  }
  }
  
  .ticket-status-container{
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
    .ticket-header-main-bottom, .ticket-header-main-top{
      flex-direction: column;
      .header-info{
        text-align: left;
        margin-top: 20px;
      }
      
    }
    .creator{
      text-align: left;
    }
  }
</style>

