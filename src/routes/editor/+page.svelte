<script>
    import { Tipex, Utility } from "@friendofsvelte/tipex";
    import "@friendofsvelte/tipex/styles/Tipex.css";
    import "@friendofsvelte/tipex/styles/ProseMirror.css";
    import "@friendofsvelte/tipex/styles/Controls.css";
    import "@friendofsvelte/tipex/styles/EditLink.css";
    import "@friendofsvelte/tipex/styles/CodeBlock.css";
    import { onMount } from "svelte";

    let editor;

    const save = () => {
        console.log(editor.getJSON());
        display.commands.setContent(editor.getJSON());
    }

    let display;
    onMount(() => {
        display.setEditable(false);
    })

    let displayBody = "<p>Your saved text will appear here</p>";
</script>

<main>
    <Tipex bind:tipex={editor} class="tipex" controls floating>
        {#snippet utilities(tipex)}
            <Utility {tipex}/>
        {/snippet}
    </Tipex>
    <button on:click={save}>Save</button>
    <Tipex bind:tipex={display} body={displayBody} class="tipex" floating>
    </Tipex>
</main>

<style>
    main {
        font-family: sans-serif;
    }
</style>