<template>
  <main class="main" id="app-window-main">
    <div class="ticket-header">
      <Toolbar class="toolbar">
        <template #start>
          <h1 class="tickets">Tickety</h1>
          <div class="grid p-fluid tickets-toolbox">
            <div class="col-12 md:col-4">
                <div class="p-inputgroup">
                    <Button label="Vyhledat" @click="search"/>
                    <InputText placeholder="Název" v-model="searchParams.title"/>
                    <Dropdown @change="stateChange()" :options="states" optionLabel="label" placeholder="Vyberte stav" v-model="selectedStatus"/>
                </div>
            </div>
        </div>
            <Button class="p-button-lg p-button-primary" label="Vytvoř ticket" 
            @click="$router.push({ name: 'newTicket' })" :disabled="!isLoggedIn"/>
        </template>
      </Toolbar>
    </div>
    <div class="tickets-list">
      <TicketItem v-for="ticket in tickets" v-bind:key="ticket.id" :ticket="ticket"/>
    </div>
    <Paginator :rows="9" :totalRecords="totalItemsCount" @page="onPage($event)"></Paginator>
  </main>
</template>
  
<script>
  // @ is an alias to /src
  import InputText from 'primevue/inputtext';
  import Button from 'primevue/button';
  import TicketItem from "@/components/TicketItem.vue";
  import Toolbar from 'primevue/toolbar';
  import Dropdown from 'primevue/dropdown';
  import QueryString from 'query-string';
  import Paginator from 'primevue/paginator';

  import {useTicketsStore} from '@/stores/TicketsStore';
  import { useAuthStore } from '@/stores/AuthStore';

  export default {
    name: "TicketsListView",
    components: {
      TicketItem,
      InputText,
      Button,
      Toolbar,
      Dropdown,
      Paginator,
    },
    data() {
      return {
        tickets: [],
        states: [
          {label: 'Všechny', value: undefined},
          {label: 'Vytvořeno', value: 0},
          {label: 'Čeká na schválení', value: 1},
          {label: 'Vyřešeno', value: 2},
          {label: 'Zamítnuto', value: 3},
        ],
        searchParams: {
          title: '',
          status: undefined
        },
        selectedStatus: undefined,
        totalItemsCount: 0,
      }
    },
    async mounted() {
      this.loadTickets();
    },
    methods: {
      async loadTickets() {
        let page = Number(this.$route.params.page) || 1;
        this.tickets = await useTicketsStore().getBySearch(page,this.$route.query);
        let totalItemsCount = await useTicketsStore().getBySearch(this.page,this.$route.query, true);
        this.totalItemsCount = totalItemsCount.count || this.tickets.length;
      },
      async search() {
        let queryStr = QueryString.stringify(this.searchParams);
        await this.$router.push(`${this.$route.path}?${queryStr}`);
        this.loadTickets();
      },
      stateChange() {
        this.searchParams.status = this.selectedStatus.value;
        this.search();
      },

      async onPage(event) {
        await this.$router.push({
          name: this.$route.name,
          query: {
            ...this.$route.query,
          },
          params: {
            ...this.$route.params,
            page: event.page + 1,
          }
        });
        this.loadTickets();
      }
    },
    computed: {
      isLoggedIn() {
        return useAuthStore().isLoggedIn;
      }
    },
    
  };
</script>

<style scoped lang="scss">
  #app-window-main {
    min-height: 100%;
  }

  main{
    max-width: 1450px;
    margin: 0 auto;
  }

  .toolbar{
    width: 100%;
    h1{
      margin: 0;
    }
    :deep(.p-toolbar-group-left){
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }
  }
  .tickets-toolbox{
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;

    > div{
      flex-basis: 1;
    }
  }
  .tickets{
    color: white;
    //background-color: var(--indigo-700);
    border-radius: 10px;
    display: inline-block;
    padding: 7px 20px;
  }
  .ticket-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
  }
  .tickets-list{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 50px;
    max-width: calc(100% - 40px);
    // max-width: 1450px;
    margin: 0 auto;
    margin-bottom: 1rem;
  }
  .tickets-list > div{
    box-sizing : border-box;
  }

  @media screen and (max-width: 768px) {
    .tickets-list{
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    }

    .toolbar{
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      :deep(.p-toolbar-group-left){
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: column;
        > {
          width: 100%;
          margin-bottom: 1rem;
        }
      }
    }
  }
</style>