<template>
    <Toolbar>
        <template #start>
            <h3>Users</h3>
            <!-- <i class="pi pi-bars p-toolbar-separator mr-2" /> -->
            <!-- <SplitButton label="Save" icon="pi pi-check" :model="items" class="p-button-warning"></SplitButton> -->
        </template>
        
        <template #end>
            <Button label="New" icon="pi pi-plus" class="mr-2" @click="createUserDialog=true"/>
            <!-- <Button icon="pi pi-search" class="mr-2" /> -->
            <!-- <Button icon="pi pi-calendar" class="p-button-success mr-2" /> -->
            <!-- <Button icon="pi pi-times" class="p-button-danger" /> -->
        </template>
    </Toolbar>
	<div>
        <DataTable :value="users" :paginator="true" :rows="10"
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            :rowsPerPageOptions="[10,20,50]" responsiveLayout="scroll"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords}">
            <Column field="id" header="ID" :sortable="true"></Column>
            <Column field="name" header="Name" :sortable="true"></Column>
            <Column field="surname" header="Surname" :sortable="true"></Column>
            <Column field="userType" header="User Type" :sortable="true">
                <template #body="{data}">
                    <UserTypeBadge :userType="data.userType"></UserTypeBadge>
                </template>
            </Column>
            <Column field="email" header="E-mail" :sortable="true"></Column>
            <Column field="phoneNum" header="Telefonní číslo" :sortable="true"></Column>
            <Column header="Action" :sortable="false">
                <template #body="{data}">
                    <Button class="p-button-danger" @click="removeUser(data.id)">Remove</Button>
                </template>
            </Column>
            <template #paginatorstart>
                <Button type="button" icon="pi pi-refresh" class="p-button-text" />
            </template>
            <template #paginatorend>
                <Button type="button" icon="pi pi-cloud" class="p-button-text" />
            </template>
        </DataTable>
	</div>
    <Dialog v-model:visible="createUserDialog">
        <template #header>
            <h3>Register user</h3>
        </template>
        
        <div class="dialog-body">
            <div class="input-block">
                <label for="name">Name</label>
                <InputText id="name" type="text" v-model="newUser.name" class="p-inputtext" required/>
            </div>
            <div class="input-block">
                <label for="surname">Surname</label>
                <InputText id="surname" type="text" v-model="newUser.surname" class="p-inputtext" required/>
            </div>
            <div class="input-block">
                <label for="email">E-mail</label>
                <InputText id="email" type="email" v-model="newUser.email" class="p-inputtext" required/>
            </div>

            <div class="input-block">
                <label for="phone">Phone Number</label>
                <InputText id="phone" type="tel" v-model="newUser.phoneNum" class="p-inputtext" required/>
            </div>

            <div class="input-block">
                <label for="password">Password</label>
                <Password v-model="newUser.password" class="p-inputtext pwd" toggleMask required/>
            </div>

            <div class="input-block">
                <label for="userType">User type</label>
                <Dropdown v-model="newUser.userType" :options="userTypes" optionLabel="name" optionValue="value" placeholder="Select a UserType" />
            </div>
        </div>

        <template #footer>
            <Button label="Zrušit" icon="pi pi-times" class="p-button-text" @click="createUserDialog = false"/>
            <Button label="Odeslat" icon="pi pi-check" autofocus @click="createUser"/>
        </template>
    </Dialog>
</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Dropdown from 'primevue/dropdown';
import UserTypeBadge from '@/components/UserTypeBadge.vue';
// import ColumnGroup from 'primevue/columngroup';     //optional for column grouping
// import Row from 'primevue/row';                     //optional for row

import {useUsersStore} from '@/stores/UsersStore';

export default {
    name: "UsersListView",
    data() {
        return {
            users: [],
            newUser: {
                name: '',
                surname: '',
                email: '',
                phoneNum: '',
                password: '',
                userType: 0
            },
            userTypes: [
                {name: 'User', value: 0},
                {name: 'Service technician', value: 1},
                {name: 'City manager', value: 2},
                {name: 'Admin', value: 3},
            ],
            createUserDialog: false,
            store: useUsersStore()
        }
    },
    methods: {
        async load(){
            this.users = await this.store.getUsers();
            if (!this.users.length){
                this.users = [];
            }
        },
        async createUser() {
            await this.store.createUser(this.newUser);
            this.createUserDialog = false;
            this.load();
        },
        async removeUser(id) {
            await this.store.removeUser(id);
            this.load();
        }
    },
    components: {
        DataTable,
        Column,
        Toolbar,
        Button,
        Dialog,
        InputText,
        Password,
        Dropdown,
        UserTypeBadge
    },
    async mounted(){
        this.load();
    }
}
</script>

<style lang="scss" scoped>
    .dialog-body {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 1rem;
        margin: 1rem 0;


        .input-block {
            margin-bottom: 1rem;

            > input, .p-dropdown {
                width: 100%;
            }
            .pwd {
                padding: 0;
            }
        }
    }
</style>