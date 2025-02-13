<script>
    import Editor from "$lib/components/Editor.svelte";
    import { onMount } from "svelte";
    let editor;

    const exampleNote = {
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
                        "text": "App editor test"
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
                        "text": "Do the following:"
                    }
                ]
            },
            {
                "type": "taskList",
                "content": [
                    {
                        "type": "taskItem",
                        "attrs": {
                            "checked": false
                        },
                        "content": [
                            {
                                "type": "paragraph",
                                "attrs": {
                                    "textAlign": null
                                },
                                "content": [
                                    {
                                        "type": "text",
                                        "text": "Try out mentions"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "taskItem",
                        "attrs": {
                            "checked": false
                        },
                        "content": [
                            {
                                "type": "paragraph",
                                "attrs": {
                                    "textAlign": null
                                },
                                "content": [
                                    {
                                        "type": "text",
                                        "text": "Check how it feels"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "taskItem",
                        "attrs": {
                            "checked": false
                        },
                        "content": [
                            {
                                "type": "paragraph",
                                "attrs": {
                                    "textAlign": null
                                },
                                "content": [
                                    {
                                        "type": "text",
                                        "text": "Spit on Kortex"
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
                        "text": "Should be all good after completing these steps."
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
                        "text": "Happy testing."
                    }
                ]
            }
        ]
    }

    const clear = () => {
        editor.commands.setContent("");
    }

    const reset = () => {
        editor.commands.setContent(exampleNote);
    }

    onMount(reset);
</script>

<main>
    <div class="buttons">
        <button on:click={clear}>Clear</button>
        <button on:click={reset}>Reset example</button>
    </div>
    <Editor bind:editor mentionList={["one", "two", "three"]} />
</main>

<style>
    main {
        padding: 1rem;
        padding-top: 3rem;
    }
</style>