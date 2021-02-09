import store from "../store/";
import NProgress from "nprogress";

function beforeEach() {
    return async (to) => {
        if (to.path) {
            NProgress.start();
        }
    };
}
function afterEach() {
    return async (to) => {
        NProgress.done();
        const RN = to.name; // * route name
        console.log({ RN });
        if (RN === "read doc") {
            await store.dispatch("read_this_doc");

            if (store.state.docs.readDoc.length) store.commit("docs/UPDATE_DOC_INDEX");

            store.dispatch("change_map_layers");
            return;
        }
    };
}
export default {
    beforeEach,
    afterEach,
};
