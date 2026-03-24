import {createRouter , createWebHistory} from 'vue-router';

import Home from '@/components/Home.vue';
import Posts from '@/components/Posts.vue';
import Groups from '@/components/Groups.vue';

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
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
