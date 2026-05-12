<template>
    <div class="flex justify-center" v-if="authStore.user">
        <form v-on:submit.prevent="save" class="w-1/2 p-6">
            <h2 class="text-2xl mb-4 text-center">
                {{ edit_mode ? 'Редактировать' : 'Создать' }} группу
            </h2>
            <div class="flex flex-col">
                <InputText
                    type="text"
                    placeholder="Введите название группы"
                    v-model="group_name"
                    v-on:invalid.prevent="notifyUser"
                    :required="!edit_mode"
                />
            </div>
            <div class="flex flex-col mt-5">
                <InputText
                    type="text"
                    placeholder="Введите описание группы"
                    v-model="this.group_description"
                />
            </div>
            <div class="mb-4 mt-4 flex flex-row w-full gap-4">
                <!--				<Image v-if="group_image && edit_mode" :src="group_image"-->
                <!--					   alt="img"-->
                <!--					   class="w-10 h-10 overflow-hidden aspect-square rounded-lg"-->
                <!--					   image-class="w-full h-full aspect-square object-cover"-->
                <!--					   preview></Image>-->
                <label
                    for="fileImage"
                    id="img-label"
                    class="block text-md font-medium text-gray-300 border border-gray-300 rounded-md p-2 w-full"
                >
                    <span class="pi pi-upload mx-3"></span>Выбрать изображение
                </label>
                <input
                    type="file"
                    hidden
                    id="fileImage"
                    name="fileImage"
                    v-on:change="changeImgCaption"
                    accept="image/*"
                />
                <Button
                    icon="pi pi-trash"
                    class="aspect-square"
                    @click="this.removeImage"
                    v-if="group_image"
                ></Button>
            </div>
            <div class="flex flex-row gap-3 mb-5 mt-5 items-center">
                <Checkbox v-model="group_private" binary input-id="is_private" />
                <label for="is_private" class="justify-center flex items-center"
                    >Приватная группа</label
                >
            </div>
            <div class="flex flex-col mt-5">
                <Button
                    type="submit"
                    :label="edit_mode ? 'Сохранить' : 'Создать'"
                    :loading="groupStore.loading"
                ></Button>
            </div>
        </form>
    </div>
    <div v-else class="flex justify-center mt-10">
        <p>Авторизуйтесь чтобы {{ edit_mode ? 'редактировать' : 'создавать' }} группы.</p>
    </div>
</template>

<script>
import InputText from 'primevue/inputtext'
import Toast from 'primevue/toast'
import Button from 'primevue/button'
import { useToast } from 'primevue'
import Checkbox from 'primevue/checkbox'
import { useAuthStore } from '@/stores/authStore.js'
import { useGroupStore } from '@/stores/groupStore.js'
import router from '@/router.js'
import axios from 'axios'
import Image from 'primevue/image'

export default {
    name: 'CreateGroup',
    components: { InputText, Toast, Button, Checkbox, Image },
    data() {
        return {
            groupStore: useGroupStore(),
            group_name: '',
            group_description: '',
            group_private: 0,
            group_image: '',
            toast: useToast(),
            authStore: useAuthStore(),
        }
    },
    computed: {
        errorMessage() {
            return this.groupStore.error_message
        },
        errorCode() {
            return this.groupStore.error_code
        },
        user_id() {
            return this.authStore.user.id
        },
        edit_mode() {
            return !!this.$route.params.id
        },
        group_id() {
            return this.$route.params.id
        },
    },
    watch: {
        group_id: {
            handler(newId) {
                if (newId && this.authStore.user) {
                    this.getGroup()
                } else if (!newId) {
                    this.group_name = ''
                    this.group_private = 0
                    this.group_image = ''
                    this.group_description = ''
                }
            },
            immediate: true,
        },
        'authStore.user': {
            handler(user) {
                if (user && this.group_id) {
                    this.getGroup()
                }
            },
            immediate: true,
        },
    },

    methods: {
        async save() {
            if (this.edit_mode) {
                await this.editGroup()
            } else {
                await this.createGroup()
            }
        },
        async editGroup() {
            const formData = new FormData()
            formData.append('user_id', this.user_id)
            formData.append('name', this.group_name)
            formData.append('is_private', this.group_private)
            formData.append('description', this.group_description)
            if (this.group_image != null) formData.append('image', this.group_image)

            await this.groupStore.edit_group(formData, this.group_id)
            if (this.errorCode !== 201)
                this.$toast.add({
                    severity: 'error',
                    summary: 'Ошибка при редактировании группы',
                    detail: this.errorMessage,
                    life: 4000,
                })
            else
                this.$toast.add({
                    severity: 'success',
                    summary: 'Успех',
                    detail: this.errorMessage,
                    life: 4000,
                })
        },
        async createGroup() {
            const formData = new FormData()
            formData.append('user_id', this.user_id)
            formData.append('name', this.group_name)
            formData.append('is_private', this.group_private)
            formData.append('description', this.group_description)
            if (this.group_image != null) formData.append('image', this.group_image)

            await this.groupStore.create_group(formData)
            if (this.errorCode !== 201)
                this.$toast.add({
                    severity: 'error',
                    summary: 'Ошибка при создании группы',
                    detail: this.errorMessage,
                    life: 4000,
                })
            else
                this.$toast.add({
                    severity: 'success',
                    summary: 'Группа успешно создана',
                    detail: this.errorMessage,
                    life: 4000,
                })
        },
        notifyUser() {
            this.$toast.add({
                severity: 'warn',
                summary: 'Не все поля заполнены',
                detail: 'Заполните все поля формы.',
                life: 4000,
            })
        },
        changeImgCaption(event) {
            const file = event.target.files[0]
            if (file) {
                document.getElementById('img-label').innerHTML =
                    '<span class="pi pi-upload mx-3"></span>' + file.name
                this.group_image = file
            } else {
                document.getElementById('img-label').innerHTML =
                    '<span class="pi pi-upload mx-3"></span>Выбрать изображение'
                this.group_image = null
            }
        },
        async getGroup() {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL
                const response = await axios.get(backendUrl + '/group/' + this.group_id)
                this.group_name = response.data.name
                this.group_description = response.data.description
                this.group_private = response.data.is_private
                this.group_image = response.data.image
                if (this.group_image != null && document.getElementById('img-label')) {
                    document.getElementById('img-label').innerHTML =
                        '<span class="pi pi-upload mx-3"></span>' +
                        this.group_image
                            .substring(0, this.group_image.lastIndexOf('_'))
                            .split('/')
                            .pop()
                }
            } catch (error) {
                console.log(error)
            }
        },
        removeImage() {
            document.getElementById('img-label').innerHTML =
                '<span class="pi pi-upload mx-3"></span>Выбрать изображение'
            this.group_image = null
        },
    },
}
</script>

<style scoped></style>
