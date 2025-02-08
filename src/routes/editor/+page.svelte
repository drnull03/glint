<script>
    import { Tipex, Utility, defaultExtensions } from "@friendofsvelte/tipex";
    import TextAlign from "@tiptap/extension-text-align";
    import Mention from "@tiptap/extension-mention";
    import { onMount } from "svelte";
    import tippy from "tippy.js";

    import "@friendofsvelte/tipex/styles/Tipex.css";
    import "@friendofsvelte/tipex/styles/ProseMirror.css";
    import "@friendofsvelte/tipex/styles/Controls.css";
    import "@friendofsvelte/tipex/styles/EditLink.css";
    import "@friendofsvelte/tipex/styles/CodeBlock.css";

    let editor;
    let display;
    let displayBody = "<p>Your saved text will appear here</p>";

    let mentionList = ["Tasks", "Sallat", "Get more sales"];

    const save = () => {
        console.log(editor.getJSON());
        console.log(editor.isEmpty);
        if (editor.isEmpty) {
            alert("Editor is empty");
            return;
        }
        // Save content from editor into display.
        display.commands.setContent(editor.getJSON());
    };

    onMount(() => {
        display.setEditable(false);
    });

    const suggestion = {
        char: "@",
        items: ({ query }) => {
            return mentionList
                .map((name, index) => ({ id: index + 1, label: name }))
                .filter(item =>
                    item.label.toLowerCase().startsWith(query.toLowerCase())
                )
                .slice(0, 5);
        },
        render: () => {
            let component;
            let popup;
            let selectedIndex = 0;
            let currentProps = null;

            function handleGlobalKeydown(event) {
                if (!currentProps || !currentProps.items) return;
                if (event.key === "ArrowDown") {
                    event.preventDefault();
                    event.stopPropagation();
                    selectedIndex = (selectedIndex + 1) % currentProps.items.length;
                    update(currentProps);
                } else if (event.key === "ArrowUp") {
                    event.preventDefault();
                    event.stopPropagation();
                    selectedIndex =
                        (selectedIndex - 1 + currentProps.items.length) %
                        currentProps.items.length;
                    update(currentProps);
                } else if (event.key === "Tab") {
                    event.preventDefault();
                    event.stopPropagation();
                    if (currentProps.items.length > 0) {
                        currentProps.command({
                            id: currentProps.items[selectedIndex].id,
                            label: currentProps.items[selectedIndex].label
                        });
                    }
                }
            }

            function update(props) {
                currentProps = props;
                component.innerHTML = props.items
                    .map(
                        (item, index) =>
                            `<div class="item ${
                                index === selectedIndex ? "selected" : ""
                            }" data-index="${index}">${item.label}</div>`
                    )
                    .join("");
                Array.from(component.querySelectorAll(".item")).forEach(
                    (child, index) => {
                        child.addEventListener("click", () =>
                            props.command({
                                id: props.items[index].id,
                                label: props.items[index].label
                            })
                        );
                    }
                );
            }

            return {
                onStart: (props) => {
                    selectedIndex = 0;
                    component = document.createElement("div");
                    component.className = "suggestion";
                    update(props);
                    popup = tippy("body", {
                        getReferenceClientRect: props.clientRect,
                        appendTo: () => document.body,
                        content: component,
                        showOnCreate: true,
                        interactive: true
                    });
                    window.addEventListener("keydown", handleGlobalKeydown);
                },
                onUpdate: (props) => {
                    if (selectedIndex >= props.items.length) {
                        selectedIndex = 0;
                    }
                    update(props);
                    popup[0].setProps({
                        getReferenceClientRect: props.clientRect
                    });
                },
                onKeyDown: () => false,
                onExit: () => {
                    window.removeEventListener("keydown", handleGlobalKeydown);
                    popup[0].destroy();
                }
            };
        }
    };

    let editorExtensions = [
        ...defaultExtensions,
        TextAlign.configure({
            types: ["heading", "paragraph"],
            alignments: ["left", "right"]
        }),
        Mention.configure({ suggestion })
    ];
</script>

<main>
    <Tipex
        extensions={editorExtensions}
        bind:tipex={editor}
        class="editor"
        controls
        floating
    >
        {#snippet utilities(tipex)}
            <Utility {tipex} />
        {/snippet}
    </Tipex>
    <button on:click={save}>Save</button>
    <Tipex
        extensions={editorExtensions}
        bind:tipex={display}
        class="editor"
        body={displayBody}
    ></Tipex>
</main>

<style>
    main {
        font-family: sans-serif;
    }

    :global(.editor) {
        max-width: 600px;
        margin-top: 100px;
        margin-inline: auto;
    }

    :global(.suggestion) {
        background: white;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 4px;
    }
    :global(.suggestion .item) {
        padding: 4px 8px;
        cursor: pointer;
    }
    :global(.suggestion .item.selected) {
        background: #efefef;
    }
</style>