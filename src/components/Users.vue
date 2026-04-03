<template>
    <DataTable
        :value="users"
        :lazy="true"
        :loading="userStore.loading"
        :paginator="true"
        :rows="perpage"
        :rowsPerPageOptions="[1,2, 3, 5, 10]"
        :totalRecords="users_total"
        @page="onPageChange"
        responsive-layout="scroll"
        :first="offset"
    >
        <Column field="id" header="id" />
        <Column field="name" header="Никнейм" />
        <Column field="status" header="Статус" />
        <Column field="created_at" header="Дата регистрации">
            <template #body="slotProps">
                {{ formatDate(slotProps.data.created_at) }}
            </template>
        </Column>
    </DataTable>
</template>

<script>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { useUserStore } from '@/stores/userStore.js'

export default {
    name: 'Users',
    components: { DataTable, Column },
    data() {
        return {
            userStore: useUserStore(),
            perpage: 5,
            offset: 0,
        }
    },
    computed: {
        users() {
            return this.userStore.users
        },
        users_total() {
            return this.userStore.users_total
        },
    },
    mounted() {
        this.userStore.get_users()
        this.userStore.get_users_total()
        console.log(this.users)
    },
    methods: {
        onPageChange(event) {
            this.offset = event.first
            this.perpage = event.rows
            this.userStore.get_users(this.offset / this.perpage, this.perpage)
        },
        formatDate(date) {
            if (!date) return ''
            return date.substring(0, 10)
        },
    },
}
</script>

<style scoped></style>
