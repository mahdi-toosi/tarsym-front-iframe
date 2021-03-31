<template>
    <div>
        <LMap
            :icon="defaultIcon"
            class="map"
            :options="{ zoomControl: false }"
            :minZoom="4"
            ref="LeafletMap"
        >
            <LTileLayer
                v-for="tileProvider in map.tileProviders"
                :key="tileProvider.name"
                :name="tileProvider.name"
                :visible="tileProvider.visible"
                :url="tileProvider.url"
                attribution="<a class='attr' href='https://tarsym.com'><strong>TARSYM.COM</strong></a>"
                layer-type="base"
            />

            <div v-if="docs_list.length">
                <div v-for="(tool, index) in DocWithChildsTools" :key="index">
                    <div v-if="tool.type === 'Polygon'">
                        <LPolygon
                            :fillOpacity="0.4"
                            :fillColor="
                                tool.secondaryColor.hex8 || tool.secondaryColor
                            "
                            :color="tool.color.hex8 || tool.color"
                            :lat-lngs="tool.coordinates"
                            @dblclick="goToThisDoc(tool._id)"
                            :visible="tool.visible"
                        >
                            <LTooltip v-if="tool.tooltip">
                                <p>{{ tool.tooltip.text }}</p>
                                <img
                                    v-if="tool.tooltip.image"
                                    :src="tool.tooltip.image"
                                />
                            </LTooltip>
                        </LPolygon>
                    </div>
                    <!-- end Polygon -->
                    <div v-if="tool.type === 'Polyline'">
                        <LPolyline
                            :lat-lngs="tool.coordinates"
                            :color="tool.color.hex8 || tool.color"
                            :dashArray="tool.dashed ? '10,10' : ''"
                            @dblclick="goToThisDoc(tool._id)"
                            :visible="tool.visible"
                        >
                            <LTooltip v-if="tool.tooltip">
                                <p>{{ tool.tooltip.text }}</p>
                                <img
                                    v-if="tool.tooltip.image"
                                    :src="tool.tooltip.image"
                                />
                            </LTooltip>
                        </LPolyline>
                        <PolylineDecorator
                            @dblclick="goToThisDoc(tool._id)"
                            :lat-lngs="tool.coordinates"
                            :icon-size="tool.iconSize"
                            :icon-name="tool.iconName"
                            :icon-color="
                                tool.secondaryColor.hex8 || tool.secondaryColor
                            "
                            :icon-rotate="tool.angle"
                            :icon-repeat="tool.iconRepeat"
                            :arrow-color="tool.color.hex8 || tool.color"
                            :show-icon="tool.showIcon"
                            :show-arrow="tool.showArrow"
                            v-if="tool.visible"
                        />
                    </div>
                    <!-- end Polyline -->
                    <div
                        v-if="
                            tool.type === 'Point' && tool.coordinates[1] != '0'
                        "
                    >
                        <LMarker
                            :lat-lng="tool.coordinates"
                            :icon="defaultIcon"
                            @dblclick="goToThisDoc(tool._id)"
                            :visible="tool.visible"
                        >
                            <LIcon
                                :icon-size="dynamicSize(tool.iconSize)"
                                :icon-anchor="dynamicAnchor(tool.iconSize)"
                                v-if="tool.iconName"
                            >
                                <!-- if tool is on , this span make ripple wave effect -->
                                <span></span>
                                <i
                                    :class="tool.iconName"
                                    :style="{
                                        fontSize: `${tool.iconSize}px`,
                                        color:
                                            tool.secondaryColor.hex8 ||
                                            tool.secondaryColor,
                                        transform:
                                            'rotate(' + tool.angle + 'deg)',
                                        position: 'absolute',
                                    }"
                                />
                            </LIcon>
                            <LTooltip
                                v-if="tool.tooltip"
                                :options="tooltipOptions"
                                @dblclick="goToThisDoc(tool._id)"
                            >
                                <p>{{ tool.tooltip.text }}</p>
                                <img
                                    v-if="tool.tooltip.image"
                                    :src="tool.tooltip.image"
                                />
                            </LTooltip>
                        </LMarker>
                    </div>
                    <!-- end Point -->
                    <div v-if="tool.type === 'Textbox'">
                        <LMarker
                            :lat-lng="tool.coordinates"
                            :icon="CircleIcon"
                            @dblclick="goToThisDoc(tool._id)"
                            :visible="tool.visible"
                        >
                            <LIcon
                                v-if="tool.tooltip"
                                :icon-size="[tool.width, tool.height]"
                                :icon-anchor="[tool.width / 2, tool.height / 2]"
                            >
                                <div
                                    class="textBoxTool_inMap"
                                    v-if="tool.tooltip"
                                    :style="{
                                        width: `${tool.width}px`,
                                        height: `${tool.height}px`,
                                        background:
                                            tool.color.hex8 || tool.color,
                                        fontSize: `${tool.fontSize}px`,
                                        color:
                                            tool.secondaryColor.hex8 ||
                                            tool.secondaryColor,
                                    }"
                                >
                                    <p>{{ tool.tooltip.text }}</p>
                                    <img
                                        v-if="tool.tooltip.image"
                                        :src="tool.tooltip.image"
                                    />
                                </div>
                            </LIcon>
                        </LMarker>
                    </div>
                    <!-- end Textbox  -->
                </div>
            </div>
            <!-- end docs_list -->

            <LControlZoom position="bottomright"></LControlZoom>
        </LMap>
    </div>
</template>
<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
    LMap,
    LTileLayer,
    LMarker,
    LPolygon,
    LPolyline,
    LTooltip,
    LIcon,
    LControlZoom,
} from "vue2-leaflet";

import PolylineDecorator from "@/components/polyline-decorator";

import { mapState, mapGetters } from "vuex";

export default {
    name: "Map",
    data() {
        let achenSvgString = `
			<svg xmlns='http://www.w3.org/2000/svg' height="100" width="100">
				<circle cx="50" cy="50" r="40" stroke="#4a47ff" stroke-width="10" fill="white" />
			</svg>`;
        let myIconUrl = encodeURI(
            `data:image/svg+xml,${achenSvgString}`
        ).replace("#", "%23");
        let CircleIcon = L.icon({
            iconUrl: myIconUrl,
            iconSize: [10, 10],
            iconAnchor: [5, 5],
            popupAnchor: [4, -25],
        });
        let defaultIcon = L.divIcon({
            html: `<span></span><img class="leafletDefaultIcon" src="data:image/png;base64,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"/>`,
            // "https://s3-eu-west-1.amazonaws.com/ct-documents/emails/A-static.png",
            iconSize: [21, 31],
            iconAnchor: [10.5, 31],
            popupAnchor: [4, -25],
        });

        return {
            CircleIcon,
            defaultIcon,
            tooltipOptions: { permanent: false },
        };
    },
    computed: {
        ...mapState(["map"]),
        ...mapGetters(["DocLayer", "docs_list", "DocWithChildsTools"]),
        OnTool() {
            const OnTool = this.$store.state.DocProp.OnTool;
            if (OnTool.condition) return this.DocLayer.tools[OnTool.index];
            else return false;
        },
    },
    methods: {
        dynamicSize(iconSize) {
            return [iconSize, iconSize * 1.15];
        },
        dynamicAnchor(iconSize) {
            return [iconSize / 2, iconSize * 1.15];
        },
        goToThisDoc(_id) {
            const currentRoute = this.$router.currentRoute;
            const path = `/embed/${_id}`;
            if (path != currentRoute.fullPath) this.$router.push(path);
        },
    },
    mounted() {
        const mapObject = this.$refs.LeafletMap.mapObject;

        document.addEventListener(
            "showThisDoc",
            (event) => {
                const doc = event.detail;
                if (!doc) return;
                mapObject.flyTo(
                    doc.map_animate.coordinates,
                    doc.map_animate.zoom
                );
            },
            false
        );

        mapObject.on("baselayerchange", (Layer) => {
            const layerIndex = this.map.tileProviders.findIndex(
                (el) => el.name === Layer.name
            );
            this.update_layer(layerIndex);
        });
    },
    components: {
        LMap,
        LTileLayer,
        LMarker,
        LPolygon,
        LPolyline,
        LIcon,
        LControlZoom,
        PolylineDecorator,
        LTooltip,
    },
};
</script>

