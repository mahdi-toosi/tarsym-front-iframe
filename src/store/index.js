import Vue from "vue";
import Vuex from "vuex";
import map from "./map";
import getters from "./getters";

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
        }
    },
    mutations: {
        SET_DOCS_TO(state, { decoded_docs, list, merge }) {
            if (!merge) {
                state[list] = decoded_docs;
                return;
            }
            state[list] = state[list].concat(decoded_docs);
        }
    },
    getters,
    actions: {},
    modules: { map }
});
