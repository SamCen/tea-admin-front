import axios from 'axios';

export default {
    /**
     * 登录
     * @param params
     * @returns {AxiosPromise<any>}
     */
    login(params) {
        return axios.post('backend/auth/login', params);
    },

    /**
     * 获取菜单
     * @returns {AxiosPromise<any>}
     */
    getUserInfo() {
        return axios.get('backend/user/info ');
    },

    /**
     *  退出登录
     * @returns {AxiosPromise<any>}
     */
    logout(){
        return axios.post('backend/auth/logout');
    }
}
