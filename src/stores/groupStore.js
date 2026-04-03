import { defineStore } from 'pinia'
import axios from 'axios'
const backendUrl = import.meta.env.VITE_BACKEND_URL
export const useGroupStore = defineStore('group', {
    state: () => ({
        groups: [],
        groups_total: null,
        error_message: "",
        loading: false,
    }),
    actions: {
        async get_groups(page = 0, perpage = 5){
            if(this.loading) return
            this.loading = true
            this.error_message = ''
            try {
                const response = await axios.get(backendUrl + '/group',{
                    params: {
                        page: page,
                        perpage: perpage,
                    }
                })
                this.loading = false
                this.groups = response.data
                console.log(response.data)
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
            } finally {
                this.loading = false
            }
        },
        async get_groups_total(){
            this.error_message = ''
            try {
                const response = await axios.get(backendUrl + '/groups_total')
                this.groups_total = response.data
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
            }
        }
    },
})
