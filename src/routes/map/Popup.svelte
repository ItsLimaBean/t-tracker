<script>
	import maplibregl from "maplibre-gl";
    import { BusDelayColors } from "../../lib/colors";
    import { formatDelayTime } from "../../lib/map/delay";
	import { createEventDispatcher, onDestroy } from "svelte";
    import { ShowBusPicture } from "./store";

    export let bus;
    export let map;
    export let mapReady;

    let fourOFourBuses = [];

    const dispatch = createEventDispatcher();

    let showBusPicture = true;
    ShowBusPicture.subscribe((value) => showBusPicture = value);

    let lastBusId;
    let popup;

    let imageState = "spinner";

    let html;
    
    $: if (mapReady && bus && html) {
        newPopup();
    }

    const getImageUrl = (theBus) => {
        switch (theBus.model.operator) {
            case "CMBC":
                return `https://cptdb.ca/wiki/thumb.php?f=Coast_Mountain_Bus_Company_${theBus.model.displayId}-a.jpg&w=200`;
            case "Blue Bus":
                return `https://cptdb.ca/wiki/thumb.php?f=West_Vancouver_Municipal_Transit_${theBus.model.displayId}-a.jpg&w=200`;
            case "BC Transit":
                return `https://cptdb.ca/wiki/thumb.php?f=BC_TRANSIT_${theBus.model.displayId}-a.jpg&w=200`
            default:
                return "";
        }
    }

    const onImageLoad = () => {
        imageState = "loaded";
    }

    const onImageError = () => {
        fourOFourBuses.push(bus.id);
        imageState = "error";
    }

    const newPopup = () => {
        let isNew = false;

        if (popup) popup.dispatchClose = false;

        if (lastBusId !== bus.id) {
            imageState = "spinner";
            isNew = true;

            popup?.remove();

            popup = new maplibregl.Popup({ offset: [ 0, -18 ] }).setDOMContent(html);
        }

        popup.remove()
            .setLngLat([ bus.lng, bus.lat ])
            .addTo(map);
        popup.dispatchClose = true;

        lastBusId = bus.id;
        if (isNew) {
            popup.on("close", (event) => {
                if (event.target.dispatchClose) {
                    dispatch("close", { busId: bus.id });
                }
            });

        }
    }

    onDestroy(() => {
        popup?.remove();
        popup = undefined;
    })

</script>


<div class="popup-wrapper">
    <div bind:this={html}>
        {#if mapReady === true && bus !== undefined}
            <span class="route-header"><span class="route-id rounded-pill" style:background-color={ bus.color.color } style:color={ bus.color.text }>{ bus.route }</span> { bus.dest }</span><br>
            {#if bus.dir}{bus.dir} - {/if}{#if bus.trip }<span class="route-delay" style:color={ BusDelayColors[bus.icon]}>{ formatDelayTime(bus.delay) }</span><br>{/if}
            Vehicle {bus.model.displayId} - <small>{bus.model.operator}</small><br>
            <small>{bus.model.name}</small><br>
            {#if bus.nextStop}<small>Next Stop: {bus.nextStop}</small><br>{/if}
            <small>Updated: {bus.updated}</small><br>
            <div class="popup-image-wrapper">
                {#if showBusPicture && fourOFourBuses.indexOf(bus.id) === -1} 
                    <img
                        style:display={imageState === "spinner" ? "unset" : "none"}
                        class="popup-image-loader"
                        src="../spinner.svg" alt="Loading spinner"
                    />
                    <img
                        on:load={onImageLoad}
                        on:error={onImageError}
                        style:display={imageState === "loaded"? "unset" : "none"}
                        class="popup-image"
                        src={getImageUrl(bus)} alt="A bus"
                    />
                {/if}
            </div>
        {/if}

    </div>
    
</div>

<style>
    .route-header {
        font-weight: bold;
    }

    .route-header > .route-id {
        padding: 0.2rem 0.3rem 0.1rem 0.3rem;
    }

    .route-delay {
        font-weight: bold;
    }

    .popup-wrapper {
        display: none;
    }

    .popup-image-wrapper {
        max-height: 100px;
        line-height: 100px;
        justify-content: center;
        display: flex;
        transition: linear 2s;
    }

    .popup-image-wrapper img {
        object-fit: contain;
    }
</style>