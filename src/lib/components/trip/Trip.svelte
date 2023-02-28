<script>
    import { onMount } from "svelte";
    import { Container, ListGroup, ListGroupItem, Row, Col } from "sveltestrap";


    export let tripData;

    // let tripData;

    // onMount(async () => {
    //     tripData = await (await fetch(`/api/trip/${tripId}?sys=${system}`)).json();
    // });
</script>


{#if tripData}
    <ListGroup flush={true}>
        {#each tripData.stops as stop, i (i)}
            <ListGroupItem>
                <Row>
                    <Col xs="9">{stop.name}</Col>
                    <Col xs="3"><div class="text-end">{stop.departureTime}</div></Col>
                </Row>
            </ListGroupItem>
        {/each}
    </ListGroup>
{/if}
