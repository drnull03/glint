<script>
    import FolderModal from '$lib/components/FolderModal.svelte';
    import Saving from '$lib/components/Saving.svelte';
    import { onMount } from 'svelte';

    export let data;
    // let data = {
    //     "notesData": [
    //         {
    //             "noteID": 71,
    //             "created_at": "2025-02-01T13:06:23.990799+00:00",
    //             "content": "Watch Brothers 2009",
    //             "folderID": 43,
    //             "userID": 1
    //         },
    //         {
    //             "noteID": 73,
    //             "created_at": "2025-02-01T14:32:50.698638+00:00",
    //             "content": "Figure out how to publish to the chrome store",
    //             "folderID": 40,
    //             "userID": 1
    //         },
    //         {
    //             "noteID": 81,
    //             "created_at": "2025-02-01T15:40:19.195592+00:00",
    //             "content": "We need a Telegram bot as a front end to the note taking app",
    //             "folderID": 47,
    //             "userID": 1
    //         },
    //         {
    //             "noteID": 88,
    //             "created_at": "2025-02-01T15:53:37.409703+00:00",
    //             "content": "Maybe use AI in the notes app to give you suggestions and ideas on executing the ideas you save in there and you'll be able to view the ideas whenever you log into your account, this could also be a paid feature",
    //             "folderID": 42,
    //             "userID": 1
    //         },
    //         {
    //             "noteID": 91,
    //             "created_at": "2025-02-01T16:01:34.074021+00:00",
    //             "content": "The notes app could behave like autocomplete showing the top three suggested folders, the new ones will have a different color as well, should be very very easy to navigate",
    //             "folderID": 48,
    //             "userID": 1
    //         },
    //         {
    //             "noteID": 92,
    //             "created_at": "2025-02-01T16:03:11.477378+00:00",
    //             "content": "Check out the new O3-mini model and investigate their API",
    //             "folderID": 47,
    //             "userID": 1
    //         },
    //         {
    //             "noteID": 96,
    //             "created_at": "2025-02-01T16:47:46.493642+00:00",
    //             "content": "We need the notes app to help with a think tank",
    //             "folderID": 48,
    //             "userID": 1
    //         },
    //         {
    //             "noteID": 97,
    //             "created_at": "2025-02-01T16:48:29.853624+00:00",
    //             "content": "Do the @folderName in the notes app",
    //             "folderID": 48,
    //             "userID": 1
    //         },
    //         {
    //             "noteID": 98,
    //             "created_at": "2025-02-01T16:49:18.317527+00:00",
    //             "content": "The notes app should be able to help with journaling",
    //             "folderID": 48,
    //             "userID": 1
    //         },
    //         {
    //             "noteID": 99,
    //             "created_at": "2025-02-01T16:49:38.738622+00:00",
    //             "content": "The notes app should be able to habit track, it could be a paid feature",
    //             "folderID": 48,
    //             "userID": 1
    //         },
    //         {
    //             "noteID": 101,
    //             "created_at": "2025-02-01T16:51:19.916537+00:00",
    //             "content": "Investigate the notes app's ability to be a community",
    //             "folderID": 48,
    //             "userID": 1
    //         },
    //         {
    //             "noteID": 102,
    //             "created_at": "2025-02-01T16:53:21.121208+00:00",
    //             "content": "The notes app could help compile resources and authors of specific materials",
    //             "folderID": 48,
    //             "userID": 1
    //         },
    //         {
    //             "noteID": 103,
    //             "created_at": "2025-02-01T16:54:47.202983+00:00",
    //             "content": "The notes app's modal should have a max height and an overflow-y of auto",
    //             "folderID": 48,
    //             "userID": 1
    //         },
    //         {
    //             "noteID": 114,
    //             "created_at": "2025-02-02T20:11:05.56729+00:00",
    //             "content": "Check out n8n, maybe host it on Sallat's VPS for testing",
    //             "folderID": 47,
    //             "userID": 1
    //         },
    //         {
    //             "noteID": 117,
    //             "created_at": "2025-02-03T02:33:22.210544+00:00",
    //             "content": "Learn prompt engineering",
    //             "folderID": 59,
    //             "userID": 1
    //         },
    //         {
    //             "noteID": 118,
    //             "created_at": "2025-02-03T04:58:12.271075+00:00",
    //             "content": "Try loading in all user data or folder-specific data to help with note context in the notes app",
    //             "folderID": 48,
    //             "userID": 1
    //         }
    //     ],
    //     "foldersData": [
    //         {
    //             "folderID": 40,
    //             "created_at": "2025-02-01T01:40:17.752735+00:00",
    //             "name": "Chrome extension",
    //             "userID": 1
    //         },
    //         {
    //             "folderID": 42,
    //             "created_at": "2025-02-01T12:12:52.683389+00:00",
    //             "name": "SaaS ideas",
    //             "userID": 1
    //         },
    //         {
    //             "folderID": 43,
    //             "created_at": "2025-02-01T13:06:23.910526+00:00",
    //             "name": "Movies to Watch",
    //             "userID": 1
    //         },
    //         {
    //             "folderID": 47,
    //             "created_at": "2025-02-01T15:40:19.143287+00:00",
    //             "name": "Telegram Bot Ideas",
    //             "userID": 1
    //         },
    //         {
    //             "folderID": 48,
    //             "created_at": "2025-02-01T16:01:33.995633+00:00",
    //             "name": "Notes App Features",
    //             "userID": 1
    //         },
    //         {
    //             "folderID": 59,
    //             "created_at": "2025-02-03T02:33:22.129158+00:00",
    //             "name": "Prompt Engineering Ideas",
    //             "userID": 1
    //         }
    //     ],
    //     "email": "zain@gmail.com"
    // }

    console.log(data);
    
    let folders = data.foldersData;
    let notes = data.notesData;

    let noteInput = "";
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
    
    let folderInput = "";
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

    // Browsing folders
    let showFolderModal = false;
    let selectedFolderID;

    onMount(() => {
        // Adding the ability to escape the modal
        document.addEventListener("keydown", e => {
            if(showFolderModal && e.key == "Escape") {
                showFolderModal = false;
            }
        })
    })

    let isSaving = false;

    let suggestionInput = "";
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
</script>

<FolderModal bind:show={showFolderModal} name={folders.find(folder => folder.folderID == selectedFolderID)?.name} notes={notes.filter(note => note.folderID == selectedFolderID)} noteClickFunction={deleteNote} folderDeleteFunction={() => {
    deleteFolder(selectedFolderID);
    showFolderModal = false;
}} />

<Saving bind:show={isSaving} />

<main>
    <div class="top">
        <div>
            <h3>Note categorizer</h3>
            <p>{data.email}</p>
        </div>
        <a rel="external" href="/logout"><button>Logout</button></a>
    </div>
    <div class="folders">
        {#each folders as folder}
            <button class:light-up={folder.lightup} on:click={() => {
                selectedFolderID = folder.folderID;
                showFolderModal = true;
            }}>
                <p>{folder.name} | {notes.filter(note => note.folderID == folder.folderID).length || 0}</p>
                <p class="fs-xs date">{formatDate(folder.created_at)}</p>
            </button>
            {:else}
                <p>No folders</p>
        {/each}
    </div>
    <!-- <div class="notes">
        <p>Notes</p>
        {#each notes as { content, noteID }}
            <button on:click={() => deleteNote(noteID)}>{content}</button>
            {:else}
                <p>No notes</p>
        {/each}
    </div> -->
    <div>
        <p>Add a note</p>
        <input bind:value={noteInput} type="text" placeholder="Create a new note...">
        <button on:click={createNote}>Add</button>
    </div>
    <div>
        <p>Add a folder</p>
        <input bind:value={folderInput} type="text" placeholder="Create a new folder...">
        <button on:click={createFolder}>Add</button>
    </div>
    <footer>
        <div>
            <p>Send a suggestion to the developer!</p>
            <div>
                <input bind:value={suggestionInput} type="text" placeholder="You could probably improve the-...">
                <button on:click={sendSuggestion}>Send</button>
            </div>
        </div>
    </footer>
</main>

<style>
    main {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        min-height: 100vh;
        min-height: 100svh;
    }

    .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    footer {
        margin-block-start: auto;
    }

    footer div:has(input) div {
        display: flex;
        gap: 1rem;
    }

    
    footer div:has(input) input {
        flex: 1;
    }

    .folders {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        max-width: max-content;
    }

    .light-up {
        background-color: white;
        color: black;
    }

    .date {
        color: #a1a1a1aa;
    }

    /* h4.error {
        color: #E0283D;
    } */
</style>