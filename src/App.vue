<template>
    <div id="app">
        <router-view />
    </div>
</template>

<style lang="scss">
body {
    margin: 0px;
    font-family: "iranSans";
}

#app {
    width: 100vw;
    height: 100vh;

    & > div {
        width: 100%;
        height: 100%;
        & > div {
            width: 100%;
            height: 100%;
        }
    }
}

.leaflet-control-attribution {
    font-size: 0px !important;
    border-radius: 3px;
    a:first-child {
        display: none;
    }

    .attr {
        font-size: 12px;
        color: #565656;
        padding: 2px 5px 0px;
    }
}
</style>
