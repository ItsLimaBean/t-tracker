<script>
	import Map from "$lib/components/map/Map.svelte";
    import { Row, Col } from "sveltestrap";

</script>
<Row>
    <Col id="map-container-col">
        <div class="map-container">
            <Map requestUrl="/api/buses" hash={true}></Map>
        </div>
    </Col>
</Row>

<style>
    .map-container {
        width: 100vw;
        height: calc(100vh - 56px);
    }

    :global(#map-container-col) {
        padding: 0;
    }
</style>