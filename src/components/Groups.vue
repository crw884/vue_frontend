<template>
    <div class="flex flex-col w-full mt-24">
        <DataTable
            :value="groups"
            :lazy="true"
            :loading="groupStore.loading"
            :paginator="true"
            :rows="perpage"
            :rowsPerPageOptions="[1, 2, 3, 5, 10]"
            :totalRecords="groups_total"
            @page="onPageChange"
            responsive-layout="scroll"
            :first="offset"
        >
            <template #header>
                <InputText
                    v-model="search"
                    type="text"
                    id="search"
                    required
                    placeholder="Поиск по имени"
                    class="m-2 sm:w-auto"
                />
                <Button
                    type="button"
                    @click="OnPushSearchButton()"
                    icon="pi pi-search"
                    label="Найти"
                    form="search"
                />
            </template>
            <Column field="id" header="id" />
            <Column field="image" header="">
                <template #body="slotProps">
                    <router-link
                        :to="{ name: 'Group', params: { id: slotProps.data.id } }"
                        class="gap-3 flex flex-row items-center"
                    >
                        <Avatar
                            v-if="slotProps.data.image"
                            :image="slotProps.data.image"
                            shape="circle"
                        ></Avatar>
                    </router-link>
                </template>
            </Column>
            <Column field="name" header="Название группы">
                <template #body="slotProps">
                    <router-link
                        :to="{ name: 'Group', params: { id: slotProps.data.id } }"
                        class="gap-3 flex flex-row items-center"
                    >
                        <span class="">{{ slotProps.data.name }}</span>
                        <span class="pi pi-external-link"></span>
                    </router-link>
                </template>
            </Column>
            <Column field="description" header="Описание" />
            <Column field="admin" header="Админ" />
            <Column field="" header="Приватная">
                <template #body="slotProps">
                    {{ slotProps.data.is_private === 1 ? 'Да' : 'Нет' }}
                </template>
            </Column>
            <Column field="created_at" header="Дата создания">
                <template #body="slotProps">
                    {{ formatDate(slotProps.data.created_at) }}
                </template>
            </Column>
            <Column header="Действия">
                <template #body="{data}">
                    <div class="flex flex-row gap-5">
						<Button icon="pi pi-times-circle" @click="OpenPopUpConfirm($event,data)" severity="secondary" rounded></Button>
						<Button icon="pi pi-file-edit" @click="onEditButtonPush($event, data)" severity="secondary" rounded></Button>
					</div>
                </template>
            </Column>
        </DataTable>
        <div class="mb-5 mt-3 ml-3 w-full flex flex-row justify-end pr-5">
            <router-link :to="{ name: 'GroupCreate' }" class="w-2xs">
                <Button class="w-full" label="Создать группу"></Button>
            </router-link>
        </div>
    </div>
	<ConfirmPopup></ConfirmPopup>
</template>

<script>
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { useGroupStore } from '@/stores/groupStore.js'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import { ConfirmPopup } from 'primevue'
import router from '@/router.js'
export default {
    name: 'Groups',
    components: { DataTable, Column, Button, Avatar, InputText, ConfirmPopup },
    data() {
        return {
            groupStore: useGroupStore(),
            perpage: 2,
            offset: 0,
            search: '',
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
            this.groupStore.get_groups(this.offset / this.perpage, this.perpage, this.search)
        },
        formatDate(date) {
            if (!date) return ''
            return date.substring(0, 10)
        },
        OnPushSearchButton(event) {
            this.groupStore.get_groups_total(this.search)
            this.groupStore.get_groups(undefined, undefined, this.search)
        },
        OpenPopUpConfirm(event, data) {
            this.$confirm.require({
				message: 'Вы уверены что хотите удалить группу ' + data.name + '?',
				icon: 'pi pi-exclamation-triangle',
				acceptLabel: 'Да',
				rejectLabel: 'Нет',
				accept: () => {
					this.delete_group(data.id)
				}
			})
        },
		async delete_group(id) {
			await this.groupStore.delete_group(id)
			if (this.groupStore.error_code !== 200)
				this.$toast.add({
					severity: 'error',
					summary: 'Ошибка при удалении группы.',
					detail: this.groupStore.error_message,
					life: 4000,
				})
			else
				this.$toast.add({
					severity: 'success',
					summary: 'Группа успешно удалена.',
					detail: this.groupStore.error_message,
					life: 4000,
				})
			this.groupStore.get_groups(this.offset / this.perpage, this.perpage, this.search)
		},
		onEditButtonPush($event, data){
			router.push({ name: 'GroupCreate', params: {id: data.id} })
		}
    },
}
</script>

<style scoped></style>
