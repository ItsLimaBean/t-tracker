<script>
    import { Modal, ModalHeader, ModalBody } from "sveltestrap";
    import Trip from "$lib/components/trip/Trip.svelte"
    export let tripInfo;

    let tripData;

    $: if (tripInfo) {
        fetchTripData();
    }

    const fetchTripData = async () => {
        tripData = await (await fetch(`/api/trip/${tripInfo.tripId}?sys=${tripInfo.system}`)).json();
        open = true;
    }

    let open = false;
    const toggle = () => open = !open;
</script>

{#if tripData}
    <Modal isOpen={open} {toggle} >
        <ModalHeader {toggle}>{tripData.headsign}</ModalHeader>
        <ModalBody>
            <Trip {tripData}/>
        </ModalBody>
    </Modal>    
{/if}