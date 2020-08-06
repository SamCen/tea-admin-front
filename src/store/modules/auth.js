import Vue from 'vue';
import * as types from '../mutations-type';
import api from '@/apis/index';

let JSON = global.JSON;

export default {
    state: {
        access_token: sessionStorage.getItem('access_token'),
        userInfo: JSON.parse(sessionStorage.getItem('userInfo')),
        loginFail: null,
    },
    getters: {
        menus: state => {
            return state.userInfo?(state.userInfo.menus?state.userInfo.menus:[]) : [];
        },
    },
    mutations: {
        SET_USER: (state, menus = null) => {
            Vue.set(state, 'userInfo', menus);
            if (menus) {
                sessionStorage.setItem('userInfo', JSON.stringify(menus));
            } else {
                sessionStorage.removeItem('userInfo');
            }
        },
        SET_TOKEN: (state, access_token = null) => {
            Vue.set(state, 'access_token', access_token);
            if (access_token) {
                sessionStorage.setItem('access_token', access_token);
            } else {
                sessionStorage.removeItem('access_token');
            }
        },
        SET_LOGIN_FAIL: (state, data = null) => {
            Vue.set(state, 'loginFail', data);
        },
    },
    actions: {

        login({commit}, params) {
            api.auth.login(params).then(response => {
                commit(types.SET_TOKEN, response.data.data.access_token);
            }).catch(errors => {
                commit(types.SET_LOGIN_FAIL, errors.response.data.msg);
            });
        },

        getInfo({commit}) {
            api.auth.getUserInfo().then(response => {
                commit(types.SET_USER, response.data.data);
            }).catch(errors => {
                commit(types.SET_LOGIN_FAIL, errors.response.data.msg);
            });
        },
        logout ({ commit }) {
            api.auth.logout().then(response => {
                commit(types.SET_TOKEN, null);
                commit(types.SET_USER, null);
            })
        }
    }
}
