<script>
    import FolderModal from '$lib/components/FolderModal.svelte';
    import Saving from '$lib/components/Saving.svelte';

    export let data;
    
    let folders = data.foldersData;
    let notes = data.notesData;

    let noteInput = "";
    const createNote = () => {
        isSaving = true;
        if(!folders.length) {
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
            newNote.noteID = json.noteID;
            newNote.folderID = json.selectedFolderID;
            notes.push(newNote);
            notes = notes;
            noteInput = "";
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
        })
    }

    // Browsing folders
    let showFolderModal = false;
    let selectedFolderID;

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
        {#each folders as { name, folderID }}
            <button on:click={() => {
                selectedFolderID = folderID;
                showFolderModal = true;
            }}>{name} - {notes.filter(note => note.folderID == folderID).length || 0}</button>
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

    .folders, .notes {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .folders, .notes button {
        max-width: max-content;
    }

    /* h4.error {
        color: #E0283D;
    } */
</style>