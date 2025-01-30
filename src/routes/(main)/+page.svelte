<script>
    let folders = [
        { name: "General TODO" },
        { name: "Groceries" },
        { name: "Delivery app" },
    ];

    let note;

    const getFolder = async () => {
        const folderRes = await fetch("../api/categorize", {
            method: "POST",
            body: JSON.stringify({
                note, folders
            }),
            headers: {"Content-Type": "application/json"}
        });
        const folder = await folderRes.json();
        return folder;
    }

    let showResult = false;
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
        <button on:click={() => showResult = true}>Send</button>
    </div>
    {#if showResult}
    {#await getFolder()}
        <div>
            <h4>Choosing folder...</h4>
        </div>
    {:then folderName}
        <div>
            <h4>Folder: {folderName}</h4>
        </div>
    {:catch error}
        <div>
            <p>An error occured</p>
        </div>
    {/await}
    {/if}
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