<script>
    import toggleSidebarIconSrc from "$lib/assets/icons/toggle-sidebar-icon.svg";
    import addIconSrc from "$lib/assets/icons/add-icon.svg";
    import Saving from '$lib/components/Saving.svelte';
    import { fly } from "svelte/transition";
    import Editor from "$lib/components/Editor.svelte";
    import Modal from "$lib/components/Modal.svelte";

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

    let editorAlignment = "left";

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
        console.log("Outer");
        if(editor) {
            console.log("Inner");
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
        fetch("../api/space/update", {
            method: "PATCH",
            body: JSON.stringify({
                content: editor.getJSON(),
                spaceID: activeSpaceID,
                alignRight: spaces.find(s => s.spaceID == activeSpaceID).alignRight
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

    $: console.log(editorAlignment);
</script>

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
            <button on:click={() => activeSpaceID = space.spaceID} class="space fs-xs">
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
            <div class="editor" dir="{editorAlignment == "left" ? "ltr" : "rtl"}">
                <Editor onupdate={() => {
                    if(activeSpaceID) {
                        const activeSpace = spaces.find(s => s.spaceID == activeSpaceID);
                        activeSpace.content = !editor.isEmpty ? editor.getJSON() : "";
                        if(editorAlignment == "right") {
                            activeSpace.alignRight = true;
                        } else {
                            activeSpace.alignRight = false;
                        }
                        spaces = spaces;
    
                        clearTimeout(debounceTimer);
                        debounceTimer = setTimeout(() => {
                            updateSpace();
                        }, 1000);
                    }
                    adjustScrollForCaret();
                }} initContent={spaces.find(s => s.spaceID == activeSpaceID).content || ""} bind:editor mentionList={spaces.map(space => space.name)} bind:alignment={editorAlignment} />
            </div>
        </div> 
        <div class="space-controls fs-xs">
            <p>{formatDate(spaces.find(s => s.spaceID == activeSpaceID).created_at)}</p>
            <button on:click={() => showDeleteModal = true}>Delete</button>
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
        height: 100%;
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
    }

    button.space {
        text-align: start;
    }

    button.space:not(:last-of-type) {
        margin-bottom: .5rem;
    }

    .editor-container {
        padding: .5rem;
        padding-top: 5rem;
        padding-bottom: 15rem;
    }

    .editor,
    .space-controls {
        max-width: 700px;
        margin-inline: auto;
    }

    .space-controls {
        padding-bottom: 2rem;
    }

    /* h4.error {
        color: #E0283D;
    } */
</style>