import axios from 'axios';

export default {
    /**
     * 分类列表
     * @param params
     * @returns {*}
     */
    index(params){
        return axios.get('backend/category',{
            params:params,
        });
    },

    /**
     * 分类详情
     * @param id
     * @returns {*}
     */
    show(id){
        return axios.get(`backend/category/${id}`)
    },

    /**
     * 修改产品
     * @param id
     * @param params
     * @returns {IDBRequest<IDBValidKey> | Promise<void>}
     */
    update(id,params){
        return axios.put(`backend/category/${id}`,params);
    },


    /**
     * 添加产品分类
     * @param params
     * @returns {AxiosPromise<any>}
     */
    create(params){
        return axios.post('backend/category', params)
    },

    allList(){
        return axios.get('backend/category-list')
    }

}
