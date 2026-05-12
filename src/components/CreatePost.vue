<template>
    <div class="flex justify-center" v-if="authStore.user">
        <form v-on:submit.prevent="createPost" class="w-1/2 p-6">
            <h2 class="text-2xl mb-4 text-center">Создать пост</h2>
            <div class="flex flex-col">
                <InputText
                    type="text"
                    placeholder="Введите текст публикации"
                    v-model="this.postText"
                />
            </div>
            <div class="mb-4 mt-4">
                <label
                    for="fileImage"
                    id="img-label"
                    class="block text-md font-medium text-gray-300 border border-gray-300 rounded-md p-2"
                >
                    <span class="pi pi-upload mx-3"></span>Выбрать изображение
                </label>
                <input
                    type="file"
                    hidden
                    id="fileImage"
                    name="fileImage"
                    v-on:change="changeImgCaption"
                    required
                    accept="image/*"
                />
            </div>
            <div class="mb-4 mt-4">
                <label
                    for="fileAudio"
                    id="audio-label"
                    class="block text-md font-medium text-gray-300 border border-gray-300 rounded-md p-2"
                >
                    <span class="pi pi-upload mx-3"></span>Выбрать трек
                </label>
                <input
                    type="file"
                    hidden
                    id="fileAudio"
                    name="fileAudio"
                    v-on:change="changeAudioCaption"
                    required
                    accept="audio/*"
					@invalid="notifyUser"
                />
            </div>
            <div class="flex flex-col mt-5">
                <Button type="submit" label="Создать" :loading="postStore.loading"></Button>
            </div>
        </form>
    </div>
	<div v-else class="flex justify-center mt-10">
		<p>Авторизуйтесь чтобы создавать посты.</p>
	</div>
</template>

<script>
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import {usePostStore} from '@/stores/postStore.js'
import { useToast } from 'primevue'
import { useAuthStore } from '@/stores/authStore.js'
export default {
	name: 'CreatePost',
	components: { InputText, Toast, Button},
	data(){
		return {
			postStore: usePostStore(),
			postText: "",
			postImage: "",
			postAudio: "",
			group_id: this.$route.params.id,
			toast: useToast(),
			authStore: useAuthStore(),
		}
	},
	computed:{
		errorMessage(){
			return this.postStore.error_message
		},
		errorCode(){
			return this.postStore.error_code
		},
		user_id(){
			return this.authStore.user.id
		}
	},
	methods:{
		changeImgCaption(event){
			const file = event.target.files[0]
			if (file){
				document.getElementById("img-label").innerHTML = '<span class="pi pi-upload mx-3"></span>' + file.name
				this.postImage = file
			} else {
				document.getElementById("img-label").innerHTML = '<span class="pi pi-upload mx-3"></span>Выбрать изображение'
				this.postImage = null
			}
		},
		changeAudioCaption(event){
			const file = event.target.files[0]
			if (file){
				document.getElementById("audio-label").innerHTML = '<span class="pi pi-upload mx-3"></span>' + file.name
				this.postAudio = file
			} else {
				document.getElementById("audio-label").innerHTML = '<span class="pi pi-upload mx-3"></span>Выбрать трек'
				this.postAudio = null
			}
		},
		async createPost(){
			const formData = new FormData()
			formData.append('user_id', this.user_id)
			formData.append('image', this.postImage)
			formData.append('audio', this.postAudio)
			formData.append('text', this.postText)
			formData.append('group_id', this.group_id)


			await this.postStore.create_post(formData)
			if(this.errorCode !== 201)
				this.$toast.add({severity:'error', summary: "Ошибка при создании поста", detail:this.errorMessage, life: 4000})
			else
				this.$toast.add({severity:'success', summary: "Пост успешно создан", detail:this.errorMessage, life: 4000})
		},
		notifyUser(){
			this.$toast.add({severity:'warn', summary: "Не все поля заполнены", detail: "Заполните все поля формы.", life: 4000})

		}
	}
}
</script>

<style scoped></style>
