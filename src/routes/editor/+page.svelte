<script>
    import { Tipex, Utility, defaultExtensions } from "@friendofsvelte/tipex";
    import TextAlign from "@tiptap/extension-text-align";
    import "@friendofsvelte/tipex/styles/Tipex.css";
    import "@friendofsvelte/tipex/styles/ProseMirror.css";
    import "@friendofsvelte/tipex/styles/Controls.css";
    import "@friendofsvelte/tipex/styles/EditLink.css";
    import "@friendofsvelte/tipex/styles/CodeBlock.css";
    import { onMount } from "svelte";

    let editor;

    const save = () => {
        console.log(editor.getJSON());
        console.log(editor.isEmpty);
        if(editor.isEmpty) {
            alert("Editor is empty");
            return;
        }
        display.commands.setContent(editor.getJSON());
    }

    let display;
    onMount(() => {
        display.setEditable(false);
        console.log(display.can().toggleBold());
    })

    let displayBody = "<p>Your saved text will appear here</p>";

    let editorExtensions = [
        ...defaultExtensions,
        TextAlign.configure({
            types: ['heading', 'paragraph'],
            alignments: ['left', 'right'],
        })
    ];
</script>

<main>
    <Tipex extensions={editorExtensions} bind:tipex={editor} class="editor" controls floating>
        {#snippet utilities(tipex)}
            <Utility {tipex}/>
        {/snippet}
    </Tipex>
    <button on:click={save}>Save</button>
    <Tipex bind:tipex={display} class="editor" body={displayBody}>
    </Tipex>
</main>

<style>
    main {
        font-family: sans-serif;
    }

    :global(.editor) {
        max-width: 600px;
        margin-inline: auto;
    }
</style>