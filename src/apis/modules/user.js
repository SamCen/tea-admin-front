import axios from 'axios';

export default {
    /**
     * 用户列表
     * @param params
     * @returns {AxiosPromise<any>}
     */
    index(params){
        return axios.get('backend/user',{
            params:params,
        });
    },

    /**
     * 用户详情
     * @param id
     * @returns {AxiosPromise<any>}
     */
    show(id){
        return axios.get(`backend/user/${id}`)
    },

    /**
     * 修改用户基本信息
     * @param id
     * @param params
     * @returns {AxiosPromise<any>}
     */
    update(id,params){
        return axios.put(`backend/user/${id}`,params);
    },

    /**
     * 修改用户关联角色
     * @param id
     * @param roles
     * @returns {AxiosPromise<any>}
     */
    updateRole(id,roles){
        return axios.put(`backend/user/updateRole/${id}`,{roles:roles});
    },

    /**
     * 添加用户
     * @param params
     * @returns {AxiosPromise<any>}
     */
    create(params){
        return axios.post('backend/user', params)
    }
}
