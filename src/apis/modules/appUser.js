import axios from 'axios';

export default {
    /**
     * 用户列表
     * @param params
     * @returns {AxiosPromise<any>}
     */
    index(params){
        return axios.get('backend/appUser',{
            params:params,
        });
    },

    /**
     * 用户详情
     * @param id
     * @returns {AxiosPromise<any>}
     */
    show(id){
        return axios.get(`backend/appUser/${id}`)
    },

    /**
     * 修改用户基本信息
     * @param id
     * @param params
     * @returns {AxiosPromise<any>}
     */
    update(id,params){
        return axios.put(`backend/appUser/${id}`,params);
    },


    /**
     * 添加用户
     * @param params
     * @returns {AxiosPromise<any>}
     */
    create(params){
        return axios.post('backend/appUser', params)
    },

    roleList(){
        return axios.get('backend/appUserRoleList')
    }
}
