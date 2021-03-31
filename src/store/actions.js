import router from "../router";
import axios from "axios";
import NProgress from "nprogress";

export default {
    // !  read_this_doc
    async read_this_doc({ commit, dispatch }) {
        const _id = router.currentRoute.params._id;
        if (!_id) {
            commit("SET_ERROR", "مسیر درخواستی معتبر نمیباشد ...");
            return;
        }

        const doc = await dispatch("get_this_docs", [_id]);

        if (!doc || !doc.length) return;
        const decoded_docs = await dispatch("decode_the_docs", {
            docs: doc
        });
        commit("SET_DOCS", {
            decoded_docs: decoded_docs || doc
        });

        dispatch("flyToThisDoc", decoded_docs ? decoded_docs[0] : doc);

        await dispatch("change_map_layers", null);

        // * get childs , if have any
        if (!doc[0].childs_id.length) return;
        await dispatch("get_children", doc[0].childs_id);
    },
    async get_children({ dispatch, commit }, childs_id) {
        const childs = await dispatch("get_this_docs", childs_id);
        if (!childs) return;
        const decoded_childs = await dispatch("decode_the_docs", {
            docs: childs,
            deleteRoot: true
        });

        commit("SET_DOCS", {
            decoded_docs: decoded_childs
        });
    },
    // !  get_this_docs
    async get_this_docs({ state, dispatch }, _ids) {
        let docs = [],
            fetchThisIds = [];
        _ids.forEach(id => {
            const doc = state.readDoc.find(doc => doc._id === id);
            if (doc) {
                doc.alreadyFetched = true;
                docs.push(doc);
            } else {
                fetchThisIds.push(id);
            }
        });
        if (fetchThisIds.length) {
            await axios
                .post("/api/v1/iframe", { ids: fetchThisIds })
                .then(({ data }) => {
                    if (Array.isArray(data)) docs = [...docs, ...data];
                    else docs.push(data);
                })
                .catch(error => {
                    dispatch("handleAxiosError", error);
                });
        }
        return docs;
    },
    // ! decode_the_docs
    async decode_the_docs(ctx, { docs, deleteRoot }) {
        console.log("decode_the_docs");
        const newData = [];
        for (let index = 0; index < docs.length; index++) {
            const doc = docs[index];
            if (doc.alreadyFetched) {
                newData.push(doc);
                continue;
            }
            const junk = JSON.parse(doc.junk);
            delete doc.junk;
            const decoded_Doc = {
                ...doc,
                ...junk
            };
            // decoded_Doc.date = decoded_Doc.date - 2000000;
            if (deleteRoot && decoded_Doc.root) delete decoded_Doc.root;
            newData.push(decoded_Doc);
        }
        return newData;
    },
    // ! flyToThisDoc
    flyToThisDoc(ctx, doc) {
        document.dispatchEvent(
            new CustomEvent("showThisDoc", {
                detail: doc
            })
        );
    },
    change_map_layers({ commit, state }, mainMap) {
        if (mainMap) {
            commit("map/SET_MAIN_LAYER");
            return;
        }
        const docs = state.readDoc;
        const doc = docs[state.DocProp.index];
        if (!doc) return;

        commit("map/SET_THIS_LAYER", doc.map_animate.layerIndex);
    },
    // !  handleAxiosError
    handleAxiosError({ commit }, error) {
        NProgress.done();
        console.log(error);
        let msg;
        if (error == "Error: Network Error") {
            msg = "مشکل در برقراری ارتباط با سرور ...";
            commit("SET_ERROR", msg);
            return;
        }
        if (error.response) {
            const { status } = error.response;
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            if (status >= 500) msg = "مشکل در برقراری ارتباط با سرور";
            else if (status == 400) msg = "درخواست شما معتبر نمیباشد";
            else if (status == 404) msg = "دیتای درخواستی پیدا نشد ...";
            else if (status == 401) {
                msg = "شما دسترسی لازم را ندارید ...";
            } else {
                msg = "response get error , check the console";
                console.log("response get error => ", error);
            }
            commit("SET_ERROR", msg);
        } else if (error.request) {
            console.log("request get error => ", error);
            commit("SET_ERROR", "request get error , check the console");
        } else {
            console.log("Error", error);
            commit("SET_ERROR", "check the console");
        }
    }
};
