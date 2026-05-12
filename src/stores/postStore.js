import { defineStore } from 'pinia'
import axios from 'axios'
const backendUrl = import.meta.env.VITE_BACKEND_URL

export const usePostStore = defineStore('post', {
    state: () => ({
        posts: [],
        posts_total: null,
        error_message: "",
        error_code: 0,
        loading: false,
    }),
    actions: {
        async get_posts(page = 0, perpage = 5, group_id = -1) {
            this.error_message = ''
            try {
                const response = await axios.get(backendUrl + '/post', {
                    params: {
                        page: page,
                        perpage: perpage,
                        group_id: group_id,
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
        async get_posts_total(group_id = -1) {
            this.error_message = ''
            try {
                const response = await axios.get(backendUrl + '/posts_total', {
                    params: {
                            group_id: group_id
                        }
                    }
                )
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
        async create_post(formData) {
            if(this.loading) return
            this.loading = true
            this.error_message = ''
            try{
                const response = await axios.post(backendUrl + '/post', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
                })
                this.error_message = response.data.message
                this.error_code = response.data.code
            } catch (error) {
                if (error.response) {
                    this.error_code = 11
                    this.error_message = error.response.data.message
                    console.log(error)
                } else if (error.request) {
                    this.error_code = 12
                    this.error_message = error.message
                    console.log(error)
                } else{
                    this.error_code = 13
                    console.log(error)
                }
            } finally {
                this.loading = false
            }
        }
    },
})
