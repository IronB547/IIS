<template>
    <main>
        <div class="header">
            <h3>Add new service request</h3>
        </div>

        <form class="content" @submit.prevent="addRequest">
            <div class="content-header">
                <div class="content-header-item">
                    <span class="p-float-label">
                        <InputText type="text" v-model="request.title" />
                        <label for="title">Title</label>
                    </span>
                </div>
                
                <!-- <div class="content-header-item">
                    <span class="p-float-label">
                        <Dropdown v-model="request.solutionState" :options="solutionStates" optionLabel="name" class="dropdown" placeholder="Select a solution state" />
                        <label for="dropdown">Dropdown</label>
                    </span>
                </div> -->

                <div class="content-header-item">
                    <span class="p-float-label">
                        <InputText type="text" v-model="request.ticketID" />
                        <label for="ticket">Ticket</label>
                    </span>
                </div>
            </div>
                
            <div>
                <span class="p-float-label">
                    <Textarea :autoResize="true" name="description" rows="10" class="textarea" type="text" v-model="request.description" />
                    <label for="description">Description</label>
                </span>
            </div>
            <Button type="submit">Create new Request</Button>
        </form>


    </main>
</template>


<script>
import { useRequestsStore } from '@/stores/RequestsStore';
import InputText from 'primevue/inputtext';
// import Dropdown from 'primevue/dropdown';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';

export default {
    name: 'NewRequestView',
    data() {
        return {
            request: {
                title: '',
                description: '',
                ticketID: null,
            },
            solutionStates: [
                { name: 'Open', code: 0 },
                { name: 'Closed', code: 1 },
            ],
            selectedCity: null,
            cities: [
                {name: 'New York', code: 'NY'},
                {name: 'Rome', code: 'RM'},
                {name: 'London', code: 'LDN'},
                {name: 'Istanbul', code: 'IST'},
                {name: 'Paris', code: 'PRS'}
            ]
        }
    },
    methods: {
        addRequest() {
            const requestsStore = useRequestsStore();
            requestsStore.createRequest(this.request);
        }
    },
    components: {
        InputText,
        // Dropdown,
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
}

</style>