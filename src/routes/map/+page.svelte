<script>
    import maplibregl from "maplibre-gl";
	import { onMount } from "svelte";
    import { PUBLIC_MAPTILER_KEY } from "$env/static/public";
    let containerElement;
    let map;
    let mapReady = false;

    let buses = [];
    let cacheId = -1;

    let shapeCache = {};

    let popup = { bus: 0, instance: undefined };

    $: if (buses && mapReady === true) {
        updateBuses();
    }

    onMount(() => {
        map = new maplibregl.Map({
            container: containerElement,
            style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${PUBLIC_MAPTILER_KEY}`,
            center: [-122.9656204, 49.2204609],
            zoom: 11,
            //maxBounds: [[-123.506427,48.949414],[-122.029941,49.48535]]
        });

        map.on("load", async () => {

            await Promise.all([
                loadImages(map, "bus_unk", "../busicons/icon.png"),
                loadImages(map, "bus_early", "../busicons/icon_early.png"),
                loadImages(map, "bus_ontime", "../busicons/icon_ontime.png"),
                loadImages(map, "bus_late", "../busicons/icon_late.png"),
                loadImages(map, "bus_verylate", "../busicons/icon_verylate.png"),
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
                "data": blankLines()
            })

            map.addLayer({
                "id": "route",
                "type": "line",
                "source": "route",
                "layout": {
                    "line-join": "round",
                    "line-cap": "round",
                },
                "paint": {
                    "line-color": "#3d51aa",
                    "line-width": 4
                }
            });

            map.addLayer({
                "id": "buses",
                "type": "symbol",
                "source": "buses",
                "layout": {
                    "icon-allow-overlap": true,
                    "icon-image": ["get", "marker"],
                    "icon-size": 36/512,
                    "text-allow-overlap": true,
                    "text-field": ["get", "id"],
                    "text-offset": [0, 1.35],
                    "text-size": 11,
                    // "icon-size": ['interpolate', ['linear'], ['zoom'], 8, 10/512, 12, 36/512]
                }
            });
            
            
            map.on("click", "buses", async (event) => {
                event.cancel = true;
                
                const properties = event.features[0].properties;
                const bus = findBus(properties.id);
                popup.bus = bus.id;
                popup.instance = new maplibregl.Popup({offset: [0, -18]})
                    .setHTML(getBusHTML(bus))
                    .setLngLat([bus.lng, bus.lat])
                    .addTo(map);

                const shape = properties.shape;
                if (!shapeCache[shape]) {
                    shapeCache[shape] = await (await fetch(`../api/shapes/${shape}`)).json();
                }

                map.getSource("route").setData(shapeCache[shape]);
            });
            map.on("click", (event) => {
                if (!event.cancel) {
                    map.getSource("route").setData(blankLines());
                }
            });
            
            map.on("mouseenter", "buses", () => map.getCanvas().style.cursor = "pointer");
            map.on("mouseleave", "buses", () => map.getCanvas().style.cursor = "");

            requestBuses();
            mapReady = true;

        });

        
    });

    const requestBuses = async () => {
        const response = await (await fetch(`../api/buses?t=${cacheId}`)).json();
        if (response.status !== "up-to-date") {
            buses = response.buses;
            cacheId = response.time;
        }

        setTimeout(requestBuses, 15000);
    }

    const updateBuses = () => {
        const geoJson = {

            "type": "FeatureCollection",
            "features": buses.map((value, i) => {
                return {
                    "type": "Feature",
                    "properties": {
                        "id": `${value.id}`,
                        "shape": `${value.shape}`,
                        "marker": "bus_unk"
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            value.lng,
                            value.lat
                        ]
                    }
                }
            })

            
        };
        map.getSource("buses").setData(geoJson);
        
        const bus = findBus(popup.bus);
        if (!bus && popup.instance) {
            popup.instance.remove();
            popup.instance = undefined;
        } else if (bus && popup.instance) {
            popup.instance.setLngLat([bus.lng, bus.lat])
                .setHTML(getBusHTML(bus));
        }
    }

    const loadImages = (map, imageName, imageUrl) => {
        return new Promise((resolve, reject) => {
            map.loadImage(imageUrl, (err, img) => {
                if (err) return reject(err);

                map.addImage(imageName, img);
                resolve();
            });
        })
    }

    const blankLines = () => {
        return {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "LineString",
                "coordinates": []
            }
        };
    }

    const findBus = (id) => {
        for (let bus of buses) {
            if (bus.id === id) return bus;
        }
    }

    const getBusHTML = (bus) => {
        return `<span style="font-weight: bold;">${bus.route} ${bus.dest}</span>
                <br>Delay: ${bus.delay[0]}
                <br>Vehicle ${bus.id}
                <br>Direction: ${bus.dir}
                <br><small>Updated: ${bus.updated}</small>`;
    }

</script>


<main>
    <div class="map-container">
        <div class="map" bind:this={containerElement}></div>
    </div>
</main>

<style>
    @import "maplibre-gl/dist/maplibre-gl.css";

    :global(body) {
        margin: 0;
    }

    .map {
        width: 100%;
        height: 100%;
    }

    .map-container {
        height: 100vh;
    }
</style>