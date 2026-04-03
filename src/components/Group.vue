<template>
    <div class="flex row justify-center w-11/12 gap-10">
        <div class="w-1/12"></div>
        <div class="w-7/12" >

        </div>
        <div class="w-3/12">
            <Card>
                <template #title> Группа {{ name }} </template>
                <template #subtitle> Админ: {{ adminName }} </template>
                <template #content>
                    {{ description }}
                </template>
                <template #footer>
                    <div class="flex flex-row justify-between gap-5">
                        <Button class="w-1/2" label="Добавить пост"></Button>
                        <Button class="w-1/2" label="Удалить группу" severity="danger"></Button>
                    </div>
                </template>
            </Card>
        </div>
    </div>
</template>

<script>
import Card from 'primevue/card'
import Button from 'primevue/button'
import Image from 'primevue/image'
import axios from 'axios'
import { usePostStore } from '@/stores/postStore.js'
import ProgressSpinner from 'primevue/progressspinner'
import DeferredContent from 'primevue/deferredcontent'
import Divider from 'primevue/divider'
export default {
    name: 'Group',
    components: { Card, Button, Image, ProgressSpinner, DeferredContent, Divider },
    data() {
        return {
            name: '',
            adminName: '',
            description: '',
            id: this.$route.params.id,
            postStore: usePostStore(),
            perpage: 2,
            page: 0,
            isLoading: false,
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
		}
    },
    mounted() {
        this.getGroup()
		this.postStore.get_posts_total()
		this.postStore.get_posts(this.page, this.perpage)
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
            } catch (error) {
                console.log(error)
            } finally {
				this.loading = false
			}
        },
        async onPostLoad() {
            if (!this.hasMore || this.isLoading) return

            this.isLoading = true
            this.page += 1

            try {
                await this.postStore.get_posts(this.page, this.perpage)
            } catch (error) {
                console.error(error)
            } finally {
                this.isLoading = false
            }
        },
        formatDate(date) {
            if (!date) return ''
            return date.substring(0, 10)
        },
		formatText(text) {
			if(!text) return ''
			return text.substring(0, 80) + "..."
		}
    },
}
</script>

<style scoped>


</style>
