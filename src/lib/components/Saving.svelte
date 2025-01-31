<script>
    import { fly } from "svelte/transition";
    export let text = "Saving...";
    export let show = false;
</script>

{#if show}
    <p transition:fly={{ y: -100 }}>{text}</p>
{/if}

<style>
    p {
        position: fixed;
        top: 0;
        left: 50%;
        translate: -50% 0;
        padding: 1rem;
        z-index: 1;
        background-color: black;
    }
</style>