import { createRouter, createMemoryHistory, RouteRecordRaw, createWebHashHistory } from "vue-router"

import index from "../views/index/index.vue"
import panoramic from "../views/panoramic/panoramic.vue"

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'index',
        component: index
    },
    {
        path: '/panoramic',
        name: 'panoramic',
        component: panoramic
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router