import Vue from 'vue';
import Router from 'vue-router';
import store from './store';
import RouterGenerator from '@/utils/generateRouter';


Vue.use(Router);

let dynamic = [];

// @ts-ignore
let menus = store.state["auth"].userInfo ? store.state["auth"].userInfo.menus : [];

RouterGenerator(dynamic, menus);
const router =  new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'index',
            beforeEnter: (to, from, next) => {
                /**
                 * 验证用户是否登录
                 */
                // @ts-ignore
                if (store.state["auth"].access_token) {
                    next();
                } else {
                    router.replace({
                        path: '/login',
                    });
                }
            },
            component: () => import(/* webpackChunkName: "index" */ '@/components/Main.vue'),
            children: [
                ...dynamic,
            ],
        },
        {
            path: '/login',
            beforeEnter: (to, from, next) => {
                /**
                 * 验证用户是否登录
                 */
                // @ts-ignore
                if (store.state["auth"].access_token) {
                    router.replace({
                        path: '/home',
                    });
                } else {
                    next();
                }
            },
            name: 'login',
            component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue'),
        },
        {
            path: '*',
            name: 'NotFound',
            component: () => import(/* webpackChunkName: "NotFound" */ '@/views/tips/NotFound.vue'),
        },
    ],
});
export default router;
