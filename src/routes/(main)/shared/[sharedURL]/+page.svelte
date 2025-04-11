<script>
    import Editor from '$lib/components/Editor.svelte';
    import { onMount } from 'svelte';

    export let data;

    const { spaceData, userData } = data;

    let editor;
    onMount(() => {
        editor.setEditable(false);
    })
    
    const formatDate = (ms) => {
        const date = new Date(ms);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }
</script>

<svelte:head>
    <title>{spaceData?.name || "Space not found"} | Glint</title>
    <meta name="description" content="This is a shared Space by {userData?.name} within Glint" />
    <meta property="og:title" content="{spaceData?.name} | Glint" />
    <meta property="og:type" content="article" />
    <meta property="og:description" content="This is a shared Space by {userData?.name} within Glint" />
</svelte:head>

<main>
    <div class="top">
        <div>
            <h3><a href="/">Glint</a> | {spaceData?.name || "Untitled"}</h3>
            <p class="space-date fs-xs">{formatDate(spaceData?.created_at) || ""}</p>
        </div>
        <p>Shared Space by {userData?.name || "User not found"}</p>
    </div>
    <div class="editor" dir="{spaceData?.alignRight ? "rtl" : "ltr"}">
    {#if spaceData}
        <Editor initContent={spaceData.content || ""} bind:editor />
    {:else}
    <div class="space-not-found">
        <h3>Error 404 | Space not found</h3>
        <p>This Space either doesn't exist or has been deleted</p>
        <a href="/"><button>Go back</button></a>
    </div>
    {/if}
    </div>
</main>

<style>
    main {
        padding-inline: 1rem;
    }

    .editor {
        max-width: 700px;
        margin-inline: auto;
        padding-block: 3rem;
    }

    .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: sticky;
        top: 0;
        padding-block: 1rem;
        background-color: black;
        z-index: 2;
    }

    .top > div:has(.space-date) {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .space-not-found {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: start;
    }
</style>