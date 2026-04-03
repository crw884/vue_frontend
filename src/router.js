import {createRouter , createWebHistory} from 'vue-router';

import Home from '@/components/Home.vue';
import Posts from '@/components/Posts.vue';
import Groups from '@/components/Groups.vue';
import Users from '@/components/Users.vue'
import Group from '@/components/Group.vue'

const routes = [
    {
        path: '/',
        component: Home,

    },
    {
        path: '/group',
        component: Groups,

    },
    {
        path: '/post',
        component: Posts,

    },
    {
        path: '/users',
        component: Users,
    },
    {
        name: "Group",
        path: '/group:id',
        component: Group,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});



export default router;
