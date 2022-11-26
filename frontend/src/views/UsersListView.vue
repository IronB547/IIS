<template>
    <Toast/>
    <Toolbar>
        <template #start>
            <h3>Správa uživatelů</h3>
            <!-- <i class="pi pi-bars p-toolbar-separator mr-2" /> -->
            <!-- <SplitButton label="Save" icon="pi pi-check" :model="items" class="p-button-warning"></SplitButton> -->
        </template>
        
        <template #end>
            <Button label="New" icon="pi pi-plus" class="mr-2" @click="createUserDialog=true; submitted = false;"/>
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
            <Column field="id" header="ID" :sortable="true" ></Column>
            <Column field="name" header="Jméno" :sortable="true"></Column>
            <Column field="surname" header="Příjmení" :sortable="true"></Column>
            <Column field="userType" header="Typ uživatele" :sortable="true">
                <template #body="{data}">
                    <UserTypeBadge :userType="data.userType"></UserTypeBadge>
                </template>
            </Column>
            <Column field="email" header="E-mail" :sortable="true"></Column>
            <Column field="phoneNum" header="Telefonní číslo" :sortable="true"></Column>
            <Column header="Akce" :sortable="false" class="column-action">
                <template #body="{data}">
                    <span class="p-buttonset">
                        <Button class="p-button-sm" icon="pi pi-user-edit" @click="editUser(data)" v-tooltip.top="'Upravit uživatele'"></Button>
                        <Button class="p-button-danger p-button-sm" icon="pi pi-trash" @click="removeUser(data.id)" v-tooltip.top="'Smazat uživatele'"></Button>
                    </span>
                </template>
            </Column>
            <template #paginatorstart>
                <Button type="button" icon="pi pi-refresh" class="p-button-text" @click="load"/>
            </template>
            <template #paginatorend>
                <!-- <Button type="button" icon="pi pi-cloud" class="p-button-text" /> -->
            </template>
        </DataTable>
	</div>
    <Dialog v-model:visible="createUserDialog">
        <template #header>
            <h3>Registrovat uživatele</h3>
        </template>
        
        <div class="dialog-body">
            <div class="input-block">
                <label for="name">Jméno</label>
                <InputText id="name" type="text" :class="{'p-invalid' :  newUser.name.length < 2 && submitted}" v-model="newUser.name" class="p-inputtext" required/>
            </div>
            <div class="input-block">
                <label for="surname">Příjmení</label>
                <InputText id="surname" type="text" :class="{'p-invalid' :  newUser.surname.length < 2 && submitted}" v-model="newUser.surname" class="p-inputtext" required/>
            </div>
            <div class="input-block">
                <label for="email">E-mail</label>
                <InputText id="email" type="email" :class="{'p-invalid' : !newUser.email.match(/^\S+@\S+\.\S+$/) && submitted}" v-model="newUser.email" class="p-inputtext" required/>
            </div>

            <div class="input-block">
                <label for="phone">Telefonní číslo</label>
                <InputText id="phone" type="tel" v-model="newUser.phoneNum" 
                :class="{'p-invalid' : !newUser.phoneNum.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im) && submitted}"
                 class="p-inputtext" required/>
            </div>

            <div class="input-block">
                <label for="password">Heslo</label>
                <Password id="user-screen-reg-password" prompt-label="Vyberte heslo" weakLabel="Slabé heslo" mediumLabel="Průměrné heslo" strongLabel="Silné heslo" v-model="newUser.password" :class="{'p-invalid' :  newUser.password.length < 8 && submitted}" class="p-inputtext pwd" toggleMask required>
                    <template #footer>
                        <Divider />
                        <p class="mt-2">Podmínka</p>
                        <ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
                            <li>Alespoň 8 znaků</li>
                        </ul>
                    </template>    
                </Password>
            </div>

            <div class="input-block">
                <label for="userType">Typ uživatele</label>
                <Dropdown v-model="newUser.userType" :options="userTypes" optionLabel="name" optionValue="value" placeholder="Select a UserType" />
            </div>
        </div>

        <template #footer>
            <Button label="Zrušit" icon="pi pi-times" class="p-button-text" @click="createUserDialog = false"/>
            <Button label="Odeslat" icon="pi pi-check" autofocus @click="createUser"/>
        </template>
    </Dialog>
    <Dialog v-model:visible="editUserDialog">
        <template #header>
            <h3>Změna údajů uživatele</h3>
        </template>
        
        <div class="dialog-body">
            <div class="input-block">
                <label for="name">Jméno</label>
                <InputText id="name" type="text" v-model="editingUser.name" class="p-inputtext" required/>
            </div>
            <div class="input-block">
                <label for="surname">Príjmení</label>
                <InputText id="surname" type="text" v-model="editingUser.surname" class="p-inputtext" required/>
            </div>
            <div class="input-block">
                <label for="email">E-mail</label>
                <InputText id="email" type="email" v-model="editingUser.email" class="p-inputtext" required/>
            </div>

            <div class="input-block">
                <label for="phone">Telefonní číslo</label>
                <InputText id="phone" type="tel" v-model="editingUser.phoneNum" class="p-inputtext" required/>
            </div>

            <div class="input-block">
                <label for="password">Heslo</label>
                <Password id="user-screen-reg-password" weakLabel="Slabé heslo" mediumLabel="Průměrné heslo" strongLabel="Silné heslo" v-model="editingUser.password" class="p-inputtext pwd" toggleMask required>
                    <template #header>
                        <h6>Vyberte heslo</h6>
                    </template>
                    <template #footer>
                        <Divider />
                        <p class="mt-2">Podmínka</p>
                        <ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
                            <li>Alespoň 8 znaků</li>
                        </ul>
                    </template>    
                </Password>
            </div>

            <div class="input-block">
                <label for="userType">Typ uživatele</label>
                <Dropdown v-model="editingUser.userType" :options="userTypes" optionLabel="name" optionValue="value" placeholder="Select a UserType" />
            </div>

            <div class="input-block switch-block">
                <label for="blocked">Zablokování účtu</label>
                <InputSwitch name="blocked" v-model="editingUser.isBlocked" class=""/>
            </div>
        </div>

        <template #footer>
            <Button label="Zrušit" icon="pi pi-times" class="p-button-text" @click="createUserDialog = false"/>
            <Button label="Odeslat" icon="pi pi-check" autofocus @click="submitEditUser"/>
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
import InputSwitch from 'primevue/inputswitch';
import Toast from 'primevue/toast';

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
            editingUser: null,
            userTypes: [
                {name: 'Uživatel', value: 0},
                {name: 'Servisní technik', value: 1},
                {name: 'Správce města', value: 2},
                {name: 'Admin', value: 3},
            ],
            createUserDialog: false,
            editUserDialog: false,
            store: useUsersStore(),

            submitted: false
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
            this.submitted = true;
            const res = await this.store.createUser(this.newUser);
            console.log(res);
            if(res.status === 201){
                this.createUserDialog = false;
                this.newUser = {
                    name: '',
                    surname: '',
                    email: '',
                    phoneNum: '',
                    password: '',
                    userType: 0
                };
                this.load();
                this.submitted = false;
            }else if(res.status === 409){
                this.$toast.add({severity:'error', summary: 'Chyba', detail: 'Uživatel s tímto emailem již existuje', life: 3000});
            }else{
                this.$toast.add({severity:'error', summary: 'Chyba', detail: 'Uživatele se nepodařilo vytvořit', life: 3000});
            }
        },
        async editUser(user) {
            // await this.store.createUser(this.newUser);
            this.editUserDialog = true;
            user.isBlocked = !!user.isBlocked;
            this.editingUser = user;
        },
        async submitEditUser() {
            await this.store.editUser(this.editingUser.id,this.editingUser);
            this.editUserDialog = false;
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
        UserTypeBadge,
        InputSwitch,
        Toast
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
        .switch-block {
            display: flex;
            align-items: center;
            label{
                margin-right: 1rem;
            }
        }
    }

    
    .p-datatable {
        :deep(.column-action){
            min-width: 9rem;
        }
        .p-buttonset{
            width: 100%;
            .p-button{
                width: 33%;
            }
        }
    }
</style>