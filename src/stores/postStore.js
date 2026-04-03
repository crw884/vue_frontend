import { defineStore } from 'pinia'
import axios from 'axios'
const backendUrl = import.meta.env.VITE_BACKEND_URL

export const usePostStore = defineStore('post', {
    state: () => ({
        posts: [],
        posts_total: null,
        error_message: '',
    }),
    actions: {
        async get_posts(page = 0, perpage = 5) {
            this.error_message = ''
            try {
                const response = await axios.get(backendUrl + '/post', {
                    params: {
                        page: page,
                        perpage: perpage,
                    },
                })
                if (page === 0) this.posts = response.data
                else this.posts.push(...response.data)
                console.log(response.data)
            } catch (error) {
                if (error.response) {
                    this.error_message = error.response.data.message
                    console.log(error)
                } else if (error.request) {
                    this.error_message = error.message
                    console.log(error)
                } else {
                    console.log(error)
                }
            }
        },
        async get_posts_total() {
            this.error_message = ''
            try {
                const response = await axios.get(backendUrl + '/posts_total')
                this.posts_total = response.data
            } catch (error) {
                if (error.response) {
                    this.error_message = error.response.data.message
                    console.log(error)
                } else if (error.request) {
                    this.error_message = error.message
                    console.log(error)
                } else {
                    console.log(error)
                }
            }
        },
    },
})
