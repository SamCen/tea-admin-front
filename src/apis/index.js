import axios from 'axios';
import auth from '@/apis/modules/auth';
import category from '@/apis/modules/category';
import product from '@/apis/modules/product';
import user from '@/apis/modules/user';
import role from '@/apis/modules/role';
import privilege from '@/apis/modules/privilege';
import appUser from '@/apis/modules/appUser';
import store from '@/store';
import * as types from '../store/mutations-type';


axios.defaults.baseURL = process.env.VUE_APP_URL;

axios.interceptors.request.use(config => {
    const access_token = store.state.auth.access_token;
    if (access_token) {
        config.headers.Accept = 'application/json';
        config.headers.Authorization = `Bearer ${access_token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

axios.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response) {
        if (error.response.config.url === axios.defaults.baseURL+'/backend/auth/login') {
            return Promise.reject(error);
        }
        switch (error.response.status) {
            case 401:
                /**
                 * 返回 401 清除token信息并跳转到登录页面
                 */
                store.commit(types.SET_USER);
                store.commit(types.SET_TOKEN);
                this.$router.replace({
                    path: '/login',
                });
                break;
            default:
                return Promise.reject(error);
        }
    }
});
/**
 * 导出API
 */
export default {
    auth,
    user,
    role,
    privilege,
    product,
    category,
    appUser,
}
