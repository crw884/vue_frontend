import { defineStore } from 'pinia'
import axios from 'axios'
const backendUrl = import.meta.env.VITE_BACKEND_URL

export const useUserStore = defineStore('user', {
    state: () => ({
        users: [],
        users_total: null,
        error_message: ""
    }),
    actions: {
        async get_users(page = 0, perpage = 5){
            this.error_message = ''
            try {
                const response = await axios.get(backendUrl + '/users',{
                    params: {
                        page: page,
                        perpage: perpage,
                    }
                })
                this.users = response.data
                //console.log(response)
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
        },
        async get_users_total(){
            this.error_message = ''
            try {
                const response = await axios.get(backendUrl + '/users_total')
                this.users_total = response.data
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
