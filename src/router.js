import {createRouter , createWebHistory} from 'vue-router';

import Home from '@/components/Home.vue';
import Posts from '@/components/Posts.vue';
import Groups from '@/components/Groups.vue';
import Users from '@/components/Users.vue'
import Group from '@/components/Group.vue'
import CreatePost from '@/components/CreatePost.vue'
import CreateGroup from '@/components/CreateGroup.vue'

const routes = [
    {
        path: '/',
        component: Posts,

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
    {
        name: "PostCreate",
        path: '/group:id/create',
        component: CreatePost,
    },
    {
        name: "GroupCreate",
        path: '/group/create:id?',
        component: CreateGroup,
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// router.beforeEach((to, from, next) => {
//     document.title = to.meta.title || "Soundclown";
//     next();
// });



export default router;
