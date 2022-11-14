<template>
  <Toast/>
  <div class="request-detail">
    <div class="request-header">
      <div class="request-header-left">
        <h1 class="title">{{request?.title}}</h1>

        <div class="flexbox-date-and-creator">
          <div>
            <div class="ticket-id">
              <h4>Vytvořil: {{request?.userName}} {{request?.userSurname}}</h4>
            </div>
            <p class="header-info">
            <span class="date">{{new Date(request?.createdAt).toLocaleString("cs")}}</span>
            </p>
          </div>
            <Button class="p-button-primary" @click="$router.push(`/tickets/${request?.ticketID}`)" :disabled="!request?.ticketID">Otevřít ticket</Button>
        </div>
      </div>
    </div>
    <div class="request-description">
      {{request?.description}}
    </div>

    <h3>Stav: </h3>
    <div class="flexbox">
      <div class="request-status" :class="{
        unsolved : request?.solutionState == 0,
        solved : request?.solutionState == 1}">
        <h3>{{getStatus(request?.solutionState)}}</h3>
      </div>
      <Dropdown class="changestate" v-model="changeState" :options="states" optionLabel="name" placeholder="Změnit stav" />
    </div>

    <h3> Přiřazení technici: </h3>
    <div class="request-body">
      <div class="request-body-left">
        <div class="request-technicians" v-for="technician in request?.technicians" :key="technician.technicianID">
          <div class="request-technicians-body">
            {{technician.name}} {{technician.surname}}
            <Button icon="pi pi-times" class="p-button-rounded p-button-danger cross-button" @click="removeTechnician(technician.technicianID)" />

          </div>
        </div>
        <div class="request-body-left-dropdown">
          <Dropdown  @change="technicianChange($event)" class="addtechnician" v-model="addTechnician" :options="technicians" :optionLabel="getTechnicianLabel" placeholder="Přidat technika" :loading="technicians.length == 0"/>
        </div>
      </div>

      <div class="request-body-right">
        <div class="request-body-right-inputtext">
          <InputText type="text" class="p-inputtext"  placeholder="Předpokládaný čas řešení"/>
          <br>
          <small>Do pole vepisujte ve formátu: XX<b> h</b> XX<b> m</b></small>
          
        </div>
        <div class="request-body-right-inputtext">
          <InputText type="text" class="p-inputtext"  placeholder="Vykázaný čas"/>
          <br>
          <small >Do pole vepisujte ve formátu: XX<b> h</b> XX<b> m</b></small>
        </div>

        <div class="request-body-right-inputtext">
          <InputText type="text" class="p-inputtext"  placeholder="Cena"/>
          <br>
          <small>Do pole vepište i měnu.</small>
        </div>
      </div>
    </div>

    <div class="request-comments">
      <div class="request-comments-header">
        <h3>Komentáře</h3>
        <Button class="p-button-primary" @click="showCommentDialog = true" :disabled="request?.solutionState > 0">Přidat komentář</Button>
      </div>
      <div class="request-comments-body">
        <div class="request-comment" v-for="comment in request?.comments" :key="comment.id">
          <div class="request-comment-body">
            <span>{{comment.comment}}</span>

            <div class="request-comment-body-buttons">
              <Button icon="pi pi-file-edit" class="p-button-rounded p-button-primary p-button-sm" @click="showEditCommentDialog = true; editingComment = comment.id; commentText = comment.comment"/>
              <Button icon="pi pi-times" class="p-button-rounded p-button-danger p-button-sm" @click="deleteComment(comment.id)"/>
            </div>
          </div>
          <div class="request-comment-footer">
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
      <Button label="Odeslat" icon="pi pi-check" autofocus @click="addComment" />
    </template>
  </Dialog>

  <Dialog v-model:visible="showEditCommentDialog">
    <template #header>
      <h3>Upravit komentář</h3>
    </template>
    <Textarea class="comment" auto-resize="true" v-model="commentText" rows="5" cols="30" />

    <template #footer>
      <Button label="Zrušit" icon="pi pi-times" class="p-button-text" @click="showEditCommentDialog = false"/>
      <Button label="Odeslat" icon="pi pi-check" autofocus @click="editComment(editingComment)" />
    </template>
  </Dialog>

</template>

<script>
  // @ is an alias to /src
  import { useRequestsStore } from "@/stores/RequestsStore";
  import { useUsersStore} from "@/stores/UsersStore";
  // import { useAuthStore } from "@/stores/AuthStore";
  import Button from "primevue/button";
  import Dropdown from 'primevue/dropdown';
  import Dialog from "primevue/dialog";
  import Textarea from "primevue/textarea";
  import InputText from 'primevue/inputtext';

  export default {
    components: {
      Button, 
      Dropdown,
      Dialog,
      Textarea,
      InputText
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
        commentText: "",
        addTechnician: null,
        technicians: [],
        changeState: null,
        states: [
          {name: 'Vyřešeno'},
          {name: 'Nevyřešeno'}
        ],
        showEditCommentDialog: false,
        editingComment: null
      };
    },
    async mounted() {
      this.requestID = this.$route.params.requestID

      const requestsStore = useRequestsStore();
      this.requestsStore = requestsStore;
      
      await this.loadRequest();
    },
    methods: {
      async loadRequest() {
        this.request = await this.requestsStore.getServiceRequest(this.requestID)
        
        //console.log(this.request.comments.sort((objA, objB) => Number(objB.createdAt) - Number(objA.createdAt)))
        this.request.comments = this.request.comments.sort((objA, objB) => Number(new Date(objB.createdAt)) - Number(new Date(objA.createdAt)))
        
        //console.log(this.request.comments.sort(function(a, b){return new Date(b) - new Date(a)}))

        const usersStore = useUsersStore();
        this.technicians = await usersStore.getUsers(1);
        this.technicians = this.technicians.filter(tech => !this.request.technicians.find(t => tech.id == t.technicianID))
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
      async addComment() {
        const response = await this.requestsStore.addComment(this.requestID,{comment: this.commentText});
        if(response.error){
          this.$toast.add({severity:'error', summary: 'Chyba', detail: response.error || "Nelze přidat komentář", life: 3000});
        }
        this.loadRequest();
        this.showCommentDialog = false;
        this.commentText = "";
      },
      async technicianChange(event) {
        const response = await this.requestsStore.addTechnician(this.requestID, event.value.id);
        if(response.error){
          this.$toast.add({severity:'error', summary: 'Chyba', detail: response.error || "Nelze přidat technika", life: 3000});
        }
        this.loadRequest();
        this.addTechnician = null;
      },
      async removeTechnician(technicianID) {
        console.log("removing technician",technicianID);
        const response = await this.requestsStore.removeTechnician(this.requestID,technicianID);
        if(response.error){
          this.$toast.add({severity:'error', summary: 'Chyba', detail: response.error || "Nelze odebrat technika", life: 3000});
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
      async deleteComment(commentID) {
        console.log("deleting comment",commentID);
        await this.requestsStore.deleteComment(commentID);
        this.loadRequest();
      },
      async editComment(commentID) {
        console.log("editing comment",commentID);
        await this.requestsStore.editComment(commentID,{comment: this.commentText});
        this.loadRequest();
        this.showEditCommentDialog = false;
        this.commentText = "";
      },
    },
    computed: {
      // techniciansLabels() {
      //   return this.technicians.map(technician => ({name: technician.name + " " + technician.surname, id: technician.id}));
      // }
    }
  };
</script>


<style lang="scss">

</style>

<style scoped lang="scss">
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
        .p-inputtext{
          width: 250px;
        }
        margin-bottom: 20px;
      }
    }

    .request-technicians{
    display: inline-flex;
    margin-bottom: 10px;
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
      border: 1px solid white;
      min-width: 225px;
      padding: 5px 10px 5px 10px;
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

      .flexbox-date-and-creator{
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
      }
      .request-header-left {
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

    .request-comment-body{
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;

      .request-comment-body-buttons {
        .p-button-rounded{
          margin-right: 10px;
        }
      }
    }
  }

  .request-comment-footer{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
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