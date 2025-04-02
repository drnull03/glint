<script>
    import toggleSidebarIconSrc from "$lib/assets/icons/toggle-sidebar-icon.svg";
    import addIconSrc from "$lib/assets/icons/add-icon.svg";
    import Saving from '$lib/components/Saving.svelte';
    import { fly } from "svelte/transition";
    import Editor from "$lib/components/Editor.svelte";

    let data = {
        "email": "zain@gmail.com"
    }

    let isSaving = false;

    const formatDate = (ms) => {
        const date = new Date(ms);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    let spaces = [];

    let isSidebarActive = true;
    let isNewSpaceInputActive = false;

    let editor;

    let spaceName = "New Space";

    $: if(!spaceName) {
        spaceName = "New Space"
    }

    const getSpaces = () => {
        fetch("../api/space")
        .then(res => res.json())
        .then(json => {
            console.log(json);
        })
    }
</script>

<Saving bind:show={isSaving} />

<main class="fs-300">
    <div class="sidebar" class:active={isSidebarActive}>
        <div class="controls">
            <div>
                <h3>My Spaces</h3>
                <button on:click={() => isNewSpaceInputActive = !isNewSpaceInputActive}><img src="{addIconSrc}" alt="add"></button>
            </div>
            {#if isNewSpaceInputActive}
            <input transition:fly={{ y: -100, duration: 200 }} type="text" placeholder="New space name">
            {/if}
        </div>
        <div class="spaces">
            {#each spaces as space}
                <button on:click={() => {
                    editor.commands.setContent(space.content)
                    spaceName = space.name;
                }} class="space fs-xs">
                    <p class="bold">{space.name}</p>
                    <p>{space.content.content[0].content[0].text.slice(0, 30)}...</p>
                </button>
                {:else}
                <p>Empty</p>
            {/each}
        </div>
    </div>
    <div class="content">
        <div class="top">
            <button class:active={isSidebarActive} class="sidebar-toggle" on:click={() => {
                isSidebarActive = !isSidebarActive;
            }}><img src="{toggleSidebarIconSrc}" alt="toggle sidebar"></button>
            <h3 contenteditable="" bind:textContent={spaceName} on:keydown={e => {
                if(e.key == "Enter") {
                    e.preventDefault()
                    console.log("Hello");
                }
            }}></h3>
            <div>
                <p>{data.email}</p>
                <a class="button" rel="external" href="/logout">Logout</a>
            </div>
        </div>
        <div class="editor-container">
            <div class="editor">
                <Editor bind:editor mentionList={spaces.map(space => space.name)} />
            </div>
        </div>
        <button on:click={getSpaces}>Get spaces</button>
    </div>
</main>

<style>
    main {
        min-height: 100vh;
        min-height: 100svh;
        display: flex;
    }

    .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: .5rem;
        padding: .5rem;
        background-color: black;
        border-bottom: 1px solid #a1a1a166;

        position: sticky;
        z-index: 1;
        top: 0;
    }

    .top h3 {
        padding-inline: 1rem;
    }

    .top > div {
        display: flex;
        gap: 1rem;
        align-items: center;
    }

    .sidebar-toggle {
        border: 0;
        padding: .2rem;
    }

    .sidebar-toggle img {
        width: 30px;
        transition: rotate 150ms ease;
        rotate: -180deg;
    }

    .sidebar-toggle.active img {
        rotate: 0deg;
    }

    .content {
        flex: 1;
        /* border: 1px solid red; */
    }

    .sidebar {
        position: sticky;
        top: 0;
        height: 100vh;
        height: 100svh;
        /* border: 1px solid red; */
        border-right: 1px solid #a1a1a166;
        padding-bottom: .5rem;

        transition: all 150ms ease;
        padding-inline: 0;
        overflow-x: hidden;
        overflow-y: auto;
        max-width: 0;
        translate: -500% 0;
        opacity: 0;
    }

    .sidebar.active {
        opacity: 1;
        translate: 0 0;
        padding-inline: .5rem;
        max-width: 200px;
    }

    .sidebar .controls {
        display: flex;
        flex-direction: column;
        gap: .5rem;
        position: sticky;
        top: 0;
        background-color: black;
        padding-block: .5rem;
    }

    .sidebar .controls > div {
        display: flex;
        justify-content: space-between;
        gap: .5rem;
    }

    .spaces {
        margin-block-start: .5rem;
    }

    button.space {
        text-align: start;
    }

    button.space:not(:last-of-type) {
        margin-bottom: .5rem;
    }

    .editor-container {
        padding: .5rem;
    }

    .editor {
        max-width: 700px;
        margin-inline: auto;
    }

    /* h4.error {
        color: #E0283D;
    } */
</style>