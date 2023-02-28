<script>    
    import { browser } from "$app/environment";
    import { Styles } from "sveltestrap";

    const registerServiceWorker = async () => {
        if (browser && "serviceWorker" in navigator) {
            try {
                await navigator.serviceWorker.register("/pwa/sw.js");
                console.log("Service Worker: Registered");
            } catch (e) {
                console.error("Service Worker: Error", e);
            }
        }
    }

    registerServiceWorker();
</script>


<svelte:head>
    <link rel="manifest" href="/pwa/manifest.webmanifest">
</svelte:head>

<main>
    <Styles />
    <slot />
</main>

<style>
    :global(.modal-dialog) {
        overflow-y: initial !important
    }

    :global(.modal-body) {
        max-height: 89vh;
        overflow-y: auto;
    }
</style>