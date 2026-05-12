import { defineStore } from 'pinia'
import axios from 'axios'
const backendUrl = import.meta.env.VITE_BACKEND_URL
export const useGroupStore = defineStore('group', {
    state: () => ({
        groups: [],
        groups_total: null,
        error_message: "",
        error_code: 0,
        loading: false,
    }),
    actions: {
        async get_groups(page = 0, perpage = 5, search = "") {
            if(this.loading) return
            this.loading = true
            this.error_message = ''
            try {
                const response = await axios.get(backendUrl + '/group',{
                    params: {
                        page: page,
                        perpage: perpage,
                        search: search,
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
        async get_groups_total(search = "") {
            this.error_message = ''
            try {
                const response = await axios.get(backendUrl + '/groups_total', {
                    params: {
                        search: search,
                    }
                })
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
        },
        async create_group(formData) {
            if(this.loading) return
            this.loading = true
            this.error_message = ''
            try{
                const response = await axios.post(backendUrl + '/group', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
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
        },
        async edit_group(formData, id) {
            if(this.loading) return
            this.loading = true
            this.error_message = ''
            try{
                const response = await axios.post(backendUrl + '/group/' + id, formData,{
                    headers:{
                        'Content-Type': 'multipart/form-data',
                        Authorization: 'Bearer ' + localStorage.getItem('token')
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
        },
        async delete_group(id) {
            if(this.loading) return
            this.loading = true
            this.error_message = ''
            try{
                const response = await axios.delete(backendUrl + '/group/' + id,{
                    headers:{
                        'Content-Type': 'multipart/form-data',
                        Authorization: 'Bearer ' + localStorage.getItem('token')
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
