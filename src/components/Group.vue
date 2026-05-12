<template>
    <div class="flex row justify-center w-11/12 gap-10">
        <div class="w-1/12"></div>
        <div class="w-7/12" >
			<div v-if="posts_total === 0" class="flex flex-col items-center justify-center mt-10">
				<span>В этой группе нет публикаций.</span>
			</div>
			<div
				v-if="posts_total > 0"
				class="posts-container flex flex-col items-center justify-center mt-10"
			>
				<div class="flex flex-col items-center justify-center w-12/12 h-auto" v-for="post in posts" :key="post.id">
					<div class="flex gap-7 w-full" >
						<Image
							v-if="post.image"
							:src="post.image"
							alt="img"
							class="w-80 overflow-hidden aspect-square rounded-xl"
							image-class="w-full h-full object-cover"
							preview
						/>
						<div class="flex flex-col justify-between w-full">
							<div class="flex flex-col items-end w-full gap-4 mb-5">
								<div class="flex flex-row w-full justify-end">

									<div>Автор: {{ post.user_name }}</div>
								</div>

								<div class="break-all">{{ this.formatText(post.text) }}</div>

							</div>
							<audio v-if="post.audio" controls :src="post.audio"
								   class="w-full rounded-2xl bg-mist-950"/>
						</div>

					</div>
					<Divider />
				</div>

				<div v-if="isLoading" class="flex flex-row items-center justify-center gap-4">
					<ProgressSpinner stroke-width="4" style="width: 40px; height: 40px" />
					<span>Загрузка постов...</span>
				</div>

				<DeferredContent v-if="hasMore && posts.length !== 0 && !isLoading" @load="onPostLoad" class="mt-2 mb-5">
					<div>o_o</div>
				</DeferredContent>

				<div v-if="!hasMore" class="mb-10">
					<p>Вы просмотрели все посты.</p>
				</div>
			</div>
        </div>
        <div class="w-3/12">
            <div class="flex flex-col gap-3 bg-blend-color rounded-xl bg-neutral-900 p-6" >
				<div class="flex flex-row justify-between">
					<div class="flex flex-col gap-3">
						<div class="font-bold"> Группа {{ name }} </div>
						<div class=""> Админ: {{ adminName }} </div>
						<div class="break-all">
							{{ description }}
						</div>
					</div>
					<div >
						<Image v-if="this.image"
							   :src="this.image"
							   alt="img"
							   class="w-30  overflow-hidden aspect-square rounded-xl"
							   image-class="w-full h-full object-cover"
							   preview/>
					</div>
				</div>

                <div >
                    <div class="flex flex-row justify-between gap-5">
						<div v-if="this.authStore.user && this.authStore.user.id === this.admin_id" class="w-1/2">
						<router-link :to="{name: 'PostCreate', params: {id: this.id}}"  class="w-full" >
                        	<Button class="w-full" label="Добавить пост" ></Button>
						</router-link>
						</div>
						<form @submit.prevent="unsubscribe" v-if="is_user_sub" class="w-1/2">
							<Button class="w-full" label="Отписаться" severity="danger" type="submit"></Button>
						</form>
						<form @submit.prevent="subscribe" class="w-1/2" v-else>
							<Button class="w-full" label="Подписаться" severity="success" type="submit"></Button>
						</form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useToast } from 'primevue'

const backendUrl = import.meta.env.VITE_BACKEND_URL
import Card from 'primevue/card'
import Button from 'primevue/button'
import Image from 'primevue/image'
import axios from 'axios'
import { usePostStore } from '@/stores/postStore.js'
import ProgressSpinner from 'primevue/progressspinner'
import DeferredContent from 'primevue/deferredcontent'
import Divider from 'primevue/divider'
import Toast from 'primevue/toast'
import { useAuthStore } from '@/stores/authStore.js'
export default {
    name: 'Group',
    components: { Card, Button, Image, ProgressSpinner, DeferredContent, Divider, Toast },
    data() {
        return {
			authStore: useAuthStore(),
			postStore: usePostStore(),
            name: '',
            adminName: '',
			admin_id: -1,
            description: '',
            id: this.$route.params.id,
            perpage: 4,
            page: 0,
            isLoading: false,
			error_message: '',
			subscribers: [],
			toast: useToast(),
			image: ''
        }
    },
    computed: {
        posts() {
            return this.postStore.posts
        },
        posts_total() {
            return this.postStore.posts_total
        },
		hasMore(){
			return this.posts.length < this.posts_total
		},
		is_user_sub(){
			if(this.authStore.user == null) return false
			return this.subscribers.includes(this.authStore.user.id)
		}
    },
    mounted() {
        this.getGroup()
		this.postStore.get_posts(this.page, this.perpage, this.id)
		this.postStore.get_posts_total(this.id)
		this.get_subscribers()
    },
    methods: {
        async getGroup() {
			this.loading = true
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL
                const response = await axios.get(backendUrl + '/group/' + this.id)
                this.name = response.data.name
                this.adminName = response.data.admin
                this.description = response.data.description
				this.admin_id = response.data.admin_id
				this.image = response.data.image
				console.log(this.image)
            } catch (error) {
                console.log(error)
            } finally {
				this.loading = false
			}
        },
		async get_subscribers() {
			try {
				const backendUrl = import.meta.env.VITE_BACKEND_URL
				const response = await axios.get(backendUrl + '/group/' + this.id+'/subscribers', {
					params: {
						user_id: this.authStore.user ? this.authStore.user.id : null,
						group_id: this.id,
					}
				})
				this.subscribers = response.data
				console.log(this.subscribers)
			} catch (error) {
				console.log(error)
			} finally {

			}
		},
		formatText(text) {
			if(!text) return ''
			if(text.length > 80)
				return text.substring(0, 80) + "..."
			else
				return text
		},
		async onPostLoad() {
			if (!this.hasMore || this.isLoading) return

			this.isLoading = true
			this.page += 1

			try {
				await this.postStore.get_posts(this.page, this.perpage, this.id)
			} catch (error) {
				console.error(error)
			} finally {
				this.isLoading = false
			}
		},
		async unsubscribe() {
			try{
				const response = await axios.get(backendUrl+'/group'+this.id+'/unsubscribe', {
					headers: {
						Authorization: 'Bearer ' + this.authStore.token,
					},
					params: {
						group_id: this.id,
						user_id: this.authStore.user ? this.authStore.user.id : null,
					}
				})
				if(response.status === 200){
					await this.get_subscribers()
					this.$toast.add({
						severity: 'success',
						summary: 'Успех',
						detail: 'Вы отписались от группы ' + this.name,
						life: 4000,
					})
				}
			} catch (error) {
				if(error.response){
					this.error_message = error.response.data.message
					console.log(error)
				} else if(error.request){
					this.error_message = error.message
					console.log(error)
				} else {
					console.log(error)
				}
				this.$toast.add({
					severity: 'error',
					summary: 'Ошибка',
					detail: error.response.data.message,
					life: 4000,
				})
			}
		},
		async subscribe() {
			try{
				const response = await axios.get(backendUrl+'/group'+this.id+'/subscribe', {
					headers: {
						Authorization: 'Bearer ' + this.authStore.token,
					},
					params: {
						group_id: this.id,
						user_id: this.authStore.user ? this.authStore.user.id : null,
					}
				})
				if(response.status === 200){
					await this.get_subscribers()
					this.$toast.add({
						severity: 'success',
						summary: 'Успех',
						detail: 'Вы подписались на группу ' + this.name,
						life: 4000,
					})
				}
			} catch (error) {
				if(error.response){
					this.error_message = error.response.data.message
					console.log(error)
				} else if(error.request){
					this.error_message = error.message
					console.log(error)
				} else {
					console.log(error)
				}
				this.$toast.add({
					severity: 'error',
					summary: 'Ошибка',
					detail: error.response.data.message,
					life: 4000,
				})
			}
		}
    },
}
</script>

<style scoped>


</style>
