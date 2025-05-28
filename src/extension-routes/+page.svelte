<script>
    import Editor from "$lib/components/Editor.svelte";
    import { onMount } from "svelte";

    let token = null;
    
    const getTokenFromChromeStorage = async () => {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(["token"], (result) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(result.token || null);
                }
            });
        });
    };

    const captureSpark = (spaceID, spark) => {
        if(!spark) {
            return;
        }
        fetch("https://glint-vision-creative.pages.dev/api/space/sparks", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ spaceID, sparks: [spark] })
        })
        .then(res => res.json())
        .then(json => {
            console.log(json);
        })
    }

    let spaces = [];

    let editor;

    function getAllMentions(editor) {
        const mentions = [];

        editor.state.doc.descendants((node) => {
            if (node.type.name === 'mention') {
                mentions.push(node.attrs);
            }
        });

        return mentions;
    }

    const getSpaces = () => {
        fetch("https://glint-vision-creative.pages.dev/api/space/extension", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(json => {
            if(json?.status) {
                spaces = json.data || [];
            }
        })
    }

    onMount(() => {
        getTokenFromChromeStorage()
        .then(tokenFromStorage => {
            if(tokenFromStorage) {
                token = tokenFromStorage;
                getSpaces();
            }
            else {
                console.log("not logged in");
            }
        })
    })

    let email, password;

    const login = () => {
        fetch("https://glint-vision-creative.pages.dev/api/auth/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ email, password })
        })
        .then(res => res.json())
        .then(async json => {
            if(!json.status) {
                return;
            }

            email = "";
            password = "";
            
            token = json.data;
            chrome.storage.local.set({token});
            getSpaces();
        })
    }
</script>

<main>
    <h2>Glint - Sparks</h2>
    {#if token}
        {#if !spaces.length}
        <p>You currently have no Spaces in your account</p>
        <p><a href="https://glint-vision-creative.pages.dev" target="_blank">Create a Space</a> on Glint</p>
        {:else}
        <Editor popupBottom bind:editor mentionList={spaces} />
        <button on:click={() => {
            const sparks = getAllMentions(editor);
            sparks.forEach(s => {
                captureSpark(s.id, editor.getText());
            })

            editor.commands.clearContent();
        }}>Capture ✨</button>
        {/if}
    {:else}
    <p>You're not logged in</p>
    <input bind:value={email} type="email" placeholder="Email">
    <input bind:value={password} type="password" placeholder="Password">
    <button on:click={login}>Login</button>
    <a href="https://glint-vision-creative.pages.dev/signup" target="_blank">Signup</a>
    {/if}
</main>

<style>
    main {
        padding: 1rem;
        width: 300px;
        height: 270px;
        display: flex;
        flex-direction: column;
        gap: .5rem;
        align-items: start;
    }

    a {
        text-decoration: underline;
    }
</style>