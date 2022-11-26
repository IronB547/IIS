<template>
  <section class="requests-list-header">
    <Toolbar class="toolbar">
        <template #start>
          <h1 class="tickets">Servisní požadavky {{ $route.query.ticketID ? ` (pro ticket s ID ${$route.query.ticketID})`:"" }}</h1>
          <div class="grid p-fluid tickets-toolbox">
            <div class="col-12 md:col-4">
                <div class="p-inputgroup">
                    <Button label="Vyhledat" @click="search"/>
                    <InputText placeholder="Název" v-model="searchParams.title"/>
                    <Dropdown @change="stateChange()" :options="states" optionLabel="label" placeholder="Vyberte stav" v-model="selectedState"/>
                </div>
            </div>
        </div>
          <Button class="p-button p-button-primary" label="Vytvoř servisní požadavek"
          @click="$router.push({ name: 'newRequest', params: {ticketID: $route.query.ticketID} })"/>
        </template>
      </Toolbar>
  </section>
  <div class="requests-list">
    <RequestItem v-for="request in requests" v-bind:key="request.id" :request="request"/>
  </div>
  <Paginator :rows="9" :totalRecords="totalItemsCount" @page="onPage($event)"></Paginator>
</template>

<script>
import RequestItem from "@/components/ServiceItem.vue";

import { useRequestsStore } from "@/stores/RequestsStore";

import Button from "primevue/button";
import Toolbar from "primevue/toolbar";
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import Paginator from "primevue/paginator";


export default {
  name: "RequestsListView",
  components: {
    RequestItem,
    Button,
    Toolbar,
    Dropdown,
    InputText,
    Paginator,
  },
  data() {
    return {
      requests: [],
      searchParams: {
        title: "",
        assignedTechnician: undefined,
        solutionState: undefined,
      },
      states: [
        { label: "Všechny", value: undefined},
        { label: "Nevyřešeno", value: 0 },
        { label: "Vyřešeno", value: 1 },
      ],
      selectedState: undefined,
      totalItemsCount: 0,
    }
  },
  async mounted() {
    this.loadRequests();
  },
  methods: {
    async loadRequests() {
      let page = Number(this.$route.params.page) || 1;
      this.requests = await useRequestsStore().getBySearch(page,this.$route.query);
      let totalItemsCount = await useRequestsStore().getBySearch(this.page,this.$route.query, true);
      this.totalItemsCount = totalItemsCount.count || this.requests.length;
    },
    async search() {
      // let queryStr = QueryString.stringify(this.searchParams);
      await this.$router.push({
        name: this.$route.name,
        query: {
          ...this.searchParams,
          ticketID: this.$route.query.ticketID,
        }
      }),
      this.loadRequests();
    },
    stateChange() {
      this.searchParams.solutionState = this.selectedState.value;
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
      this.loadRequests();
    }
  },
  
};
</script>

<style lang="scss" scoped>
  .requests-list{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 50px;
    max-width: 1450px;
    margin: 0 auto;
    margin-bottom: 1rem;

  }
  .requests-list > div{
    box-sizing : border-box;
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

  .requests-list-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto;
    max-width: 1450px;
    margin-bottom: 2rem;
  }

  @media screen and (max-width: 768px){
    .requests-list{
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