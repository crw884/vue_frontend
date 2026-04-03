<template>
	<DataTable
		:value="groups"
		:lazy="true"
		:loading="groupStore.loading"
		:paginator="true"
		:rows="perpage"
		:rowsPerPageOptions="[1,2, 3, 5, 10]"
		:totalRecords="groups_total"
		@page="onPageChange"
		responsive-layout="scroll"
		:first="offset"
	>
		<Column field="id" header="id" />
		<Column field="name" header="Название группы">
			<template #body="slotProps">
				<router-link :to="{name: 'Group', params: {id: slotProps.data.id}}" class="gap-3 flex flex-row items-center">
					<span class="pi pi-external-link"></span>
					<span class="">{{slotProps.data.name}}</span>
				</router-link>
			</template>
		</Column>
		<Column field="description" header="Описание"/>
		<Column field="admin" header="Админ" />
		<Column field="" header="Приватная">
			<template #body="slotProps">
				{{ slotProps.data.is_private === 1 ? "Да" : "Нет"}}
			</template>
		</Column>
		<Column field="created_at" header="Дата создания">
			<template #body="slotProps">
				{{ formatDate(slotProps.data.created_at) }}
			</template>
		</Column>
	</DataTable>
</template>

<script>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { useGroupStore } from '@/stores/groupStore.js'
export default {
	name: 'Groups',
	components: { DataTable, Column },
	data(){
		return {
			groupStore: useGroupStore(),
			perpage: 2,
			offset: 0
		}
	},
	computed: {
		groups() {
			return this.groupStore.groups
		},
		groups_total() {
			return this.groupStore.groups_total
		},
	},
	mounted() {
		this.groupStore.get_groups(this.offset / this.perpage, this.perpage)
		this.groupStore.get_groups_total()
		console.log(this.groups)
	},
	methods: {
		onPageChange(event) {
			this.offset = event.first
			this.perpage = event.rows
			this.groupStore.get_groups(this.offset / this.perpage, this.perpage)
		},
		formatDate(date) {
			if (!date) return ''
			return date.substring(0, 10)
		},
	},
}
</script>

<style scoped></style>
