<script>
    import toggleSidebarIconSrc from "$lib/assets/icons/toggle-sidebar-icon.svg";
    import addIconSrc from "$lib/assets/icons/add-icon.svg";
    import sparkIconSrc from "$lib/assets/icons/spark.svg";
    import Saving from '$lib/components/Saving.svelte';
    import { fly } from "svelte/transition";
    import Editor from "$lib/components/Editor.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import SparkModal from "$lib/components/SparkModal.svelte";
    import { onMount } from "svelte";

    export let data;

    let isSaving = false;

    const formatDate = (ms) => {
        const date = new Date(ms);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    let { spaces } = data;

    let isSidebarActive = false;
    let isNewSpaceInputActive = false;

    let editor;

    let spaceName;
    let newSpaceName;

    let activeSpaceID;

    const getSpaces = () => {
        fetch("../api/space")
        .then(res => res.json())
        .then(json => {
            console.log(json);
            spaces = json.data;
        })
    }

    const createSpace = () => {
        if(!newSpaceName) {
            alert("Please choose a name for your new Space");
            return;
        }
        isSaving = true;
        fetch("../api/space", {
            method: "POST",
            body: JSON.stringify({
                name: newSpaceName
            }),
            headers: {"Content-Type": "applcation/json"}
        })
        .then(res => res.json())
        .then(json => {
            isSaving = false;
            console.log(json);
            spaces.push({
                spaceID: json.data.spaceID,
                name: newSpaceName,
                created_at: new Date().getTime(),
                content: ""
            });
            spaces = spaces;
            newSpaceName = "";
            isNewSpaceInputActive = false;
            activeSpaceID = json.data.spaceID;
        })
    }

    const handleActiveSpaceChange = () => {
        if(editor) {
            editor.commands.setContent(spaces.find(s => s.spaceID == activeSpaceID).content);
        }
    }

    // const handleActiveSpaceClear = () => {
    //     console.log("Clearing editor");
    //     if(editor) {
    //         editor.commands.clearContent();
    //     }
    // }

    $: if(activeSpaceID) {
        handleActiveSpaceChange();
    } else {
        // handleActiveSpaceClear();
    }

    const updateSpace = () => {
        isSaving = true;
        fetch("../api/space", {
            method: "PATCH",
            body: JSON.stringify({
                content: editor.getJSON(),
                spaceID: activeSpaceID
            }),
            headers: {"Content-Type": "applcation/json"}
        })
        .then(res => res.json())
        .then(json => {
            isSaving = false;
            console.log(json);
        })
    }

    let debounceTimer;
    
    const adjustScrollForCaret = (padding = 400) => {
        const sel = document.getSelection();
        if (!sel.rangeCount) return;

        const range = sel.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const distanceFromBottom = window.innerHeight - rect.bottom;

        if (distanceFromBottom < padding) {
            const offset = padding - distanceFromBottom;
            window.scrollBy({ top: offset, behavior: "smooth" });
        }
    };

    let showTeamMembers = false;

    const getTeamMembers = async () => {
        const teamRes = await fetch("../api/team/members");
        const teamJSON = await teamRes.json();

        console.log(teamJSON);

        if(!teamJSON.status) {
            return [];
        }

        return teamJSON.data;
    }

    const forwardSpace = userID => {
        isSaving = true;
        fetch("../api/team/forward", {
            method: "POST",
            body: JSON.stringify({
                userID, spaceID: activeSpaceID
            }),
            headers: {"Content-Type": "applcation/json"}
        })
        .then(res => res.json())
        .then(json => {
            isSaving = false;
            console.log(json);
            showTeamMembers = false;
        })
    }

    let showDeleteModal = false;

    const deleteSpace = () => {
        isSaving = true;
        fetch("../api/space", {
            method: "DELETE",
            body: JSON.stringify({ spaceID: activeSpaceID }),
            headers: {"Content-Type": "applcation/json"}
        })
        .then(res => res.json())
        .then(json => {
            isSaving = false;
            console.log(json);
            if(!json.status) {
                return;
            }
            
            spaces = spaces.filter(s => s.spaceID != activeSpaceID);
            activeSpaceID = null;
            showDeleteModal = false;
        })
    }

    const shareSpace = () => {
        isSaving = true;
        fetch("../api/space/shared", {
            method: "PATCH",
            body: JSON.stringify({
                spaceID: activeSpaceID
            }),
            headers: {"Content-Type": "applcation/json"}
        })
        .then(res => res.json())
        .then(json => {
            console.log(json);
            isSaving = false;
            spaces.find(s => s.spaceID == activeSpaceID).sharedURL = json.data;
            spaces = spaces;
        })
    }

    let showSparkModal = false;

    const mergeSuggestion = (suggestion) => {
        editor.commands.focus('end');
        editor.commands.insertContent(suggestion);
        updateSpace();
        declineSuggestion(activeSpaceID);
        deleteSuggestionLocally(activeSpaceID)
    }

    const deleteSuggestionLocally = spaceID => {
        spaces.find(s => s.spaceID == spaceID).suggestion = null;
        spaces = spaces;
    }

    const declineSuggestion = spaceID => {
        isSaving = true;
        fetch("../api/space/suggestion/delete", {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ spaceID })
        })
        .then(res => res.json())
        .then(json => {
            isSaving = false;
            if(!json?.status) {
                return;
            }

            deleteSuggestionLocally(spaceID);
        })
    }

    // Disabling Sparks for Diaa
    let disableSparks = false;
    onMount(() => {
        document.addEventListener('keydown', e => {
            if(e.ctrlKey && e.altKey && e.shiftKey && e.key === 'D') {
                disableSparks = !disableSparks;
            }
        })
    })
</script>

<svelte:head>
    <title>Glint | Home</title>
</svelte:head>

<SparkModal bind:show={showSparkModal} bind:spaces />

<Saving bind:show={isSaving} text={"Processing..."} />

<main class="fs-300">
    <div class="sidebar" class:active={isSidebarActive}>
        <div class="controls">
            <div>
                <h3>My Spaces</h3>
                <button on:click={() => isNewSpaceInputActive = !isNewSpaceInputActive}><img src="{addIconSrc}" alt="add"></button>
            </div>
            {#if isNewSpaceInputActive}
            <input bind:value={newSpaceName} on:keydown={e => {
                if(e.key == "Enter") {
                    createSpace();
                }
            }} transition:fly={{ y: -100, duration: 200 }} type="text" placeholder="New space name">
            {/if}
        </div>
        <div class="spaces">
            {#each spaces as space}
            <button on:click={() => {
                if(activeSpaceID == space.spaceID) {
                    activeSpaceID = null;
                    return;
                }
                activeSpaceID = space.spaceID;
            }} class="space fs-xs">
                <p class="bold">{space.name}</p>
                {#if space.forwarded}
                    <p>Forwarded by {space.forwarded}</p>
                {/if}
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
            <!-- Bind the input below to the name of the active space ID -->
            <!-- <input type="text" placeholder="Space name..."> -->
            <p class="bold">{spaces.find(s => s.spaceID == activeSpaceID)?.name || "No space is selected"}</p>
            <div>
                <p>{data.email}</p>
                <a class="button" rel="external" href="/logout">Logout</a>
            </div>
        </div>
        {#if activeSpaceID}
        <Modal bind:show={showDeleteModal} title={"Delete Space?"} content={"This Space will be deleted forever, are you sure?"} acceptBtnContent={"Delete"} declineBtnContent={"Cancel"} acceptFunction={deleteSpace} />
        <div class="editor-container">
            <div class="editor">
                <Editor onupdate={() => {
                    if(activeSpaceID) {
                        const activeSpace = spaces.find(s => s.spaceID == activeSpaceID);
                        activeSpace.content = !editor.isEmpty ? editor.getJSON() : "";
                        spaces = spaces;
    
                        clearTimeout(debounceTimer);
                        debounceTimer = setTimeout(() => {
                            updateSpace();
                        }, 1000);
                    }
                    adjustScrollForCaret();
                }} initContent={spaces.find(s => s.spaceID == activeSpaceID).content || ""} bind:editor mentionList={spaces.map(space => {
                    return { spaceID: space.spaceID, name: space.name }
                })} />
            </div>
            {#if spaces.find(s => s.spaceID == activeSpaceID)?.suggestion}
            <div class="spark-suggestion">
                <div class="suggestion-controls">
                    <p>Suggested merge from your Sparks</p>
                    <button on:click={() => mergeSuggestion(spaces.find(s => s.spaceID == activeSpaceID).suggestion)}>Merge</button>
                    <button on:click={() => declineSuggestion(activeSpaceID)}>Decline</button>
                </div>
                {#key spaces.find(s => s.spaceID == activeSpaceID).suggestion}
                <div class="suggestion-content">
                    <Editor initContent={spaces.find(s => s.spaceID == activeSpaceID).suggestion} readOnly />
                </div>
                {/key}
            </div>
            {/if}
        </div>
        <div class="space-controls fs-xs">
            <p>{formatDate(spaces.find(s => s.spaceID == activeSpaceID).created_at)}</p>
            <button on:click={() => showDeleteModal = true}>Delete</button>
            {#if spaces.find(s => s.spaceID == activeSpaceID).sharedURL}
                <p>Shared Space URL: <a href="/shared/{spaces.find(s => s.spaceID == activeSpaceID).sharedURL}" target="_blank">{spaces.find(s => s.spaceID == activeSpaceID).sharedURL}</a></p>
            {:else}
            <button on:click={shareSpace}>Share</button>
            {/if}
            {#if !showTeamMembers}
            <button on:click={() => showTeamMembers = true}>Forward</button>
            {:else}
            {#await getTeamMembers()}
            <p>Getting team members...</p>
            {:then members}
            {#each members as member}
                <button on:click={() => forwardSpace(member.userID)}>Send to {member.name}</button>
            {:else}
                <p>No team members available</p>
            {/each}
            {:catch error}
                <p>Couldn't load teams, try again later</p>
            {/await}
            <button on:click={() => showTeamMembers = false}>Cancel</button>
            {/if}
        </div>
        {:else}
        <div class="no-selected-space">
        <p>There's no selected Space, Select a Space or create a new one</p>
        {#if !isSidebarActive}
        <button on:click={() => isSidebarActive = true}>Open side bar</button>
        {/if}
        </div>
        {/if}
    </div>

    {#if !disableSparks}
    <button class="spark-btn" on:click={() => showSparkModal = true}>
        <img src="{sparkIconSrc}" alt="spark">
    </button>
    {/if}
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

    .top > div {
        display: flex;
        gap: 1rem;
        align-items: center;
    }
    
    .no-selected-space {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: center;
        justify-content: center;
        height: 100svh;
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
        display: flex;
        flex-direction: column;
        gap: .5rem;
    }

    .spaces button {
        border: none;
        text-align: start;
    }

    .editor-container {
        padding: .5rem;
        padding-top: 5rem;
        padding-bottom: 15rem;
    }

    .editor,
    .space-controls,
    .spark-suggestion {
        max-width: 700px;
        margin-inline: auto;
    }

    .space-controls {
        padding-bottom: 2rem;
    }

    .spark-btn {
        position: fixed;
        bottom: 1rem;
        right: 1rem;
    }

    .spark-suggestion {
        border-top: 1px solid #a1a1a166;
    }

    .suggestion-controls {
        display: flex;
        gap: .5rem;
        align-items: center;
        padding-block: 1rem;
    }

    .suggestion-content {
        opacity: .6;
    }

    /* h4.error {
        color: #E0283D;
    } */
</style>