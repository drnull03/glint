<script>
    import Editor from '$lib/components/Editor.svelte';
    import { onMount } from 'svelte';

    export let data;
    console.log(data);

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

<main>
    <div class="top">
        <div>
            <h3><a href="/">Glint</a> | {spaceData.name}</h3>
            <p class="space-date fs-xs">{formatDate(spaceData.created_at)}</p>
        </div>
        <p>Shared Space by {userData.name}</p>
    </div>
    <div class="editor">
        <Editor initContent={spaceData.content || ""} bind:editor />
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
</style>