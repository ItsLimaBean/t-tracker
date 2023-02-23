<script>
    import maplibregl from "maplibre-gl";
    import { onMount, onDestroy } from "svelte";
    import { PUBLIC_MAPTILER_KEY } from "$env/static/public";
    import { loadImages } from "../../lib/map/images";
    import { emptyLineString, routeLayerStyle, busesLayerStyle, generateBuses } from "../../lib/map/geojson";
    import Popup from "./Popup.svelte"
	import Settings from "./Settings.svelte";

    export let requestUrl; //../api/buses

    let mapReady = false;

    let map;

    let cacheId = -1;
    const shapeCache = {};

    let buses;
    let selectedBus;

    let containerElement;

    let updateInterval;

    $: if (mapReady && buses) {
        updateBuses();
    }

    const updateBuses = () => {
        const geoJson = generateBuses(buses);
        map.getSource("buses").setData(geoJson);
    }

    const requestBuses = async () => {
        const response = await (await fetch(`${requestUrl}?t=${cacheId}`)).json();
        if (response.status !== "up-to-date") {
            buses = response.buses;
            cacheId = response.time;

            if (selectedBus) {
                selectedBus = findBus(selectedBus.id);
            }
        }
    }

    const findBus = (id) => {
        for (let bus of buses) {
            if (bus.id === id) return bus;
        }
    }

    const onPopupClose = (event) => {
        map?.getSource("route").setData(emptyLineString);
        if (event.id === selectedBus.id) {
            selectedBus = undefined;
        }
    }

    const onPopupOpen = async (event) => {
        await loadShape(selectedBus.shape, selectedBus.color.color);
    }

    const loadShape = async (shapeId, color) => {
        if (!shapeCache[shapeId]) {
            shapeCache[shapeId] = await (await fetch(`../api/shapes/${shapeId}`)).json();
            shapeCache[shapeId].properties.color = color;
        }

        if (shapeId === selectedBus.shape) {
            map.getSource("route").setData(shapeCache[shapeId]);
        }
    }

    onMount(() => {
        requestBuses();
        updateInterval = setInterval(requestBuses, 15000);
        
        map = new maplibregl.Map({
            container: containerElement,
            style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${PUBLIC_MAPTILER_KEY}`,
            center: [-122.9656204, 49.2204609],
            zoom: 11,
            maxBounds: [[-123.506427,48.949414],[-122.029941,49.48535]],
            customAttribution: `Bus images via <a href="https://cptdb.ca/wiki/">CPTDB Wiki</a>`
        });

        map.on("load", async () => {
            await loadImages(map, [
                [ "bus_unk", "../busicons/icon.png" ],
                [ "bus_early", "../busicons/icon_early.png" ],
                [ "bus_ontime", "../busicons/icon_ontime.png" ],
                [ "bus_late", "../busicons/icon_late.png" ],
                [ "bus_verylate", "../busicons/icon_verylate.png" ]
            ]);

            map.addSource("buses", {
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "features": []
                }
            });

            map.addSource("route", {
                "type": "geojson",
                "data": emptyLineString
            });

            map.on("click", "buses", async (event) => {
                const properties = event.features[0].properties;
                const bus = findBus(properties.id);
                if (!bus) throw new Error("Could not find bus " + bus);
                selectedBus = bus;
            });

            map.on("mouseenter", "buses", () => map.getCanvas().style.cursor = "pointer");
            map.on("mouseleave", "buses", () => map.getCanvas().style.cursor = "");

            map.addLayer(routeLayerStyle);
            map.addLayer(busesLayerStyle);

            map.addControl(new maplibregl.NavigationControl(), "top-left");

            mapReady = true;
        });
    });

    onDestroy(() => {
        map?.remove();
        map = undefined;
        clearInterval(updateInterval);
    })
</script>

<div class="map" bind:this={containerElement}></div>
<Popup bus={selectedBus} map={map} mapReady={mapReady} on:close={onPopupClose} on:open={onPopupOpen}></Popup>
<Settings map={map} mapReady={mapReady} ></Settings>

<style>
    @import "maplibre-gl/dist/maplibre-gl.css";

    .map {
        width: 100%;
        height: 100%;
    }
</style>