import Vue from "vue";
import store from "../store/";
import NProgress from "nprogress";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
    {
        path: "/doc/:_id",
        name: "read doc",
        component: Home
    },
    {
        path: "*",
        name: "404 page",
        component: () => import("@/views/404.vue")
    }
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
});

router.beforeEach((to, from, next) => {
    if (to.path) {
        NProgress.start();
    }
    next();
});

router.afterEach(async to => {
    NProgress.done();
    if (to.name === "read doc") {
        await store.commit("CLEAR_ERROR");
        await store.dispatch("read_this_doc");

        if (store.state.readDoc.length) await store.commit("UPDATE_DOC_INDEX");

        await store.dispatch("change_map_layers");
        return;
    }
});

export default router;
