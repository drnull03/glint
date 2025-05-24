<script>
    import trashIconSrc from "$lib/assets/icons/trash.svg";
    import { fade, fly } from "svelte/transition";
    import Editor from "./Editor.svelte";

    export let show = false;
    export let spaces = [];
    export let baseURL = null, token = null;
    let editor;

    const addSpark = (spaceID, spark) => {
        fetch(`${baseURL || ".."}/api/space/sparks`, {
            method: "PATCH",
            headers: baseURL ? {"Content-Type": "application/json", "Authorization": `Bearer ${token}`} : {"Content-Type": "application/json"},
            body: JSON.stringify({
                spaceID,
                sparks: [spark]
            })
        })
        .then(res => res.json())
        .then(json => {
            console.log(json);
            if(!json?.status) {
                return;
            }

            if(json.suggestion) {
                const editedSpace = spaces.find(s => s.spaceID == spaceID);
                editedSpace.suggestion = json.suggestion;
                spaces = spaces;
            }
        })

        const editedSpace = spaces.find(s => s.spaceID == spaceID);
        editedSpace.sparks = [...editedSpace.sparks, spark];
        spaces = spaces;
    }

    const updateSparks = (spaceID, sparks) => {
        let oneLeft = false;
        if(sparks.length === 1) {
            oneLeft = true;
        } else if(sparks.length === 0) {
            spaces.find(s => s.spaceID == spaceID).suggestion = null;
            spaces = spaces;
        }
        fetch(`${baseURL || ".."}/api/space/sparks`, {
            method: "PATCH",
            headers: baseURL ? {"Content-Type": "application/json", "Authorization": `Bearer ${token}`} : {"Content-Type": "application/json"},
            body: JSON.stringify({
                spaceID,
                sparks,
                oneLeft
            })
        })
        .then(res => res.json())
        .then(json => {
            console.log(json);
            if(!json?.status) {
                return;
            }

            if(json.suggestion) {
                const editedSpace = spaces.find(s => s.spaceID == spaceID);
                editedSpace.suggestion = json.suggestion;
                spaces = spaces;
            }
        })

        const editedSpace = spaces.find(s => s.spaceID == spaceID).sparks = sparks;
        if(!sparks.length) {
            editedSpace.suggestion = null;
        }
        spaces = spaces;
    }

    const deleteSpark = (spaceID, spark) => {
        const thisSpace = spaces.find(s => s.spaceID == spaceID);
        const sparksInSpace = thisSpace.sparks;
        thisSpace.sparks = sparksInSpace.filter(s => s != spark);
        spaces = spaces;
        updateSparks(spaceID, thisSpace.sparks);
    }

    function getAllMentions(editor) {
        const mentions = [];

        editor.state.doc.descendants((node) => {
            if (node.type.name === 'mention') {
                mentions.push(node.attrs);
            }
        });

        return mentions;
    }

</script>

{#if show}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="spark wrapper" on:click={(e) => {
    const target = e.target;
    if(target.classList.contains("wrapper")) {show = false}
}} transition:fade={{ duration: 50 }}>
    <div transition:fly={{ y: 100 }} class="main">
        <h3>Sparks ✨</h3>
        {#key spaces}
        <Editor bind:editor mentionList={spaces.map(space => {
            return { spaceID: space.spaceID, name: space.name }
        })} />
        {/key}
        <button on:click={() => {
            const sparks = getAllMentions(editor);
            sparks.forEach(s => {
                addSpark(s.id, editor.getText());
            })
        }}>Capture</button>
        {#if spaces.find(s => s.sparks.length)}
        <p class="previously bold fs-xs">Captured Sparks</p>
        <div class="sparks fs-xs">
            {#each spaces as space}
                {#if space.sparks?.length}
                    <div class="space-group">
                        <div class="space-header">
                            <h4>{space.name}</h4>
                        </div>
                        <ul class="sparks-list">
                            {#each space.sparks as spark}
                                <li>
                                    <div class="spark-content">{spark}</div>
                                    <button 
                                        class="delete-btn" 
                                        on:click={() => deleteSpark(space.spaceID, spark)}
                                        aria-label="Delete spark"
                                    ><img src="{trashIconSrc}" alt="trash"></button>
                                </li>
                            {/each}
                        </ul>
                    </div>
                {/if}
            {/each}
        </div>
        {/if}
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
        width: 350px;
        margin-inline: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
        background-color: black;
        border: 1px solid #a1a1a166;
    }

    .sparks {
        max-height: 300px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .previously {
        margin-top: 1rem;
    }

    .space-group {
        border: 1px solid #a1a1a166;
        padding: 1rem;
    }

    .space-header {
        margin-bottom: 1rem;
    }

    .space-header h4 {
        color: white;
    }

    .sparks-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .sparks-list li {
        display: flex;
        gap: 1rem;
        justify-content: space-between;
        align-items: center;
    }

    .spark-content {
        word-break: break-word;
    }

    .delete-btn {
        min-width: fit-content;
    }
</style>