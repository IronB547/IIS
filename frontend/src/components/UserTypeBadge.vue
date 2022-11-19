<template>
    <Badge class="badge" :value="getName" :severity="getSeverity" />
</template>

<script>
import Badge from 'primevue/badge';

export default {
    data: function () {
        return {
            userTypes: [
                {name: 'Uživatel', value: 0, severity: 'success'},
                {name: 'Servisní technik', value: 1, severity: 'info'},
                {name: 'Správce města', value: 2, severity: 'warning'},
                {name: 'Admin', value: 3, severity: 'danger'},
            ]
        }
    },
    props: {
        userType: Number
    },
    components: {
        Badge
    },
    computed: {
        getSeverity: function () {
            return this.userTypes[this.userType].severity || 'danger';
        },
        getName: function () {
            console.log(this.userType);
            return this.userTypes[this.userType].name || 'UNKNOWN';
        },
    }
}
</script>

<style scoped>
    .badge {
        min-width: 120px;
    }

</style>