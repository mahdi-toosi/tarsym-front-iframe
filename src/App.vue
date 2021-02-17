<template>
    <div id="app">
        <router-view />
    </div>
</template>

<style lang="scss">
*,
*:focus {
    outline: none;
    -webkit-tap-highlight-color: transparent;
}

*::-webkit-scrollbar {
    width: 7px;
    height: 7px;
    background-color: #f5f5f5;
}

*::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: #f5f5f5;
}

*::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #555;
}
@font-face {
    font-family: iranSans;
    font-style: normal;
    font-weight: normal;
    src: local("IRANSans");
    src: url("/statics/fonts/eot/IRANSansWeb.eot?#iefix")
            format("embedded-opentype"),
        url("/statics/fonts/woff2/IRANSansWeb.woff2") format("woff2"),
        url("/statics/fonts/woff/IRANSansWeb.woff") format("woff"),
        url("/statics/fonts/ttf/IRANSansWeb.ttf") format("truetype");
}
body {
    margin: 0px;
    font-family: "IRANSans";
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

.map {
    font-family: "iranSans" !important;
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
.leaflet-tooltip {
    direction: rtl;
    white-space: normal !important;
    opacity: 1 !important;
    background-color: #ffffffe6;

    p {
        margin: 0px;
        min-width: 120px;
        max-width: 350px;
        overflow: hidden;
    }

    img {
        border-radius: 4px;
        display: block;
        max-width: 300px;
        max-height: 400px;
        margin: 6px auto 0px;
    }
}
.textBoxTool_inMap {
    direction: rtl;
    border-radius: 5px;
    padding: 5px;
    box-shadow: #cecece -1px 1px 3px 0px;
    box-sizing: border-box;
    overflow: auto;
}
p {
    margin: 0px;
}
</style>
