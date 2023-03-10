<script>
    import maplibregl from "maplibre-gl";
    import { onMount, onDestroy } from "svelte";
    import { PUBLIC_MAP_STYLE, PUBLIC_SITE_ORIGIN } from "$env/static/public";
    import { loadImages } from "$lib/map/images";
    import { emptyLineString, routeLayerStyle, busesLayerStyle, generateBuses, routeStopsLayerStyle, emptyCollection } from "$lib/map/geojson";
    import { parseHash } from "$lib/urlutil";
    import { ShowBusStopsOnRoute } from "$lib/components/map/store";
    import Popup from "$lib/components/map/Popup.svelte";
    import Settings from "$lib/components/map/Settings.svelte";
    import TripInfo from "$lib/components/map/TripInfo.svelte";
    import ReconnectingEventSource from "reconnecting-eventsource";

    export let requestUrl;
    export let hash;

    let mapReady = false;

    let map;

    const shapeCache = {};
    const stopsCache = {};

    let buses;
    let selectedBus;

    let containerElement;


    let processedHash = false;

    let viewTripInfo;

    const debug = { zoom: -1 }

    $: if (mapReady && buses) {
        updateBuses();
        processHash();
    }


    $: if (selectedBus && selectedBus.trip) {
        loadShape(selectedBus.shape, selectedBus.system, selectedBus.color.color);
        if ($ShowBusStopsOnRoute) {
            loadStops(selectedBus.trip, selectedBus.system);
        } else {
            map.getSource("route_stops").setData(emptyCollection);
        }
    }

    $: if ((!selectedBus || !selectedBus.trip) && mapReady) {
        map.getSource("route").setData(emptyLineString);
        map.getSource("route_stops").setData(emptyCollection);
    }


    const updateBuses = () => {
        const geoJson = generateBuses(buses);
        map.getSource("buses").setData(geoJson);
    }


    const processHash = () => {
        if (!processedHash) {
            processedHash = true;
            const hash = parseHash(window?.location?.hash);

            if (hash["bus"]) {
                try {
                    selectBus(hash["bus"], true);

                    map.flyTo({center: [selectedBus.lng, selectedBus.lat], zoom: map.getZoom()})
                } catch (err) {
                    console.log(err)
                }
            }
        }
    }

    const findBus = (id, useDisplay) => {
        for (let bus of buses) {
            if (bus.id === id || (useDisplay && bus.model.displayId === id)) return bus;
        }
    }

    const onPopupClose = (event) => {       
        if (event.detail.busId === selectedBus?.id) {
            selectedBus = undefined;
        }
    }
    const loadShape = async (shapeId, system, color) => {
        if (!shapeCache[shapeId]) {
            shapeCache[shapeId] = await (await fetch(`/api/shapes/${shapeId}?sys=${system}`)).json();
            shapeCache[shapeId].properties.color = color;
        }

        if (shapeId === selectedBus.shape) {
            map.getSource("route").setData(shapeCache[shapeId]);
        }
    }

    const loadStops = async (tripId, system) => {
        if (!stopsCache[tripId]) {
            stopsCache[tripId] = await (await fetch(`/api/stops/${tripId}?sys=${system}`)).json();
        }

        if (tripId === selectedBus.trip) {
            map.getSource("route_stops").setData(stopsCache[tripId]);
        }
    }

    const selectBus = (busId, useDisplay) => {
        const bus = findBus(busId, useDisplay);
        if (!bus) throw new Error("Could not find bus " + busId);
        selectedBus = bus;
    }

    const onTripView = (event) => {
        viewTripInfo = event.detail;
    }

    onMount(() => {
        

        map = new maplibregl.Map({
            container: containerElement,
            style: PUBLIC_MAP_STYLE,
            center: [-122.9656204, 49.2204609],
            zoom: 11,
            minZoom: 10,
            maxBounds: [[-123.506427,48.949414],[-121.39,49.48535]],
            customAttribution: `Bus images via <a href="https://cptdb.ca/wiki/">CPTDB Wiki</a>`,
            hash: hash !== undefined ? "p" : false
        });

        map.on("load", async () => {
            debug.interval = setInterval(() => {
                debug.zoom = map.getZoom();
            }, 100)

            await loadImages(map, [
                [ "bus_unk", "../busicons/icon.png" ],
                [ "bus_early", "../busicons/icon_early.png" ],
                [ "bus_ontime", "../busicons/icon_ontime.png" ],
                [ "bus_late", "../busicons/icon_late.png" ],
                [ "bus_verylate", "../busicons/icon_verylate.png" ]
            ]);

            map.addSource("buses", {
                "type": "geojson",
                "data": emptyCollection
            });

            map.addSource("route", {
                "type": "geojson",
                "data": emptyLineString
            });

            map.addSource("route_stops", {
                "type": "geojson",
                "data": emptyCollection
            });

            map.on("click", "buses", async (event) => {
                const properties = event.features[0].properties;
                selectBus(properties.id, false);
            });

            map.on("mouseenter", "buses", () => map.getCanvas().style.cursor = "pointer");
            map.on("mouseleave", "buses", () => map.getCanvas().style.cursor = "");

            map.addLayer(routeLayerStyle);
            map.addLayer(routeStopsLayerStyle);
            map.addLayer(busesLayerStyle);

            map.addControl(new maplibregl.NavigationControl(), "top-left");

            mapReady = true;
        });

        const sse = new ReconnectingEventSource(requestUrl);
        
        sse.addEventListener("update", (event) => {
            const url = new URL(event.origin);
            if (url.hostname !== PUBLIC_SITE_ORIGIN) {
                console.error("Invalid origin: " + url.hostname);
                return;
            }
            buses = JSON.parse(event.data);

            if (selectedBus) {
                selectedBus = findBus(selectedBus.id);
            }
        });

        return () => { sse.close(); }
    });

    onDestroy(() => {
        mapReady = false;
        map?.remove();
        map = undefined;
        clearInterval(debug.interval);
    })
</script>

<div class="map" bind:this={containerElement}></div>
<Popup bus={selectedBus} map={map} mapReady={mapReady} on:close={onPopupClose} on:tripview={onTripView}></Popup>
<Settings map={map} mapReady={mapReady}></Settings>
<TripInfo tripInfo={viewTripInfo}></TripInfo>

<div class="debug">
    Zoom: {debug.zoom }
</div>

<style>
    @import "maplibre-gl/dist/maplibre-gl.css";

    .debug {
        top: 56px;
        left: 50px;
        position: absolute;
        background-color: white;
    }

    .map {
        width: 100%;
        height: 100%;
    }
</style>