import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// * NProgress
import NProgress from "nprogress";
import "nprogress/nprogress.css";

import axios from "axios";
axios.defaults.baseURL = process.env.VUE_APP_DOMAIN;
axios.interceptors.request.use(config => {
    NProgress.start();
    return config;
});
axios.interceptors.response.use(
    response => {
        NProgress.done();
        return response;
    },
    error => {
        NProgress.done();
        return Promise.reject(error);
    }
);

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
