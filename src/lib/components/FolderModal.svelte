<script>
	import { fade, fly } from "svelte/transition";

    export let name = "My Folder", notes = [];
    export let noteClickFunction = (noteID) => {};
    export let folderDeleteFunction = () => {};
    export let show = false, closableFromWrapper = true;

    const formatDate = (ms) => {
        const date = new Date(ms);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }
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
            {#each notes as { content, noteID, created_at }}
                <button on:click={() => noteClickFunction(noteID)}>
                    <p>{content}</p>
                    <p class="fs-xs date">{formatDate(created_at)}</p>
                </button>
            {/each}
        </div>
        <div class="controls">
            <button on:click={() => show = false }>Close</button>
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
        padding-bottom: 0;
        background-color: black;

        max-height: calc(100vh - 2rem);
        max-height: calc(100svh - 2rem);
        overflow: auto;

        position: relative;
    }

    .controls {
        position: sticky;
        bottom: 0;
        background-color: black;
        padding-block: .5rem;
        display: flex;
        justify-content: space-between;
    }

    .notes-in-folder {
        display: flex;
        flex-direction: column;
        gap: .5rem;
    }

    .date {
        color: #a1a1a1aa;
    }

    /* .buttons {
        align-self: flex-end;
    } */
</style>