<script>
	import { fade, fly } from "svelte/transition";

    export let show = false, title = "Are you sure?",
    content = "Are you sure you would like to take this action?",
    acceptFunction = () => show = false,
    declineFunction = () => show = false,
    acceptBtnContent = "Accept",
    declineBtnContent = "Decline",
    closableFromWrapper = true
</script>

{#if show}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="wrapper" on:click={(e) => {
    if(closableFromWrapper) {
        const target = e.target;
        if(target.classList.contains("wrapper")) {show = false}
    }
}} transition:fade={{ duration: 50 }}>
    <div transition:fly={{ y: 100 }} class="main">
        <h2>{title}</h2>
        <p>{content}</p>
        <div class="buttons">
            <button on:click={declineFunction}>{declineBtnContent}</button>
            <button on:click={acceptFunction}>{acceptBtnContent}</button>
        </div>
    </div>
</div>
{/if}

<style>
    .wrapper {
        position: fixed;
        background-color: #00000052;
        inset: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1;
    }

    .main {
        max-width: 400px;
        margin-inline: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
        background-color: black;
        border: 1px solid #a1a1a166;
    }

    /* .buttons {
        align-self: flex-end;
    } */
</style>