<script>
	import Map from "$lib/map/components/Map.svelte";

</script>
<div class="map-container">
    <Map requestUrl="../api/buses" hash={true}></Map>
</div>

<style>
    :global(body) {
        margin: 0;
    }

    .map-container {
        width: 100vw;
        height: 100vh;
    }
</style>