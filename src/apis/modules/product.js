import axios from 'axios';

export default {
    /**
     * 产品列表
     * @param params
     * @returns {AxiosPromise<any>}
     */
    index(params){
        return axios.get('backend/product',{
            params:params,
        });
    },

    /**
     * 产品详情
     * @param id
     * @returns {AxiosPromise<any>}
     */
    show(id){
        return axios.get(`backend/product/${id}`)
    },

    /**
     * 修改产品
     * @param id
     * @param params
     * @returns {AxiosPromise<any>}
     */
    update(id,params){
        return axios.put(`backend/product/${id}`,params);
    },


    /**
     * 添加产品
     * @param params
     * @returns {AxiosPromise<any>}
     */
    create(params){
        return axios.post('backend/product', params)
    },

    unitList(){
        return axios.get('backend/product-unit')
    }
}
