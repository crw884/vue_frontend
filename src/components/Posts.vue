<template >
    <div v-if="posts_total === 0" class="flex flex-col items-center justify-center mt-10">
        <span>Публикации не найдены.</span>
    </div>
    <div
        v-if="posts_total > 0"
        class="posts-container flex flex-col items-center justify-center mt-10"
    >
        <div class="flex flex-col items-center justify-center w-6/12 h-auto" v-for="post in posts" :key="post.id">
            <div class="flex gap-7 w-full" >
                <Image
					v-if="post.image"
                    :src="post.image"
                    alt="pi pi-loading"
                    class="w-80  overflow-hidden aspect-square rounded-xl"
                    image-class="w-full h-full object-cover"
                    preview
                />
				<div class="flex flex-col justify-between w-full">
					<div class="flex flex-col items-end w-full gap-4 mb-5">
						<div class="flex flex-row w-full justify-between">
							<div>Группа: {{ post.group_name }}</div>
							<div>Автор: {{ post.user_name }}</div>
						</div>

						<div>{{ this.formatText(post.text) }}</div>

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
</template>

<script>
import DeferredContent from 'primevue/deferredcontent'
import ProgressSpinner from 'primevue/progressspinner'
import Divider from 'primevue/divider'
import { usePostStore } from '@/stores/postStore.js'
import Image from 'primevue/image'

export default {
    name: 'Posts',
    components: {  Image, DeferredContent, ProgressSpinner, Divider },

    data() {
        return {
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
        this.postStore.get_posts(this.page, this.perpage)
        this.postStore.get_posts_total()
        // this.onPostLoad()
    },
    methods: {
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

<style scoped></style>
