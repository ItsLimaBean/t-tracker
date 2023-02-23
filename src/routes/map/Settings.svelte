<script>
	import { Modal } from "bootstrap";
	import { onMount, onDestroy } from "svelte";
	import { ShowBusPicture, ShowBusPictureKey } from "./store";


    export let map;
    export let mapReady;

    let ready = false;

    let showControl = true;

    let controlNode;

    let modalElem;
    let modal;

    const settings = [
        {
            id: ShowBusPictureKey,
            label: "Show bus popup images",
            value: $ShowBusPicture,
            update: (_this) => $ShowBusPicture = _this.value
        }
    ]

    $: if (mapReady && map && ready) {
        onMapReady();
    }

    onMount(() => {
        ready = true;
        modal = new Modal(modalElem);
    });

    onDestroy(() => {
        modal?.hide();
    });


    class SettingsControl {
        onAdd(map) {
            showControl = true;
            return controlNode;            
        }

        onRemove() {
            showControl = false;
        }
    }

    const onMapReady = () => {
        map.addControl(new SettingsControl(), "top-left");
    }

</script>

{#if showControl} 
    <div class="settings-control maplibregl-ctrl maplibregl-ctrl-group mapboxgl-ctrl mapboxgl-ctrl-group" bind:this={controlNode}>
        <button on:click={() => modal.show()} >
            <span class="settings-control-icon maplibregl-ctrl-icon mapboxgl-ctrl-icon"></span>
        </button>
    </div>
{/if}

<div class="modal" bind:this={modalElem}>
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Settings</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                {#each settings as setting, i (setting.id) }
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name={setting.id} id={setting.id} bind:checked={setting.value} on:change={() => setting.update(setting)}/>
                        <label class="form-check-label" for={setting.id}>{setting.label}</label>
                    </div>
                {/each}
                
            </div>
        </div>
    </div>
</div>

<style>
    .settings-control-icon {
        background: url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20viewBox%3D%220%2C0%2C256%2C256%22%20width%3D%2229px%22%20height%3D%2229px%22%20fill-rule%3D%22nonzero%22%3E%3Cg%20transform%3D%22translate(40.96%2C40.96)%20scale(0.68%2C0.68)%22%3E%3Cg%20fill%3D%22%23333%22%20fill-rule%3D%22nonzero%22%20stroke%3D%22none%22%20stroke-width%3D%221%22%20stroke-linecap%3D%22butt%22%20stroke-linejoin%3D%22miter%22%20stroke-miterlimit%3D%2210%22%20stroke-dasharray%3D%22%22%20stroke-dashoffset%3D%220%22%20font-family%3D%22none%22%20font-weight%3D%22none%22%20font-size%3D%22none%22%20text-anchor%3D%22none%22%20style%3D%22mix-blend-mode%3A%20normal%22%3E%3Cg%20transform%3D%22scale(5.12%2C5.12)%22%3E%3Cpath%20d%3D%22M47.16%2C21.221l-5.91%2C-0.966c-0.346%2C-1.186%20-0.819%2C-2.326%20-1.411%2C-3.405l3.45%2C-4.917c0.279%2C-0.397%200.231%2C-0.938%20-0.112%2C-1.282l-3.889%2C-3.887c-0.347%2C-0.346%20-0.893%2C-0.391%20-1.291%2C-0.104l-4.843%2C3.481c-1.089%2C-0.602%20-2.239%2C-1.08%20-3.432%2C-1.427l-1.031%2C-5.886c-0.084%2C-0.478%20-0.499%2C-0.828%20-0.985%2C-0.828h-5.5c-0.49%2C0%20-0.908%2C0.355%20-0.987%2C0.839l-0.956%2C5.854c-1.2%2C0.345%20-2.352%2C0.818%20-3.437%2C1.412l-4.83%2C-3.45c-0.399%2C-0.285%20-0.942%2C-0.239%20-1.289%2C0.106l-3.887%2C3.887c-0.343%2C0.343%20-0.391%2C0.883%20-0.112%2C1.28l3.399%2C4.863c-0.605%2C1.095%20-1.087%2C2.254%20-1.438%2C3.46l-5.831%2C0.971c-0.482%2C0.08%20-0.836%2C0.498%20-0.836%2C0.986v5.5c0%2C0.485%200.348%2C0.9%200.825%2C0.985l5.831%2C1.034c0.349%2C1.203%200.831%2C2.362%201.438%2C3.46l-3.441%2C4.813c-0.284%2C0.397%20-0.239%2C0.942%200.106%2C1.289l3.888%2C3.891c0.343%2C0.343%200.884%2C0.391%201.281%2C0.112l4.87%2C-3.411c1.093%2C0.601%202.248%2C1.078%203.445%2C1.424l0.976%2C5.861c0.079%2C0.481%200.496%2C0.834%200.985%2C0.834h5.5c0.485%2C0%200.9%2C-0.348%200.984%2C-0.825l1.045%2C-5.89c1.199%2C-0.353%202.348%2C-0.833%203.43%2C-1.435l4.905%2C3.441c0.398%2C0.281%200.938%2C0.232%201.282%2C-0.111l3.888%2C-3.891c0.346%2C-0.347%200.391%2C-0.894%200.104%2C-1.292l-3.498%2C-4.857c0.593%2C-1.08%201.064%2C-2.222%201.407%2C-3.408l5.918%2C-1.039c0.479%2C-0.084%200.827%2C-0.5%200.827%2C-0.985v-5.5c0.001%2C-0.49%20-0.354%2C-0.908%20-0.838%2C-0.987zM25%2C32c-3.866%2C0%20-7%2C-3.134%20-7%2C-7c0%2C-3.866%203.134%2C-7%207%2C-7c3.866%2C0%207%2C3.134%207%2C7c0%2C3.866%20-3.134%2C7%20-7%2C7z%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E");
    }



</style>