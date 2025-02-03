<script>
	import { fade, fly } from "svelte/transition";

    export let name = "My Folder", notes = [];
    export let noteClickFunction = (noteID) => {};
    export let folderDeleteFunction = () => {};
    export let show = false, closableFromWrapper = true;
</script>

{#if show}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="wrapper" on:click={(e) => {
    if(closableFromWrapper) {
        const target = e.target;
        if(target.classList.contains("wrapper")) {show = false}
    }
}} transition:fade={{ duration: 50 }}>
    <div transition:fly={{ y: 100 }} class="main">
        <h2>{name}</h2>
        <div class="notes-in-folder">
            {#each notes as { content, noteID }}
                <button on:click={() => noteClickFunction(noteID)}>{content}</button>
            {/each}
        </div>
        <div>
            <button on:click={folderDeleteFunction}>Delete</button>
        </div>
    </div>
</div>
{/if}

<style>
    .wrapper {
        position: fixed;
        background-color: #00000052;
        inset: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1;
    }

    .main {
        max-width: 400px;
        margin-inline: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
        background-color: black;

        max-height: calc(100vh - 2rem);
        max-height: calc(100svh - 2rem);
        overflow: auto;
    }

    .notes-in-folder {
        display: flex;
        flex-direction: column;
        gap: .5rem;
    }

    /* .buttons {
        align-self: flex-end;
    } */
</style>