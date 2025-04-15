<script>
    import toggleSidebarIconSrc from "$lib/assets/icons/toggle-sidebar-icon.svg";
    import addIconSrc from "$lib/assets/icons/add-icon.svg";
    import Saving from '$lib/components/Saving.svelte';
    import { fly } from "svelte/transition";
    import Editor from "$lib/components/Editor.svelte";
    import Modal from "$lib/components/Modal.svelte";
    let isSaving = false;
    const formatDate = (ms) => {
        const date = new Date(ms);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    // let spaces = [];
    let spaces = [
        {
            name: "Multiple Phone Numbers",
            spaceID: 98,
            created_at: "2025-04-15 08:29:15.140858+00",
            userID: "1",
            content: {"type": "doc", "content": [{"type": "heading", "attrs": {"level": 1, "textAlign": null}, "content": [{"text": "Guide to Handling Multiple Phone Numbers in PostgreSQL", "type": "text"}]}, {"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "When expanding a database to support multiple phone numbers per customer, several approaches can be considered. Below is a breakdown of common methods, followed by a detailed comparison of the two approaches specified by the user.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 3, "textAlign": null}, "content": [{"text": "Common Approaches to Storing Multiple Phone Numbers", "type": "text"}]}, {"type": "table", "content": [{"type": "tableRow", "content": [{"type": "tableHeader", "attrs": {"colspan": 1, "rowspan": 1, "colwidth": null}, "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "Approach", "type": "text", "marks": [{"type": "bold"}]}]}]}, {"type": "tableHeader", "attrs": {"colspan": 1, "rowspan": 1, "colwidth": null}, "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "Pros", "type": "text", "marks": [{"type": "bold"}]}]}]}, {"type": "tableHeader", "attrs": {"colspan": 1, "rowspan": 1, "colwidth": null}, "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "Cons", "type": "text", "marks": [{"type": "bold"}]}]}]}]}, {"type": "tableRow", "content": [{"type": "tableCell", "attrs": {"colspan": 1, "rowspan": 1, "colwidth": null}, "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "1. Separate Table (Normalization)", "type": "text", "marks": [{"type": "bold"}]}]}]}, {"type": "tableCell", "attrs": {"colspan": 1, "rowspan": 1, "colwidth": null}, "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "- Scalable; supports unlimited numbers.", "type": "text"}, {"type": "hardBreak"}, {"text": "- Enforces data integrity via foreign keys.", "type": "text"}, {"type": "hardBreak"}, {"text": "- Easy to add metadata (e.g., phone type).", "type": "text"}]}]}, {"type": "tableCell", "attrs": {"colspan": 1, "rowspan": 1, "colwidth": null}, "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "- Requires JOINs for queries.", "type": "text"}, {"type": "hardBreak"}, {"text": "- Slightly more complex schema.", "type": "text"}]}]}]}, {"type": "tableRow", "content": [{"type": "tableCell", "attrs": {"colspan": 1, "rowspan": 1, "colwidth": null}, "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "2. Array Column", "type": "text", "marks": [{"type": "bold"}]}]}]}, {"type": "tableCell", "attrs": {"colspan": 1, "rowspan": 1, "colwidth": null}, "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "- Simple schema; all numbers in one column.", "type": "text"}, {"type": "hardBreak"}, {"text": "- Fast querying with array operators and GIN indexes.", "type": "text"}]}]}, {"type": "tableCell", "attrs": {"colspan": 1, "rowspan": 1, "colwidth": null}, "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "- No built-in way to track a \"primary\" number.", "type": "text"}, {"type": "hardBreak"}, {"text": "- Limited metadata support.", "type": "text"}]}]}]}, {"type": "tableRow", "content": [{"type": "tableCell", "attrs": {"colspan": 1, "rowspan": 1, "colwidth": null}, "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "3. JSON/B Column", "type": "text", "marks": [{"type": "bold"}]}]}]}, {"type": "tableCell", "attrs": {"colspan": 1, "rowspan": 1, "colwidth": null}, "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "- Flexible structure for metadata.", "type": "text"}, {"type": "hardBreak"}, {"text": "- Indexable with JSONB.", "type": "text"}]}]}, {"type": "tableCell", "attrs": {"colspan": 1, "rowspan": 1, "colwidth": null}, "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "- Complex query syntax.", "type": "text"}, {"type": "hardBreak"}, {"text": "- Overhead in parsing JSON.", "type": "text"}]}]}]}, {"type": "tableRow", "content": [{"type": "tableCell", "attrs": {"colspan": 1, "rowspan": 1, "colwidth": null}, "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "4. Multiple Columns", "type": "text", "marks": [{"type": "bold"}]}]}]}, {"type": "tableCell", "attrs": {"colspan": 1, "rowspan": 1, "colwidth": null}, "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "- Simple for small, fixed numbers of phones.", "type": "text"}]}]}, {"type": "tableCell", "attrs": {"colspan": 1, "rowspan": 1, "colwidth": null}, "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "- Inflexible; poor scalability.", "type": "text"}, {"type": "hardBreak"}, {"text": "- Messy query logic.", "type": "text"}]}]}]}, {"type": "tableRow", "content": [{"type": "tableCell", "attrs": {"colspan": 1, "rowspan": 1, "colwidth": null}, "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "5. Hybrid (Primary + Array)", "type": "text", "marks": [{"type": "bold"}]}]}]}, {"type": "tableCell", "attrs": {"colspan": 1, "rowspan": 1, "colwidth": null}, "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "- Clear primary number.", "type": "text"}, {"type": "hardBreak"}, {"text": "- Avoids JOINs.", "type": "text"}]}]}, {"type": "tableCell", "attrs": {"colspan": 1, "rowspan": 1, "colwidth": null}, "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "- Duplicates data.", "type": "text"}, {"type": "hardBreak"}, {"text": "- Query complexity.", "type": "text"}]}]}]}]}]},
            sharedURL: "tRTQx8FM6It7"
        }
    ];
    let isSidebarActive = false;
    let isNewSpaceInputActive = false;
    let editor;

    let spaceName;
    let newSpaceName;

    let activeSpaceID;

    const handleActiveSpaceChange = () => {
        console.log("Outer");
        if(editor) {
            console.log("Inner");
            editor.commands.setContent(spaces.find(s => s.spaceID == activeSpaceID).content);
        }
    }

    $: if(activeSpaceID) {
        handleActiveSpaceChange();
    } else {
        // handleActiveSpaceClear();
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

    let showDeleteModal = false;

    const deleteSpace = () => {}
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
                <!-- <p>{data.email}</p> -->
                <p>{"zain@gmail.com"}</p>
                <!-- <a class="button" rel="external" href="/logout">Logout</a> -->
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
                            // updateSpace();
                        }, 1000);
                    }
                    adjustScrollForCaret();
                }} initContent={spaces.find(s => s.spaceID == activeSpaceID).content || ""} bind:editor mentionList={spaces.map(space => space.name)} />
            </div>
        </div> 
        <div class="space-controls fs-xs">
            <p>{formatDate(spaces.find(s => s.spaceID == activeSpaceID).created_at)}</p>
            <!-- <button on:click={() => showDeleteModal = true}>Delete</button>
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
            {/if} -->
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
        display: flex;
        flex-direction: column;
        gap: .5rem;
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
</style>