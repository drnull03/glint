<script>
    import toggleSidebarIconSrc from "$lib/assets/icons/toggle-sidebar-icon.svg";
    import addIconSrc from "$lib/assets/icons/add-icon.svg";
    import Saving from '$lib/components/Saving.svelte';
    import { fly } from "svelte/transition";
    import Editor from "$lib/components/Editor.svelte";

    let data = {
        "email": "zain@gmail.com"
    }

    let isSaving = false;

    const formatDate = (ms) => {
        const date = new Date(ms);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    let spaces = [
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
    let isNewSpaceInputActive = false;

    let editor;

    let spaceName = "New Space";
</script>

<Saving bind:show={isSaving} />

<main class="fs-300">
    <div class="sidebar" class:active={isSidebarActive}>
        <div class="controls">
            <div>
                <h3>My Spaces</h3>
                <button on:click={() => isNewSpaceInputActive = !isNewSpaceInputActive}><img src="{addIconSrc}" alt="add"></button>
            </div>
            {#if isNewSpaceInputActive}
            <input transition:fly={{ y: -100, duration: 200 }} type="text" placeholder="New space name">
            {/if}
        </div>
        <div class="spaces">
            {#each spaces as space}
                <button on:click={() => {
                    editor.commands.setContent(space.content)
                    spaceName = space.name;
                }} class="space fs-xs">
                    <p class="bold">{space.name}</p>
                    <p>{space.content.content[0].content[0].text.slice(0, 20)}...</p>
                </button>
            {/each}
        </div>
    </div>
    <div class="content">
        <div class="top">
            <button class:active={isSidebarActive} class="sidebar-toggle" on:click={() => {
                isSidebarActive = !isSidebarActive;
            }}><img src="{toggleSidebarIconSrc}" alt="toggle sidebar"></button>
            <h3>{spaceName}</h3>
            <div>
                <p>{data.email}</p>
                <a class="button" rel="external" href="/logout">Logout</a>
            </div>
        </div>
        <div class="editor-container">
            <div class="editor">
                <Editor bind:editor mentionList={spaces.map(space => space.name)} />
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
        z-index: 1;
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
        padding-bottom: .5rem;

        transition: all 150ms ease;
        padding-inline: 0;
        overflow-x: hidden;
        overflow-y: auto;
        max-width: 0;
        translate: -500% 0;
        opacity: 0;
    }

    .sidebar.active {
        opacity: 1;
        translate: 0 0;
        padding-inline: .5rem;
        max-width: 200px;
    }

    .sidebar .controls {
        display: flex;
        flex-direction: column;
        gap: .5rem;
        position: sticky;
        top: 0;
        background-color: black;
        padding-block: .5rem;
    }

    .sidebar .controls > div {
        display: flex;
        justify-content: space-between;
        gap: .5rem;
    }

    .spaces {
        margin-block-start: .5rem;
    }

    button.space {
        text-align: start;
    }

    button.space:not(:last-of-type) {
        margin-bottom: .5rem;
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