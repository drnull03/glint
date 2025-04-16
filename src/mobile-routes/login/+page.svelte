<script>
    import { goto } from "$app/navigation";
    import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
    import { onMount } from "svelte";
    onMount(async () => {
        SecureStoragePlugin.get({ key: "token" })
        .then(({ value }) => {
            goto("/");
        })
    })
    let errorMessage;
    let showLoading = false;

    const login = () => {
        showLoading = true;
        fetch("https://glint-vision-creative.pages.dev/api/auth/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ email, password })
        })
        .then(res => res.json())
        .then(async json => {
            console.log(json);
            showLoading = false;
            if(!json.status) {
                errorMessage = "Login failed, try again";
                return;
            }

            SecureStoragePlugin.set({ key: "token", value: json.data })
            .then(() => {
                goto("/");
            })
        })
    }

    let email, password;
</script>

<main>
    <div class="form">
        <h2>Login</h2>
        <p>Email</p>
        <input bind:value={email} type="email" placeholder="example@gmail.com">
        <p>Password</p>
        <input bind:value={password} type="password" placeholder="Enter your password">
        <div>
            <button on:click={login}>Login</button>
        </div>
    </div>
    {#if errorMessage}
        <p class="warning">{errorMessage}</p>
    {/if}
    <p>Don't have an account?</p>
    <a href="https://glint-vision-creative.pages.dev/signup/desktop" target="_blank">Signup</a>

    <!-- Loading -->
    {#if showLoading}
        <div class="loading">
            <p>Loading...</p>
        </div>
    {/if}
</main>

<style>
    main {
        min-height: 100vh;
        min-height: 100svh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    input {
        width: 200px;
        margin-bottom: .5rem;
    }

    .form {
        padding: .5rem;
    }

    .warning {
        color: red;
    }

    .loading {
        position: absolute;
        inset: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: black;
    }
</style>