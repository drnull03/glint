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
</script>

<FolderModal bind:show={showFolderModal} name={folders[0]?.name} notes={notes.filter(note => note.folderID == selectedFolderID)} noteClickFunction={deleteNote} folderDeleteFunction={() => {
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
        <a href="/logout"><button>Logout</button></a>
    </div>
    <p>You can click on a folder or note to delete</p>
    <div class="folders">
        <p>Folders</p>
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
        <p>Adding a note</p>
        <input bind:value={noteInput} type="text" placeholder="Create a new note...">
        <button on:click={createNote}>Send</button>
    </div>
    <div>
        <p>Adding a folder</p>
        <input bind:value={folderInput} type="text" placeholder="Create a new folder...">
        <button on:click={createFolder}>Send</button>
    </div>
</main>

<style>
    main {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
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