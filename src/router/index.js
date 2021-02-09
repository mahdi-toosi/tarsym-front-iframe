import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Helpers from "./beforeAndAfterEachRoute";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "read doc",
        component: Home
    }
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
});

router.beforeEach(Helpers.beforeEach());
router.afterEach(Helpers.afterEach());

export default router;
