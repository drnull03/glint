<script>
    import Editor from '$lib/components/Editor.svelte';
    import Modal from '$lib/components/Modal.svelte';

    export let data;

    const { spaceData, userData } = data;

    let editor;
    
    const formatDate = (ms) => {
        const date = new Date(ms);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    const downloadFile = (filename, content, mimeType) => {
        const blob = new Blob([content], { type: mimeType });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setTimeout(() => URL.revokeObjectURL(link.href), 100);
    }

    let showNotLoggedInModal = false;
    let showCopySuccessModal = false;

    const copyToAccount = () => {
        fetch("../../../api/space/shared/copy", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ spaceID: spaceData.spaceID })
        })
        .then(res => res.json())
        .then(json => {
            console.log(json);
            if(!json.status && json?.message) {
                showNotLoggedInModal = true;
                return;
            }

            showCopySuccessModal = true;
        })
    }
</script>

<svelte:head>
    <title>{spaceData?.name || "Space not found"} | Glint</title>
    <meta name="description" content="This is a shared Space by {userData?.name} within Glint" />
    <meta property="og:title" content="{spaceData?.name} | Glint" />
    <meta property="og:type" content="article" />
    <meta property="og:description" content="This is a shared Space by {userData?.name} within Glint" />
</svelte:head>

<Modal bind:show={showNotLoggedInModal} title="You're not logged in" content="Please login or create an account, then come back and try again." acceptBtnContent="Proceed" declineBtnContent="Cancel" acceptFunction={() => {
    window.open('/login', '_blank', 'noopener,noreferrer');
    showNotLoggedInModal = false;
}} />

<Modal bind:show={showCopySuccessModal} title="Space copied successfully!" content="Would you like to check it out and start editing?" acceptBtnContent="Open" declineBtnContent="Keep viewing" acceptFunction={() => {
    window.open('/', '_blank', 'noopener,noreferrer');
    showCopySuccessModal = false;
}} />

<main>
    <div class="top">
        <div>
            <h3><a href="/">Glint</a> | {spaceData?.name || "Untitled"}</h3>
            <p class="space-date fs-xs">{formatDate(spaceData?.created_at) || ""}</p>
        </div>
        <p>Shared Space by {userData?.name || "User not found"}</p>
    </div>
    <div class="content">
        {#if spaceData}
        <div class="sidebar fs-xs">
            <p class="bold">Export</p>
            <div class="export-options">
                <button on:click={() => downloadFile(`${spaceData.name}.html`, editor.getHTML(), "text/html")}>HTML</button>
                <button on:click={() => downloadFile(`${spaceData.name}.md`, editor.storage.markdown.getMarkdown(), "text/markdown")}>Markdown</button>
                <button on:click={copyToAccount}>Copy to my account</button>
            </div>
        </div>
        {/if}
        <div class="editor">
        {#if spaceData}
            <Editor readOnly initContent={spaceData.content || ""} bind:editor />
        {:else}
        <div class="space-not-found">
            <h3>Error 404 | Space not found</h3>
            <p>This Space either doesn't exist or has been deleted</p>
            <a href="/"><button>Go back</button></a>
        </div>
        {/if}
        </div>
    </div>
</main>

<style>
    .content {
        display: flex;
        position: relative;
        align-items: start;
    }

    .sidebar {
        position: sticky;
        top: 5rem;
        max-width: 300px;

        padding: .5rem;
        padding-bottom: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: .5rem;
        align-items: start;
    }

    .export-options {
        display: flex;
        flex-direction: column;
        gap: .5rem;
    }

    .editor {
        max-width: 700px;
        margin-inline: auto;
        padding-block: 3rem;
        padding-inline: 1rem;
        padding-bottom: 10rem;
        flex: 1;
    }

    .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: sticky;
        top: 0;
        padding: 1rem;
        background-color: black;
        z-index: 2;
    }

    .top > div:has(.space-date) {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .space-not-found {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: start;
    }

    @media (max-width: 600px) {
        .content {
            flex-direction: column-reverse;
            align-items: stretch;
        }

        .sidebar {
            top: unset;
            bottom: 0rem;
            z-index: 2;

            background-color: black;
            max-width: unset;
        }

        .export-options {
            flex-direction: row;
        }
    }
</style>