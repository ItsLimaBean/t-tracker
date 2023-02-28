<script>
	import maplibregl from "maplibre-gl";
    import { BusDelayColors } from "$lib/colors";
    import { formatDelayTime } from "$lib/map/delay";
	import { createEventDispatcher, onDestroy } from "svelte";
    import { ShowBusPicture } from "./store";
    import { Row } from "sveltestrap";

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

    const onTripViewClick = () => {
        dispatch("tripview", { tripId: bus.trip, system: bus.system  });
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
                if (event.target.dispatchClose && bus) {
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


<!-- TODO: Clean this mess of HTML up. -->
<div class="popup-wrapper">
    <div bind:this={html}>
        {#if mapReady === true && bus !== undefined}
            <Row>
                <span class="route-header">
                    <span class="route-id rounded-pill" style:background-color={ bus.color.color } style:color={ bus.color.text }>
                        { bus.route }
                    </span>
                    { bus.dest }
                </span>
            </Row>
            {#if bus.dir || bus.trip}
                <Row>
                    <span>
                        {#if bus.dir}{bus.dir}{/if}
                        {#if bus.dir && bus.trip } - {/if}
                        {#if bus.trip }
                            <span class="route-delay" style:color={ BusDelayColors[bus.icon]}>{ formatDelayTime(bus.delay) }</span>
                        {/if}
                    </span>
                </Row>
            {/if}
            <Row>
                <span>Vehicle {bus.model.displayId} - <small>{bus.model.operator}</small></span>
            </Row>
            <Row><small>{bus.model.name}</small></Row>
            {#if bus.trip}
                <Row>
                    <!-- svelte-ignore a11y-invalid-attribute -->
                    <span><a href="javascript:;" on:click={onTripViewClick}>View Trip</a></span>
                </Row>
            {/if}

            {#if bus.nextStop}
                <Row>
                    <small>Next Stop: {bus.nextStop}</small>
                </Row>
            {/if}
            <Row><small>Updated: {bus.updated}</small></Row>
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