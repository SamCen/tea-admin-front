import axios from 'axios';

export default {
    /**
     * 角色列表
     * @param params
     * @returns {AxiosPromise<any>}
     */
    index(params){
        return axios.get('backend/role',{
            params:params,
        });
    },

    /**
     * 添加角色
     * @param params
     * @returns {AxiosPromise<any>}
     */
    create(params){
        return axios.post('backend/role',params);
    },

    /**
     * 角色详情
     * @param id
     * @returns {AxiosPromise<any>}
     */
    show(id){
        return axios.get(`backend/role/${id}`)
    },

    /**
     * 更新角色权限
     * @param id
     * @param renew
     * @returns {AxiosPromise<any>}
     */
    updatePri(id,renew){
        return axios.put(`backend/updatePri/${id}`,{renew})
    },

    /**
     * 更新角色基础信息
     * @param id
     * @param params
     * @returns {AxiosPromise<any>}
     */
    update(id, params) {
        return axios.put(`backend/role/${id}`,params)
    },

    delete(id){
        return axios.delete(`backend/role/${id}`);
    }
}
