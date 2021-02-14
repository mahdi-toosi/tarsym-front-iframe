import router from "../router";
import axios from "axios";
import NProgress from "nprogress";

export default {
    // !  read_this_doc
    async read_this_doc({ commit, dispatch }) {
        const _id = router.currentRoute.params._id;
        const doc = await dispatch("get_this_docs", _id);
        if (!doc) return;

        const decoded_docs = await dispatch("decode_the_docs", { docs: [doc] });

        commit("SET_DOCS_TO", {
            decoded_docs: decoded_docs || [doc],
            list: "readDoc",
            merge: true
        });

        dispatch("flyToThisDoc", decoded_docs ? decoded_docs[0] : doc);

        await dispatch("change_map_layers", null);

        // * get childs , if have any
        if (!doc.childs_id.length) return;
        const childs = await dispatch("get_this_docs", doc.childs_id);
        if (!childs) return;

        const decoded_childs = await dispatch("decode_the_docs", {
            docs: childs,
            deleteRoot: true
        });

        commit("SET_DOCS_TO", {
            decoded_docs: decoded_childs,
            list: "readDoc",
            merge: true
        });
    },
    // !  get_this_docs
    async get_this_docs({ dispatch }, doc_ids) {
        const is_doc_ids_array = Array.isArray(doc_ids),
            url = `/api/v1/iframe/${is_doc_ids_array ? "" : doc_ids}`,
            obj = { params: { "_id[$in]": doc_ids } },
            options = is_doc_ids_array ? obj : {};

        const docs = await axios
            .get(url, options)
            .then(res => res.data)
            .catch(error => {
                dispatch("handleAxiosError", error);
                return false;
            });
        return docs;
    },
    // ! decode_the_docs
    async decode_the_docs({ dispatch }, { docs, deleteRoot }) {
        const Docs = docs.data || docs;
        const newData = [];
        for (let index = 0; index < Docs.length; index++) {
            const doc = Docs[index];
            const junk = JSON.parse(doc.junk);
            delete doc.junk;
            const imgs = await dispatch("getAllDocImages", junk.description);
            const decoded_Doc = {
                ...doc,
                imgs,
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
