<script>
    import FolderModal from '$lib/components/FolderModal.svelte';

    export let data;
    console.log(data);
    
    let folders = data.foldersData;
    let notes = data.notesData;

    let note;

    let selectedFolder = "";
    let errorMsg = "";

    const getFolder = () => {
        loading = true;
        errorMsg = "";
        fetch("../api/categorize", {
            method: "POST",
            body: JSON.stringify({
                note, folders
            }),
            headers: {"Content-Type": "application/json"}
        })
        .then(res => res.json())
        .then(folder => {
            if(folder.error) {
                loading = false;
                errorMsg = "Something went wrong, try using a VPN";
                throw new Error("Something went wrong");
            }
            console.log(folder);
            selectedFolder = folder;
            loading = false;
            note = "";
        })
        .catch(err => {
            console.log(err);
            loading = false;
            errorMsg = "Something went wrong, try using a VPN";
        })
    }

    let loading = false;

    let noteInput = "";
    const createNote = () => {
        const newNote = { content: noteInput, folderID: 1 };
        fetch("../api/note", {
            method: "POST",
            body: JSON.stringify(newNote),
            headers: {"Content-Type": "application/json"}
        })
        .then(res => res.json())
        .then(json => {
            console.log(json);
            newNote.noteID = json.noteID;
            notes = [...notes, newNote];
        })
    }

    let folderInput = "";
    const createFolder = () => {
        const newFolder = { name: folderInput };
        fetch("../api/folder", {
            method: "POST",
            body: JSON.stringify(newFolder),
            headers: {"Content-Type": "application/json"}
        })
        .then(res => res.json())
        .then(json => {
            console.log(json);
            newFolder.folderID = json.folderID;
            folders = [...folders, newFolder];
        })
    }

    const deleteNote = (noteID) => {
        fetch("../api/note", {
            method: "DELETE",
            body: JSON.stringify({ noteID }),
            headers: {"Content-Type": "application/json"}
        })
        .then(res => res.json())
        .then(json => {
            console.log(json);
            notes = notes.filter(note => note.noteID != noteID);
        })
    }

    const deleteFolder = (folderID) => {
        fetch("../api/folder", {
            method: "DELETE",
            body: JSON.stringify({ folderID }),
            headers: {"Content-Type": "application/json"}
        })
        .then(res => res.json())
        .then(json => {
            console.log(json);
            folders = folders.filter(folder => folder.folderID != folderID);
        })
    }

    let showFolderModal = false;
    let selectedFolderID;
</script>

<FolderModal bind:show={showFolderModal} name={folders[0]?.name} bind:notes={notes} noteClickFunction={deleteNote} folderDeleteFunction={() => {
    deleteFolder(selectedFolderID);
    showFolderModal = false;
}} />

<main>
    <div class="top">
        <h3>Note categorizer</h3>
        <a href="/logout"><button>Logout</button></a>
    </div>
    <p>You can click on a folder or note to delete</p>
    <div class="folders">
        <p>Folders</p>
        {#each folders as { name, folderID }}
            <button on:click={() => {
                showFolderModal = true;
                selectedFolderID = folderID;
            }}>{name}</button>
            {:else}
                <p>No folders</p>
        {/each}
    </div>
    <div class="notes">
        <p>Notes</p>
        {#each notes as { content, noteID }}
            <button on:click={() => deleteNote(noteID)}>{content}</button>
            {:else}
                <p>No notes</p>
        {/each}
    </div>
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
    <!-- <div>
        <input bind:value={note} type="text" placeholder="Type a new note...">
        <button on:click={getFolder}>Send</button>
    </div>
    <div class="result">
        {#if loading}
        <h4>Choosing folder...</h4>
        {:else if selectedFolder}
        <h4>Folder: {selectedFolder}</h4>
        {:else if errorMsg}
        <h4 class="error">{errorMsg}</h4>
        {/if}
    </div> -->
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

    h4.error {
        color: #E0283D;
    }

</style>