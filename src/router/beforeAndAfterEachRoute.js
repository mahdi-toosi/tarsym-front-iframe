import store from "../store/";
import NProgress from "nprogress";

function beforeEach() {
    return async (to, from, next) => {
        if (to.path) {
            NProgress.start();
        }
        next();
    };
}
function afterEach() {
    return async to => {
        NProgress.done();
        if (to.name === "read doc") {
            await store.commit("CLEAR_ERROR");
            await store.dispatch("read_this_doc");

            if (store.state.readDoc.length)
                store.commit("docs/UPDATE_DOC_INDEX");

            store.dispatch("change_map_layers");
            return;
        }
    };
}
export default {
    beforeEach,
    afterEach
};
