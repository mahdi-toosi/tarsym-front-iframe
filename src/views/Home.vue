<template>
    <div>
        <Map />
        <div class="error" v-if="error">
            {{ error }}
        </div>
        <button class="btn-back" v-if="hasHistory()" @click="$router.go(-1)">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2.7"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
            </svg>
        </button>
    </div>
</template>

<script>
import Map from "@/components/map.vue";

export default {
    name: "map-iframe",
    components: {
        Map,
    },
    methods: {
        hasHistory() {
            return window.history.length > 2;
        },
    },
    computed: {
        error() {
            return this.$store.state.error;
        },
    },
};
</script>

<style lang="scss">
.bar {
    height: 4px !important;
}
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
.btn-back {
    position: absolute;
    top: 5px;
    left: 5px;
    background: transparent;
    border: none;
    cursor: pointer;
    z-index: 99999;
    color: #5c5c5c;
    transition: 0.3s;
    outline: unset;
    &:hover {
        color: #161616;
    }
    svg {
        width: 30px;
    }
}
</style>
