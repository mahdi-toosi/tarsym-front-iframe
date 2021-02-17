import Vue from "vue";
import Vuex from "vuex";
import map from "./map";
import getters from "./getters";
import actions from "./actions";
import router from "../router";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        readDoc: [],
        fetched_ids: [],
        DocProp: {
            index: 0,
            _id: 0,
            invisibleDocs: [],
            OnTool: {
                condition: false,
                index: -1
            }
        },
        error: null
    },
    mutations: {
        SET_DOCS(state, { decoded_docs }) {
            decoded_docs.forEach(doc => {
                if (doc.alreadyFetched) return;
                state.readDoc.push(doc);
            });
        },
        UPDATE_DOC_INDEX(state) {
            const route = router.currentRoute;
            const Docs = state.readDoc;
            const doc_id = route.params._id;
            const index = Docs.findIndex(obj => obj._id == doc_id);

            state.DocProp.index = index;
            state.DocProp._id = Docs[index]._id;
        },
        CLEAR_ERROR(state) {
            state.error = null;
        },
        SET_ERROR(state, msg) {
            state.error = msg || "مشکلی در بارگزاری دیتا بوجود آمده ...";
        }
    },
    getters,
    actions,
    modules: { map }
});
