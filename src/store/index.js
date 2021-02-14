import Vue from "vue";
import Vuex from "vuex";
import map from "./map";
import getters from "./getters";
import actions from "./actions";
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        readDoc: [],
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
        SET_DOCS_TO(state, { decoded_docs, list, merge }) {
            if (!merge) {
                state[list] = decoded_docs;
                return;
            }
            state[list] = state[list].concat(decoded_docs);
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
