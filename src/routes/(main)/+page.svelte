<script>
    import toggleSidebarIconSrc from "$lib/assets/icons/toggle-sidebar-icon.svg";
    import addIconSrc from "$lib/assets/icons/add-icon.svg";
    import FolderModal from '$lib/components/FolderModal.svelte';
    import Saving from '$lib/components/Saving.svelte';
    import { onMount } from 'svelte';
    import { fly } from "svelte/transition";
    import Editor from "$lib/components/Editor.svelte";

    // export let data;

    let data = {
        "email": "zain@gmail.com"
    }

    const createNote = () => {
        isSaving = true;
        if(!folders.length) {
            isSaving = false;
            alert("You must have at least one folder");
            return;
        }
        const newNote = { content: noteInput };
        fetch("../api/note", {
            method: "POST",
            body: JSON.stringify(newNote),
            headers: {"Content-Type": "application/json"}
        })
        .then(res => res.json())
        .then(json => {
            isSaving = false;
            console.log(json);
            if(json.newFolder) {
                newNote.noteID = json.noteID;
                newNote.folderID = json.newFolder.folderID;
                notes.push(newNote);
                notes = notes;
                noteInput = "";
                folders = [...folders, json.newFolder];
                lightUpFolder(json.newFolder.folderID);
            }

            else {
                newNote.noteID = json.noteID;
                newNote.folderID = json.selectedFolderID;
                notes.push(newNote);
                notes = notes;
                noteInput = "";
                lightUpFolder(json.selectedFolderID);
            }
        })
    }
    
    const createFolder = () => {
        isSaving = true;
        const newFolder = { name: folderInput };
        fetch("../api/folder", {
            method: "POST",
            body: JSON.stringify(newFolder),
            headers: {"Content-Type": "application/json"}
        })
        .then(res => res.json())
        .then(json => {
            isSaving = false;
            console.log(json);
            newFolder.folderID = json.folderID;
            folders = [...folders, newFolder];
            folderInput = "";
        })
    }

    const deleteNote = (noteID) => {
        isSaving = true;
        fetch("../api/note", {
            method: "DELETE",
            body: JSON.stringify({ noteID }),
            headers: {"Content-Type": "application/json"}
        })
        .then(res => res.json())
        .then(json => {
            isSaving = false;
            console.log(json);
            notes = notes.filter(note => note.noteID != noteID);
        })
    }

    const deleteFolder = (folderID) => {
        isSaving = true;
        fetch("../api/folder", {
            method: "DELETE",
            body: JSON.stringify({ folderID }),
            headers: {"Content-Type": "application/json"}
        })
        .then(res => res.json())
        .then(json => {
            isSaving = false;
            console.log(json);
            folders = folders.filter(folder => folder.folderID != folderID);
            notes = notes.filter(note => note.folderID != folderID);
        })
    }

    let isSaving = false;

    const sendSuggestion = () => {
        isSaving = true;
        fetch("../api/suggestion", {
            method: "POST",
            body: JSON.stringify({ content: suggestionInput }),
            headers: {"Content-Type": "application/json"}
        })
        .then(res => res.json())
        .then(json => {
            isSaving = false;
            console.log(json);
            suggestionInput = "";
        })
    }

    const lightUpFolder = (folderID) => {
        folders.find(folder => folder.folderID == folderID).lightup = true;
        setTimeout(() => {
            folders.find(folder => folder.folderID == folderID).lightup = false;
            folders = folders;
        }, 750);
    }

    const formatDate = (ms) => {
        const date = new Date(ms);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    let folders = [
        {
            name: "Tasks",
            content: {
                "type": "doc",
                "content": [
                    {
                        "type": "heading",
                        "attrs": {
                            "textAlign": null,
                            "level": 1
                        },
                        "content": [
                            {
                                "type": "text",
                                "text": "50 types of washing machines"
                            }
                        ]
                    },
                    {
                        "type": "paragraph",
                        "attrs": {
                            "textAlign": null
                        },
                        "content": [
                            {
                                "type": "text",
                                "text": "Here're 50 useful machines"
                            }
                        ]
                    },
                    {
                        "type": "bulletList",
                        "content": [
                            {
                                "type": "listItem",
                                "content": [
                                    {
                                        "type": "paragraph",
                                        "attrs": {
                                            "textAlign": null
                                        },
                                        "content": [
                                            {
                                                "type": "text",
                                                "text": "The big one"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "type": "listItem",
                                "content": [
                                    {
                                        "type": "paragraph",
                                        "attrs": {
                                            "textAlign": null
                                        },
                                        "content": [
                                            {
                                                "type": "text",
                                                "text": "The smaller one"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "type": "listItem",
                                "content": [
                                    {
                                        "type": "paragraph",
                                        "attrs": {
                                            "textAlign": null
                                        },
                                        "content": [
                                            {
                                                "type": "text",
                                                "text": "The smallest one"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        {
            name: "Sallat",
            content: {
                "type": "doc",
                "content": [
                    {
                        "type": "paragraph",
                        "attrs": {
                            "textAlign": null
                        },
                        "content": [
                            {
                                "type": "text",
                                "text": "Fix the last bug you encountered"
                            }
                        ]
                    },
                    {
                        "type": "paragraph",
                        "attrs": {
                            "textAlign": null
                        },
                        "content": [
                            {
                                "type": "text",
                                "text": "The bug could be identified by scanning the code"
                            }
                        ]
                    }
                ]
            }
        },
        {
            name: "SaaS",
            content: {
                "type": "doc",
                "content": [
                    {
                        "type": "heading",
                        "attrs": {
                            "textAlign": null,
                            "level": 1
                        },
                        "content": [
                            {
                                "type": "text",
                                "text": "We have a lot of ideas"
                            }
                        ]
                    },
                    {
                        "type": "orderedList",
                        "attrs": {
                            "start": 1
                        },
                        "content": [
                            {
                                "type": "listItem",
                                "content": [
                                    {
                                        "type": "paragraph",
                                        "attrs": {
                                            "textAlign": null
                                        },
                                        "content": [
                                            {
                                                "type": "text",
                                                "text": "Fitness app"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "type": "listItem",
                                "content": [
                                    {
                                        "type": "paragraph",
                                        "attrs": {
                                            "textAlign": null
                                        },
                                        "content": [
                                            {
                                                "type": "text",
                                                "text": "Education"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "type": "listItem",
                                "content": [
                                    {
                                        "type": "paragraph",
                                        "attrs": {
                                            "textAlign": null
                                        },
                                        "content": [
                                            {
                                                "type": "text",
                                                "text": "Restaurants"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "paragraph",
                        "attrs": {
                            "textAlign": null
                        },
                        "content": [
                            {
                                "type": "text",
                                "text": "This should be fun"
                            }
                        ]
                    }
                ]
            }
        },
    ]

    let isSidebarActive = true;
    let isNewFolderInputActive = false;

    let editor;
</script>

<Saving bind:show={isSaving} />

<main>
    <div class="sidebar" class:active={isSidebarActive}>
        <div>
            <div>
                <h3>Folders</h3>
                <button on:click={() => isNewFolderInputActive = !isNewFolderInputActive}><img src="{addIconSrc}" alt="add"></button>
            </div>
            {#if isNewFolderInputActive}
            <input transition:fly={{ y: -100, duration: 200 }} type="text" placeholder="New folder name">
            {/if}
        </div>
        <div class="folders">
            {#each folders as folder}
                <button on:click={() => editor.commands.setContent(folder.content)} class="folder">
                    <p class="bold">{folder.name}</p>
                    <p>{folder.content.content[0].content[0].text.slice(0, 20)}...</p>
                </button>
            {/each}
        </div>
    </div>
    <div class="content">
        <div class="top">
            <button class:active={isSidebarActive} class="sidebar-toggle" on:click={() => {
                isSidebarActive = !isSidebarActive;
            }}><img src="{toggleSidebarIconSrc}" alt="toggle sidebar"></button>
            <h3>Note organizer</h3>
            <div>
                <p>{data.email}</p>
                <a class="button" rel="external" href="/logout">Logout</a>
            </div>
        </div>
        <div class="editor-container">
            <div class="editor">
                <Editor bind:editor mentionList={folders.map(folder => folder.name)} />
            </div>
        </div>
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
        top: 0;
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
        padding: .5rem;

        transition: all 150ms ease;
        padding-inline: 0;
        overflow: hidden;
        max-width: 0;
        opacity: 0;
    }

    .sidebar.active {
        opacity: 1;
        padding-inline: .5rem;
        max-width: 200px;
    }

    .sidebar > div:first-of-type {
        display: flex;
        flex-direction: column;
        gap: .5rem;
    }

    .sidebar > div:first-of-type > div {
        display: flex;
        justify-content: space-between;
        gap: .5rem;
    }

    .folders {
        margin-block-start: .5rem;
    }

    button.folder {
        text-align: start;
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