// import router from "../../router";

export default {
    namespaced: true,
    state: {
        zoom: 5,
        MouseCoordinate: null,
        center: ["32.879587173066305", "54.01105444025955"],
        layerIndex: 0,
        tileProviders: [
            {
                name: "اُپن استریت مپ",
                visible: true,
                url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            },
            {
                name: "توپولوژی",
                visible: false,
                url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            },
            {
                name: "هوایی",
                visible: false,
                url: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
            },
            {
                name: "گوگل مپ",
                visible: false,
                url: "https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}"
            },
            {
                name: "هوایی به همراه تیتر",
                visible: false,
                url: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
            },
            {
                name: "World Imagery",
                visible: false,
                url:
                    "http://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            },
            {
                name: "Positron",
                visible: false,
                url:
                    "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
            },
            {
                name: "Positron (No Labels)",
                visible: false,
                url:
                    "http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png"
            },
            {
                name: "Watercolor",
                visible: false,
                url: "http://tile.stamen.com/watercolor/{z}/{x}/{y}.png"
            }
        ]
    },
    mutations: {
        // UPDATE_ZOOM(state, zoom) {
        //     state.zoom = zoom;
        // },
        // UPDATE_CENTER(state, center) {
        //     state.center = center;
        // },
        UPDATE_LAYER(state, layerIndex) {
            state.layerIndex = layerIndex;
        },
        // UPDATE_MOUSE_COOR(state, { latlng }) {
        //     state.MouseCoordinate = latlng;
        // },
        SET_MAIN_LAYER(state) {
            state.tileProviders.forEach(
                tileProvider => (tileProvider.visible = false)
            );
            state.tileProviders[0].visible = true;
        },
        SET_THIS_LAYER(state, layer_index) {
            state.tileProviders.forEach((tileProvider, index) => {
                if (layer_index === index) tileProvider.visible = true;
                else tileProvider.visible = false;
            });
        }
    }
};
