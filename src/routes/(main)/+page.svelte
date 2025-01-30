<script>
    let folders = [
        { name: "General TODO" },
        { name: "Groceries" },
        { name: "Delivery app" },
    ];

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
</script>

<main>
    <h3>Note categorizer</h3>
    <div class="folders">
        {#each folders as { name }}
            <input type="text" bind:value={name}>
        {/each}
    </div>
    <div>
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
    </div>
</main>

<style>
    main {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .folders {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    h4.error {
        color: #E0283D;
    }

    @media (min-width: 500px) {
        .folders {
            flex-direction: row;
            flex-wrap: wrap;
        }

        .folders input {
            max-width: 400px;
        }
    }
</style>