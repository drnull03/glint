<script>
    import { onMount } from "svelte";
    import { Tipex, defaultExtensions } from "@friendofsvelte/tipex";
    import TextAlign from "@tiptap/extension-text-align";
    import TaskList from "@tiptap/extension-task-list";
    import TaskItem from "@tiptap/extension-task-item";
    import Mention from "@tiptap/extension-mention";
    import { Markdown } from "tiptap-markdown";
    import Table from '@tiptap/extension-table';
    import TableCell from '@tiptap/extension-table-cell';
    import TableHeader from '@tiptap/extension-table-header';
    import TableRow from '@tiptap/extension-table-row';

    import tippy from "tippy.js";
    import "@friendofsvelte/tipex/styles/ProseMirror.css";
    import "./editor.css";

    export let editor;
    export let mentionList = [];
    export let initContent;
    export let readOnly = false;
    export let popupBottom = false;
    export let onupdate = () => {};

    onMount(() => {
        if(initContent) {
            editor.commands.setContent(initContent);
        }
        if(readOnly) {
            editor.setEditable(false);
        }
    });

    const suggestion = {
        char: "@",
        items: ({ query }) =>
            mentionList
                .filter((s) => s.name.toLowerCase().startsWith(query.toLowerCase()))
                .slice(0, 5)
                .map((s) => ({ id: s.spaceID, label: s.name })),
        render: () => {
            let component;
            let popup;
            let selectedIndex = 0;
            let currentProps = null;

            const handleGlobalKeydown = (event) => {
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
                        const item = currentProps.items[selectedIndex];
                        currentProps.command(item);
                    }
                }
            };

            function update(props) {
                currentProps = props;
                component.innerHTML = props.items
                    .map(
                        (item, index) =>
                            `<div class=\"item ${index === selectedIndex ? "selected" : ""}\" data-index=\"${index}\">${item.label}</div>`
                    )
                    .join("");
                Array.from(component.querySelectorAll(".item")).forEach((child, i) => {
                    child.addEventListener("click", () =>
                        props.command(props.items[i])
                    );
                });
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
                        interactive: true,
                        placement: popupBottom ? 'bottom-start' : 'top'
                    });
                    window.addEventListener("keydown", handleGlobalKeydown);
                },
                onUpdate: (props) => {
                    if (selectedIndex >= props.items.length) {
                        selectedIndex = 0;
                    }
                    update(props);
                    popup[0].setProps({
                        getReferenceClientRect: props.clientRect,
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

    const editorExtensions = [
        ...defaultExtensions,
        TextAlign.configure({
            types: ["heading", "paragraph"],
            alignments: ["left", "right"]
        }),
        Mention.configure({ suggestion }),
        TaskItem.configure({ nested: true }),
        TaskList.configure({ itemTypeName: 'taskItem' }),
        Markdown.configure({ transformPastedText: true, linkify: true }),
        Table.configure({ resizable: true }),
        TableRow,
        TableHeader,
        TableCell,
    ];
</script>

<Tipex
    extensions={editorExtensions}
    bind:tipex={editor}
    class="editor"
    floating
    bind:onupdate
/>