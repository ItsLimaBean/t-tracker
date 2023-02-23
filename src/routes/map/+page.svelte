<script>
	import Map from "./Map.svelte";

</script>
<div class="map-container">
    <Map requestUrl="../api/buses"></Map>
</div>

<style>
    :global(body) {
        margin: 0;
    }

    .map-container {
        height: 100vh;
    }
</style>