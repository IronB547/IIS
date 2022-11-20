<template>
    <main>
        <Toast/>
        <div class="header">
            <h1>Nový Servisní Požadavek</h1>
        </div>
        <br>
        <form class="content" @submit.prevent="addRequest">
            <div class="content-header">
                <div class="content-header-item">
                    <span class="p-float-label">
                        <InputText type="text" v-model="request.title" />
                        <label for="title">Nadpis požadavku</label>
                    </span>
                </div>

                <div class="content-header-item">
                    <span class="p-float-label">
                        <Dropdown v-model="request.ticketID" :options="availableTickets" optionLabel="title" :filter="true"/>
                        <label for="ticket">Ticket</label>
                    </span>
                </div>
            </div>
                
            <div>
                <span class="p-float-label">
                    <Textarea :autoResize="true" name="description" rows="10" class="textarea" type="text" v-model="request.description" />
                    <label for="description">Popis požadavku</label>
                </span>
            </div>
            <Button type="submit" label="Vytvořit nový požadavek"/>
        </form>
    </main>
</template>


<script>
import { useRequestsStore } from '@/stores/RequestsStore';
import { useTicketsStore } from '@/stores/TicketsStore';
import InputText from 'primevue/inputtext';
// import Dropdown from 'primevue/dropdown';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';

export default {
    name: 'NewRequestView',
    data() {
        return {
            request: {
                title: '',
                description: '',
                ticketID: undefined,
            },
            solutionStates: [
                { name: 'Open', code: 0 },
                { name: 'Closed', code: 1 },
            ],
            availableTickets: [
                
            ],
        }
    },
    async mounted() {
        this.getTickets();
    },
    methods: {
        async addRequest() {
            const requestsStore = useRequestsStore();
            const response = await requestsStore.createRequest(this.request);

            if(response.message){
                this.$toast.add({
                    severity: "success",
                    summary: "Úspěch",
                    detail: response?.message || "Požadavek úspěšně vytvořen",
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
                detail: response?.error || "Vytvoření požadavku selhalo",
                life: 3000,
                })
            }
        },
        async getTickets() {
            const ticketsStore = useTicketsStore();
            const response = await ticketsStore.getBySearch(1,{});
            if(response.error) {
                this.$toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: response.error,
                    life: 3000
                });
            } else {
                this.availableTickets = response;
            }
        }
    },
    components: {
        InputText,
        Dropdown,
        Textarea,
        Button
    }
}
</script>

<style scoped lang="scss">

main{
    max-width: 900px;
    margin: 0 auto;
}
.header{
    
}

.content{
    .content-header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;

        .content-header-item:nth-child(1){
            width: calc(75% - 1rem);
        }
        .content-header-item:nth-child(2){
            width: calc(25% - 1rem);
            // margin: 0 1rem 0 0;
        }
        div .p-float-label{
            width: 100%;

        }
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
    // Textarea{
    //     width: 100%;
    // }

    @media screen and (max-width: 768px){
        .content-header{
            flex-direction: column;
            .content-header-item:nth-child(1){
                width: 100%;
            }
            .content-header-item:nth-child(2){
                width: 100%;
                margin: 1rem 0 0 0;
            }
        }
    }
}

</style>