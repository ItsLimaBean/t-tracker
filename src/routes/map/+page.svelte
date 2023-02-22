<script>
	import Map from "./Map.svelte";

</script>
<main>
    <div class="map-container">
        <Map requestUrl="../api/buses"></Map>
    </div>
</main>

<style>
    :global(body) {
        margin: 0;
    }

    .map-container {
        height: 100vh;
    }
</style>