<template>
  <Toast/>
  <div class="request-detail">
    <div class="request-header">
      <div class="request-header-top">
        <h1 class="title" v-if="!editMode">{{request?.title}}</h1>
        <Textarea :autoResize="true" v-if="editMode" v-model="request.title"/>

        <div class="request-header-bottom">
          <div class="request-header-bottom-left">
            <h4 v-if="request.ticket">Přiřazen k ticketu: {{request.ticket.title}}</h4>
            <div class="request-creator" @click="displayCreatorInfo(request)">
              <h4>Vytvořil: {{request?.userName}} {{request?.userSurname}}</h4>
            </div>
            <p class="header-info">
            <span class="date">{{new Date(request?.createdAt).toLocaleString("cs")}}</span>
            </p>
          </div>

          <div class="request-header-bottom-buttons">
            <ConfirmPopup/>
            <Button class="p-button-danger  p-button-title" v-if="editMode" @click="deleteRequest(this.request.id)" label="Smazat požadavek"/>

            <span class="p-buttonset">
              <Button class="p-button-primary" @click="$router.push(`/tickets-detail/${request?.ticketID}`)" :disabled="!request?.ticketID" v-if="!editMode" label="Otevřít ticket"/>
              <Button class="p-button-primary" v-if="!editMode && isManager" @click="editMode = !editMode" label="Upravit požadavek"/>
            </span>

            <div class="edit-buttons" v-if="editMode">
              <Button icon="pi pi-times" class="p-button-rounded p-button-danger p-button-sm" @click="editMode = !editMode" v-tooltip.top="'Zrušit změny'" />
              <Button icon="pi pi-check" class="p-button-rounded p-button-sm" @click="editRequest" v-tooltip.top="'Potvrdit změny'"/>
            </div>

          </div>
        </div>
      </div>
    </div>
    <div class="request-description" >
      <div class="review-description-view" v-if="!editMode">
      {{request?.description}}
      </div>

      <Textarea :autoResize="true" v-if="editMode" v-model="request.description"/>
    </div>

    <h3>Stav: </h3>
    <div class="flexbox">
      <div class="request-status" :class="{
        unsolved : request?.solutionState == 0,
        solved : request?.solutionState == 1}">
        <h3>{{getStatus(request?.solutionState)}}</h3>
      </div>
      <Dropdown class="changestate" @change="stateChange($event)" v-model="changeState" :options="states" optionLabel="name" placeholder="Změnit stav" />
    </div>

    <div class="request-body">
      <div class="request-body-left">
        <h3> Přiřazení technici: </h3>
        <div class="request-technicians" v-for="technician in request?.technicians" :key="technician.technicianID">
          <Card class="user-info">
            <template #header>
              <div class="request-technicians-body">
                <span @click="displayUserInfo(technician)" v-tooltip.top="'Klikněte na jméno pro více informací o uživateli'">
                  {{technician.name}} {{technician.surname}}
                </span>
                <div class="request-technicians-body-button">
                  <Button v-if="isManager" icon="pi pi-times" class="p-button-rounded p-button-danger cross-button" @click="removeTechnician(technician.technicianID)" v-tooltip.top="'Odebrat technika'"/>
                </div>
              </div>
              </template>
          </Card>
        </div>
        <div class="request-body-left-dropdown" v-if="isManager">
          <Dropdown  @change="technicianChange($event)" class="addtechnician" v-model="addTechnician" :options="technicians" :optionLabel="getTechnicianLabel" placeholder="Přidat technika" :disabled="technicians.length == 0"/>
        </div>
      </div>

      <div class="request-body-right">
        <h3> Dodatečné informace: </h3>
        <Card class="request-body-right-card">
          <template #header>
            Předpokládaný čas řešení:
            <br>
            {{request?.expectedTime || "Nezadáno"}}
          </template>
        </Card>

        <Card class="request-body-right-card">
          <template #header>
            Vykázaný čas
            <br>
            {{request?.solutionTime || "Nezadáno"}}
          </template>
        </Card>
        
        <Card class="request-body-right-card">
          <template #header>
            Cena:
            <br>
            {{request?.price || "Nezadáno"}}
          </template>
        </Card>

        <Button class="p-button-primary" @click="showEditRequestData = true" :disabled="request?.solutionState > 0" label="Upravit hodnoty"/>
      </div>
    </div>

    <div class="request-comments">
      <div class="request-comments-header">
        <h3>Komentáře</h3>
        <Button class="p-button-primary" @click="showCommentDialog = true" :disabled="request?.solutionState > 0" label="Přidat komentář"/>
      </div>
      <div class="request-comments-body">
          <div class="request-comment" v-for="comment in request?.comments" :key="comment.id">
            <Card>
              <template #content>
                <div class="request-comment-body"> 
                  <span>{{comment.comment}}</span>

                  <div class="request-comment-body-buttons">
                    <Button icon="pi pi-file-edit" v-if="isAdmin || isCommentOwner(comment)" class="p-button-rounded p-button-primary p-button-sm" @click="showEditCommentDialog = true; editingComment = comment.id; commentText = comment.comment" v-tooltip.top="'Editovat komentář'"/>
                    <ConfirmPopup/> 
                    <Button icon="pi pi-times" v-if="isAdmin || isCommentOwner(comment)" class="p-button-rounded p-button-danger p-button-sm" @click="deleteComment(comment.id)" v-tooltip.top="'Smazat komentář'"/>
                  </div>
                </div>
              </template>

              <template #footer>
                <div class="request-comment-footer">
                  <span @click="displayCreatorInfo(comment)" v-tooltip.top="'Klikněte na jméno pro více informací o uživateli'">Napsal: {{comment.userName}} {{comment.userSurname}}</span>
                  <span>{{new Date(comment.createdAt).toLocaleString("cs")}}</span>
                </div>
              </template>
          </Card>
        </div>
      </div>
    </div>
  </div> 

  <Dialog class="edit-request" v-model:visible="showEditRequestData">
    <template #header>
      <h3>Upravit hodnoty</h3>
    </template>

    <div class="edit-request-inputtext">
      <InputText type="text" class="p-inputtext" v-model="request.expectedTime"  placeholder="Předpokládaný čas řešení"/>
      <br>
      <small>Do pole vepisujte ve formátu: XX<b>h</b> XX<b>m</b></small>
      
    </div>
    <div class="edit-request-inputtext">
      <InputText type="text" class="p-inputtext" v-model="request.solutionTime"  placeholder="Vykázaný čas"/>
      <br>
      <small >Do pole vepisujte ve formátu: XX<b>h</b> XX<b>m</b></small>
    </div>

    <div class="edit-request-inputtext">
      <InputText type="text" class="p-inputtext" v-model="request.price"  placeholder="Cena"/>
      <br>
      <small>Do pole vepište částku i měnu: 1000 CZK, 50 €, 100 $</small>
    </div>

    <template #footer>
      <Button label="Zrušit" icon="pi pi-times" class="p-button-text" @click="showEditRequestData = false"/>
      <Button label="Upravit" icon="pi pi-check" autofocus @click="editRequest();showEditRequestData = false"/>
    </template>
  </Dialog>

  <Dialog v-model:visible="showCommentDialog">
    <template #header>
      <h3>Přidat komentář</h3>
    </template>
    <Textarea class="comment" :autoResize="true" v-model="commentText" rows="5" cols="30" />

    <template #footer>
      <Button label="Zrušit" icon="pi pi-times" class="p-button-text" @click="showCommentDialog = false"/>
      <Button label="Odeslat" icon="pi pi-check" autofocus @click="addComment" />
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
  // @ is an alias to /src
  import UserInfoDialogVue from "@/components/UserInfoDialog.vue";

  import { useRequestsStore } from "@/stores/RequestsStore";
  import { useUsersStore} from "@/stores/UsersStore";
  import { useAuthStore } from "@/stores/AuthStore";
  // import { useAuthStore } from "@/stores/AuthStore";
  import Button from "primevue/button";
  import Dropdown from 'primevue/dropdown';
  import Dialog from "primevue/dialog";
  import Textarea from "primevue/textarea";
  import InputText from 'primevue/inputtext';
  import Card from 'primevue/card';
  import ConfirmPopup from 'primevue/confirmpopup';
  //import Badge from 'primevue/badge';

  export default {
    components: {
      Button, 
      Dropdown,
      Dialog,
      Textarea,
      InputText,
      Card,
      UserInfoDialogVue,
      ConfirmPopup
    },
    name: "RequestDetailView",
    // props: {
    //   ticketId: Number
    // },
    data() {
      return {
        requestID: this.$route.params.requestID,
        request: {},
        showCommentDialog: false,
        showEditRequestData: false,

        selectedUser: {},
        isUserInfoVisible: false,

        editMode: false,
        commentText: "",
        addTechnician: null,
        technicians: [],
        changeState: null,
        states: [
        {name: 'Nevyřešeno'},
          {name: 'Vyřešeno'}
        ],
        showEditCommentDialog: false,
        editingComment: null
      };
    },
    async mounted() {
      this.requestID = this.$route.params.requestID

      const requestsStore = useRequestsStore();
      this.requestsStore = requestsStore;

      this.authStore = useAuthStore();
      
      await this.loadRequest();
    },
    methods: {
      async loadRequest() {
        this.request = await this.requestsStore.getServiceRequest(this.requestID)
        
        //console.log(this.request.comments.sort((objA, objB) => Number(objB.createdAt) - Number(objA.createdAt)))
        this.request.comments = this.request.comments.sort((objA, objB) => Number(new Date(objB.createdAt)) - Number(new Date(objA.createdAt)))
        
        //console.log(this.request.comments.sort(function(a, b){return new Date(b) - new Date(a)}))
        this.loadTechnicians();
      },
      async loadTechnicians() {
        if(!this.authStore.hasRole(2))
          return;

        const usersStore = useUsersStore();

        let technicians = await usersStore.getUsers(1);
        if(!technicians.error){
          this.technicians = technicians.filter(tech => !this.request.technicians.find(t => tech.id == t.technicianID))
        }
        else
          this.technicians = [];
      },
      async editRequest(){
        const response = await this.requestsStore.updateRequest(this.request);
        if(response.message){
          this.$toast.add({
            severity: "success",
            summary: "Úspěch",
            detail: response?.message || "Požadavek úspěšně upraven",
            life: 3000,
          })
          this.editMode = false;
        }
        else {
          this.$toast.add({
            severity: "error",
            summary: "Chyba",
            detail: response?.error || "Úprava požadavku selhala",
            life: 3000,
          })
        }
        this.loadRequest();
      },

      getUserFrom(parent){
        return {id: parent.userID, name: parent.userName, surname: parent.userSurname, userType: parent.userType}
      },
      displayCreatorInfo(parent){
        this.selectedUser = this.getUserFrom(parent);
        this.isUserInfoVisible = true;
      },

      displayUserInfo(technician){
        this.selectedUser = technician;
        this.isUserInfoVisible = true;
      },
      
      getStatus(solutionState) {
        switch (solutionState) {
          case 0:
            return "Nevyřešeno";
          case 1:
            return "Vyřešeno";
        }
      },
      getTechnicianLabel(technician) {
        return technician?.name + " " + technician?.surname; 
          
      },
      async stateChange(event){
        const requestsStore = useRequestsStore();
        var state = 0

        switch(event.value.name) {
          case "Nevyřešeno":
            state = 0
            break
          case "Vyřešeno":
            state = 1
            break
        }

        const response = await requestsStore.changeState(this.request, state)
        
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
        this.loadRequest();
      },
      async addComment() {
        const response = await this.requestsStore.addComment(this.requestID,{comment: this.commentText});
        if(response.message){
          this.$toast.add({
            severity: "success",
            summary: "Úspěch",
            detail: response?.message || "Komentář byl úspěšně vytvořen",
            life: 3000,
          })
        }
        else {
          this.$toast.add({
            severity: "error",
            summary: "Chyba",
            detail: response?.error || "Chyba při vytvoření komentáře",
            life: 3000,
          })
        }
        this.loadRequest();
        this.showCommentDialog = false;
        this.commentText = "";
      },
      async technicianChange(event) {
        const response = await this.requestsStore.addTechnician(this.requestID, event.value.id);
        if(response.message){
          this.$toast.add({
            severity: "success",
            summary: "Úspěch",
            detail: response?.message || "Technik byl úspěšně přidán",
            life: 3000,
          })
        }
        else {
          this.$toast.add({
            severity: "error",
            summary: "Chyba",
            detail: response?.error || "Chyba při přidání technika",
            life: 3000,
          })
        }
        this.loadRequest();
        this.addTechnician = null;
      },
      async removeTechnician(technicianID) {
        
        const response = await this.requestsStore.removeTechnician(this.requestID,technicianID);
        if(response.message){
          this.$toast.add({
            severity: "success",
            summary: "Úspěch",
            detail: response?.message || "Technik byl úspěšně odebrán",
            life: 3000,
          })
        }
        else {
          this.$toast.add({
            severity: "error",
            summary: "Chyba",
            detail: response?.error || "Chyba při odebrání technika",
            life: 3000,
          })
        }
        this.loadRequest();
      },
      commentButtonItems(comment) {
        return [
        {
          label: 'Editovat',
          icon: 'pi pi-file-edit',
          command: () => {
            this.commentText = comment.comment;
            this.showEditCommentDialog = true;
            this.editingComment = comment.id;
          }
        },
        {
          label: 'Smazat',
          icon: 'pi pi-times',
          command: () => {
            this.deleteComment(comment.id);
          }
        },
        ]
      },
      async deleteRequest(requestID){
        this.$confirm.require({
          target: event.currentTarget,
          message: 'Opravdu chcete smazat požadavek?',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: 'Potvrdit',
          rejectLabel: 'Zrušit',
          acceptIcon: 'pi pi-check',
          rejectIcon: 'pi pi-times',
          accept: async () => {
            const response = await this.requestsStore.deleteRequest(requestID);

            if(response.message){
              this.$toast.add({
                severity: "success",
                summary: "Úspěch",
                detail: response?.message || "Požadavek úspěšně smazán",
                life: 3000,
              })
              setTimeout(async () => {
                await this.$router.push({
                name: "requests"
                })
              }, 1000);
            }
            else {
              this.$toast.add({
                severity: "error",
                summary: "Chyba",
                detail: response?.error || "Smazání požadavku selhalo",
                life: 3000,
              })
            }
          },
          reject: () => {},
          onShow: () => {},
          onHide: () => {}
      });
      },
      async deleteComment(commentID) {
        this.$confirm.require({
          target: event.currentTarget,
          message: 'Opravdu chcete smazat komentář?',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: 'Potvrdit',
          rejectLabel: 'Zrušit',
          acceptIcon: 'pi pi-check',
          rejectIcon: 'pi pi-times',
          accept: async () => {
            const response = await this.requestsStore.deleteComment(commentID);

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

            this.loadRequest();
          },
          reject: () => {},
          onShow: () => {},
          onHide: () => {}
        });
      },
      async editComment(commentID) {
        const response = await this.requestsStore.editComment(commentID,{comment: this.commentText});
        if(response.message){
          this.$toast.add({
            severity: "success",
            summary: "Úspěch",
            detail: response?.message || "Komentář byl úspěšně změněn",
            life: 3000,
          })
        }
        else {
          this.$toast.add({
            severity: "error",
            summary: "Chyba",
            detail: response?.error || "Chyba při editaci komentáře",
            life: 3000,
          })
        }

        this.loadRequest();
        this.showEditCommentDialog = false;
        this.commentText = "";
      },
      isCommentOwner(comment) {
        return comment.userID == useAuthStore().getUserData?.id;
      },
    },
    computed: {
      isManager(){
        return useAuthStore().hasRole(2);
      },
      isAdmin(){
        return useAuthStore().hasRole(3);
      },
      // techniciansLabels() {
      //   return this.technicians.map(technician => ({name: technician.name + " " + technician.surname, id: technician.id}));
      // }
    }
  };
</script>

<style lang="scss">

.request-technicians{
  .p-card{
    max-width: 80%;
  }
}

.request-body-right {
  .p-card {
    max-width: 225px;
  }
}

.request-body-right-card {
  .p-card-header{
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 10px;
  }
}
  .edit-request{
    min-width: 500px;

    .edit-request-inputtext {
      width: 100%;
      margin-bottom: 20px;

      .p-inputtext {
        width: 100%;
      }
    }
  }
</style>

<style scoped lang="scss">

.user-info{
  span{
    cursor: pointer;
  }
}

.request-body{
  .p-card{
    margin-bottom: 20px;
  :deep(.p-card-body){
    all: unset;
  }
    :deep(.p-card-content){
      all: unset;
    }
  }
}
.changeState{
  margin-left: 200px;
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

  .date{
    margin-right: 30px;
  }

  .request-body{
    display: inline-flex;
    width: 100%;

    .request-body-left {
      width: 50%;
      .request-body-left-dropdown{
        width: 100%;
      }
    }
    .request-body-right{
      
      width: 50%;
      margin-bottom: 20px;

      .request-body-right-inputtext{
        margin-bottom: 20px;
      }
    }

    .request-technicians{
    display: inline-flex;
    width: 100%;
    .request-technicians-body {
      :deep(.cross-button) {
        width: 2rem;
        height: 2rem;
        
      }
      display: inline-flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 1.2rem;
      min-width: 225px;
      padding: 10px 10px 10px 10px;
  }
  }
  }
  
  .request-detail{
    width: 900px;
    margin: 0 auto;
    text-align: left;
    
    .request-header{
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      .p-inputtextarea{
        width: 100%;
        font-size: 2rem;
        font-family: Avenir, Helvetica, Arial, sans-serif;
        font-weight: 700;
      }

      .request-header-bottom{
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;

        .request-header-bottom-left{
          max-width: 40%;
          .request-creator{
            cursor: pointer;
          }
        }
        .request-header-bottom-buttons{
          .edit-buttons{
          display: inline-flex;
          justify-content: space-evenly;
          margin-right: 20px;
          margin-left: 20px;
          min-width: 123px;
        }
          
        }
      }
      .request-header-top {
        width: 100%;
      }
      .request-title{
        font-size: 2rem;
        word-wrap: anywhere;
        margin-bottom: 10px;
      }
    }
    .request-description{
      margin-top: 40px;
      line-height: 1.6em;
      .p-inputtextarea{
          line-height: 1.6em;
          width: 100%;
        }
    } 
  }
  
  .request-comments-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 40px;
  }

  .request-comment{
    margin-top: 20px;
    margin-bottom: 30px;
    .request-comment-body{
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      width: 100%;
      span{
        max-width: 731.5px;
      }
      .request-comment-body-buttons{
        max-height: 48px;
        min-width: 160px;
        text-align: right;
        .p-button-primary {
          margin-right: 10px;
        }
      }
    }
    .request-comment-footer{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;

      span{
        cursor: pointer;
      }

      .date{
        min-width: 160px;
      }
      span{
        max-width: 687.5px;
      }
  }
  }
  .changestate {
    width: 200px;
  }
  .flexbox{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
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