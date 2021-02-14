<template>
    <div>
        <Map />
        <div class="error" v-if="error">
            {{ error }}
        </div>
    </div>
</template>

<script>
import Map from "@/components/map.vue";

export default {
    name: "map-iframe",
    components: {
        Map,
    },
    computed: {
        error() {
            return this.$store.state.error;
        },
    },
};
</script>

<style lang="scss">
.error {
    position: absolute;
    top: 0px;
    right: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    background-color: rgba(0, 0, 0, 0.476);
    backdrop-filter: blur(3px);
    color: white;
    direction: rtl;
    text-align: right;
}
</style>
