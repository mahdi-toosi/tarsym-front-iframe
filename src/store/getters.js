import router from "../router";

export default {
    docs_list: state => {
        const routeName = router.currentRoute.name;
        if (routeName === "read doc") return state.readDoc || [];
        else return [];
    },
    DocWithChildsTools: (state, getters) => {
        const routeName = router.currentRoute.name;
        let tools = [];

        if (routeName === "read doc") {
            const docLayer = getters.DocLayer;
            let docTools = docLayer.tools;
            docTools.forEach(tool => (tool._id = docLayer._id));
            tools = tools.concat(docTools);

            if (!docLayer.childs_id.length) return tools;
            // * add childs tools to map
            getters.DocChilds(getters.DocLayer).forEach(child => {
                // child.tools.forEach((tool) => (tool._id = child._id));
                // tools = tools.concat(child.tools);
                // * just add first Tool of Child
                const firstTool = child.tools[0];
                firstTool._id = child._id;
                tools = tools.concat(firstTool);
            });
        }
        return tools;
    },
    DocChilds: (state, getters) => doc => {
        if (!doc) return [];
        const childs_ID = doc.childs_id || [];
        let All_childs = [];
        childs_ID.forEach(child_id => {
            const childs = getters.docs_list.filter(doc => {
                if (!doc) return false;
                return doc._id == child_id;
            });
            All_childs = All_childs.concat(childs);
        });
        return All_childs;
    },
    tooltipData: (state, getters) => index =>
        getters.DocLayer.tools[index].tooltip,
    DocLayer: (state, getters) => getters.docs_list[state.DocProp.index]
};
