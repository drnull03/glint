<script>
    import { Tipex, Utility, defaultExtensions } from "@friendofsvelte/tipex";
    import TextAlign from "@tiptap/extension-text-align";
    import TaskList from "@tiptap/extension-task-list";
    import TaskItem from "@tiptap/extension-task-item";
    import Mention from "@tiptap/extension-mention";
    import { Markdown } from "tiptap-markdown";
    import tippy from "tippy.js";
    import { onMount } from "svelte";

    import "@friendofsvelte/tipex/styles/ProseMirror.css";

    import "./editor.css";

    export let editor;
    export let mentionList = ["These", "Are", "Placeholders"];
    export let onupdate = () => {};
    export let initContent;
    export let alignment = "left";
    export let readOnly = false;

    onMount(() => {
        if(initContent) {
            editor.commands.setContent(initContent);
        }
        
        if(readOnly) {
            editor.setEditable(false);
        }
    });

    $: if (editor) {
        alignment = editor.isActive("paragraph", { textAlign: "right" }) ? "right" : "left";
    }

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
        Mention.configure({ suggestion }),
        TaskItem.configure({
            nested: true,
        }),
        TaskList.configure({
            itemTypeName: 'taskItem',
        }),
        Markdown.configure({
            transformPastedText: true,
            // The one below might be problematic
            linkify: true
        })
    ];
</script>

<Tipex
    extensions={editorExtensions}
    bind:tipex={editor}
    class="editor"
    floating
    bind:onupdate
>
</Tipex>