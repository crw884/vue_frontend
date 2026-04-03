<template>
    <Menubar :model="items" class="m-2">
        <template #start>
            <span class="mr-5 ml-5">Soundclown</span>
        </template>
        <template #item="{ item, props, root }">
            <a class="flex items-center mr-6 p-4">
                <router-link v-if="item.route" :to="item.route">
                    <span :class="item.icon" />
                    <span class="ml-3" >{{ item.label }}</span>
                </router-link>
            </a>
        </template>
        <template #end>
            <div class="flex items-center gap-2">
                <div v-if="isAuthenticated && user">
                    <span class="pi pi-fw pi-user mr-4"/> {{user.name}}
                    <Button @click="logout" class="ml-4">Выйти</Button>
                </div>
                <div v-else>
                    <form @submit.prevent="login">
                        <InputText v-model="email" type="email" id="email" required placeholder="Логин"
						class="m-2 sm:w-auto" :class="{'p-invalid': authError}"/>
						<InputText v-model="password" type="password" id="password" required placeholder="Пароль"
								   class="m-2 sm:w-auto" :class="{'p-invalid': authError}"/>
						<Button type="submit">Войти</Button>
						<Message v-if="authError" severity="error"
								 icon="pi pi-exclamation-circle"
								 variant="outlined"
								 class="ml-2 "
								 :life="5000"
								 closable
								 >
							{{ authError }}
						</Message>
						<Message v-if="message" severity="info"
								 icon="pi pi-info-circle"
								 variant="outlined"
								 class="ml-2 "
								 :life="5000"
								 closable
								 >
							{{ message }}
						</Message>

                    </form>
                </div>
            </div>
        </template>
    </Menubar>
    <router-view> </router-view>
</template>
<script>
import { useAuthStore } from '@/stores/authStore.js';

import Button from "primevue/button";
import Menubar from "primevue/menubar";
import InputText from "primevue/inputtext";
import Message from 'primevue/message'

export default {
	components: {Button, Menubar, InputText, Message},
    data() {
        return {
            email: '',
            password: '',
            authStore: useAuthStore(),
            items: [
                {
                    label: 'Главная страница',
                    icon: 'pi pi-home pi-fw',
                    route: '/',
                    shortcut: 'Ctrl + H',
                    submenu: false,

                },
                {
                    label: 'Группы',
                    icon: 'pi pi-users pi-fw',
                    route: '/group',
                },
                {
                    label: 'Публикации',
                    icon: 'pi pi-warehouse pi-fw',
                    route: '/post',
                },
				{
					label: 'Пользователи',
					icon: 'pi pi-address-book pi-fw',
					route: '/users',
				}
            ],
        }
    },
    computed: {
        isAuthenticated() {
            return this.authStore.isAuthenticated
        },
        user() {
            return this.authStore.user
        },
        authError() {
            return this.authStore.errorMessage
        },
		message(){
			return this.authStore.message
		}
    },
    methods: {
        logout() {
            this.authStore.logout()
        },
        login() {
            this.authStore.login({ email: this.email, password: this.password })
        },
    },
    mounted() {
        const token = localStorage.getItem('token')
        if (token) {
            this.authStore.isAuthenticated = true
            this.authStore.getUser()
        }
    },
}
</script>
<style>
.error {
    color: red;
}
</style>
