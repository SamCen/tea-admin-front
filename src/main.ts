import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import './plugins/element.js';
import './assets/iconfont/iconfont.css';
import { sync } from 'vuex-router-sync';
sync(store, router);
Vue.config.productionTip = false;
new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app');