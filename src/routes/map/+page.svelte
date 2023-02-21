<script>
    //TODO: Rewrite this file, it's a mess and can be split up.
    import maplibregl from "maplibre-gl";
	import { onMount } from "svelte";
    import { PUBLIC_MAPTILER_KEY } from "$env/static/public";
    import { BusDelayColors } from "../../lib/colors";
    const MapZoomTextThreshold = 14; // Threshold of when to allow text overlap
    const MapZoomIconSizeThreshold = 12; // Threshold of when to change to larger icons

    let containerElement;
    let map;
    let mapReady = false;

    let buses = [];
    let cacheId = -1;

    let shapeCache = {};

    let popup = { bus: 0, instance: undefined, busImage: undefined };


    $: if (buses && mapReady === true) {
        updateBuses();
    }

    let debug = {
        zoom: -1
    }

    onMount(() => {
        map = new maplibregl.Map({
            container: containerElement,
            style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${PUBLIC_MAPTILER_KEY}`,
            center: [-122.9656204, 49.2204609],
            zoom: 11,
            maxBounds: [[-123.506427,48.949414],[-122.029941,49.48535]],
            customAttribution: `Bus Images Via <a href="https://cptdb.ca/wiki/">CPTDB Wiki</a>`
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
                    "icon-size": ["step",
                        ["zoom"],
                        24/512,
                        MapZoomIconSizeThreshold, 36/512
                    ],
                    "text-allow-overlap": ["step",
                        ["zoom"],
                        false,
                        MapZoomTextThreshold, true
                    ],
                    "text-optional": true,
                    //"text-field": ["get", "text"],
                    "text-field": ["get", "text"],
                    "text-offset": [0, 0.7],
                    "text-size": 9.5,
                    "text-justify": "center",
                    "symbol-z-order": "viewport-y"
                    // "icon-size": ['interpolate', ['linear'], ['zoom'], 8, 10/512, 12, 36/512]
                },
                "paint": {
                    "text-halo-color": "rgba(0, 0, 0, 1)",
                    "text-halo-width": .3,
                    "text-opacity": ["step", 
                        ["zoom"],
                        0.0,
                        MapZoomIconSizeThreshold, 1.0
                    ]
                }
            });
            
            
            map.on("click", "buses", async (event) => {
                
                const properties = event.features[0].properties;
                const bus = findBus(properties.id);
                popup.bus = bus.id;
                popup.instance?.remove();
                popup.busImage?.remove();
                popup.busImage = undefined;
                popup.instance = new maplibregl.Popup({offset: [0, -18]})
                    .setHTML(getBusHTML(bus))
                    .setLngLat([bus.lng, bus.lat])
                    .addTo(map);

                popup.instance.on("close", () => {
                    map.getSource("route").setData(blankLines());
                });

                setBusImage(bus);

                const shape = properties.shape;
                if (!shapeCache[shape]) {
                    shapeCache[shape] = await (await fetch(`../api/shapes/${shape}`)).json();
                }

                map.getSource("route").setData(shapeCache[shape]);
            

            
            });
            
            map.on("mouseenter", "buses", () => map.getCanvas().style.cursor = "pointer");
            map.on("mouseleave", "buses", () => map.getCanvas().style.cursor = "");

            requestBuses();
            mapReady = true;
            
            setInterval(() => {
                debug.zoom = map.getZoom();
            }, 100)
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

    const updateBuses = async () => {
        const geoJson = {

            "type": "FeatureCollection",
            "features": buses.map((value, i) => {
                return {
                    "type": "Feature",
                    "properties": {
                        "id": `${value.id}`,
                        "text": `${value.route}\n\n${value.model.displayId}`,
                        "shape": `${value.shape}`,
                        "marker": `bus_${value.icon}`,
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
            popup.busImage = undefined;
        } else if (bus && popup.instance) {
            popup.instance.setLngLat([bus.lng, bus.lat])
                .setHTML(getBusHTML(bus));

            setBusImage(bus);
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
                <br>${bus.dir} - <span style="color: #${BusDelayColors[bus.icon]};"><strong>${formatDelayTime(bus.delay)}</strong></span>
                <br>Vehicle ${bus.model.displayId} - <small>${bus.model.operator}</small>
                <br><small>${bus.model.name}</small>
                <br><small>Next Stop: ${bus.nextStop}</small>
                <br><small>Updated: ${bus.updated}</small>
                <br><div class="popup-image-wrapper"><img class="loader" src="../spinner.svg" alt="Bus ${bus.model.displayId}"/></div>`;
    }

    const formatDelayTime = (delay) => {
        if (delay === undefined || delay === null) return "Unknown.";

        let displayText = [];
        let endText = "behind";
        if (delay > 0) {
            endText = "ahead"
        } else if (delay === 0) {
            return "On time";
        }

        delay = Math.abs(delay);
        const hours = Math.floor((delay / 60) / 60);
        const minutes = Math.floor(delay / 60) % 60;
        const seconds = Math.floor(delay) % 60;

        if (hours > 0) displayText.push(`${hours}h`);
        if (minutes > 0) displayText.push(`${minutes}m`);
        if (seconds > 0) displayText.push(`${seconds}s`);
        displayText.push(endText);

        return displayText.join(" ");
    }

    const setBusImage = async (bus) => {
        const wrapper = () => { return document.querySelector(".popup-image-wrapper") };

        if (popup.busImage) {
            const imgWrapper = wrapper();
            imgWrapper.firstChild.remove();
            imgWrapper.appendChild(popup.busImage);
            return;
        }


        let url;
        switch (bus.model.operator) {
            case "CMBC":
                url = `https://cptdb.ca/wiki/thumb.php?f=Coast_Mountain_Bus_Company_${bus.model.displayId}-a.jpg&w=200`;
                break;
            case "Blue Bus":
                url = `https://cptdb.ca/wiki/thumb.php?f=West_Vancouver_Municipal_Transit_${bus.model.displayId}-a.jpg&w=200`;
                break;
        }

        if (typeof url !== "string") throw new TypeError("\"" + (typeof url) + "\" !== \"string\"\nCould not load image for " + bus.model.displayId);

        popup.busImage = new Image(200);
        popup.busImage.onload = (e) => {
            const imgWrapper = wrapper();
            if (popup.busImage && imgWrapper) {
                imgWrapper.firstChild.remove();
                imgWrapper.appendChild(popup.busImage);
            }
        };
        popup.busImage.onerror = (event) => {
            const imgWrapper = wrapper();
            if (imgWrapper) {
                imgWrapper.firstChild.remove();
                popup.busImage = undefined;
            }
            
        }
        popup.busImage.loading = "eager";
        popup.busImage.crossOrigin = undefined;
        popup.busImage.src = url;
    }

</script>


<main>

    <div style="position: absolute; background-color: white; z-index:9999;">
        <span>DEBUG:</span>
        <div>
            Zoom: {debug.zoom}
        </div>
    </div>
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

    :global(.popup-image-wrapper) {
        max-height: 100px;
        line-height: 100px;
        justify-content: center;
        display: flex;
        transition: linear 2s;
        
    }

    :global(.popup-image-wrapper > img) {
        object-fit: contain;
    }

</style>