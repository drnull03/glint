<script>
    let errorMessage;
    let showLoading = false;

    let name, email, password;

    const signup = () => {
        if(!name || !email || !password) {
            errorMessage = "Please enter valid credentials";
            return;
        }
        showLoading = true;
        fetch("../../api/auth/signup", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ name, email, password })
        })
        .then(res => res.json())
        .then(async json => {
            console.log(json);
            showLoading = false;
            if(!json.status) {
                errorMessage = "Signup failed, try again";
                return;
            }
            signupSuccess = true;
        })
    }

    let signupSuccess = false;
</script>

<svelte:head>
    <title>Signup | Glint Desktop</title>
</svelte:head>

<main>
    {#if !signupSuccess}
        <div class="form">
            <h2>Create an account</h2>
            <p>Name</p>
            <input bind:value={name} type="text" placeholder="Enter your name">
            <p>Email</p>
            <input bind:value={email} type="email" placeholder="example@gmail.com">
            <p>Password</p>
            <input bind:value={password} type="password" placeholder="Enter a strong password">
            <div>
                <button on:click={signup}>Signup</button>
            </div>
        </div>
        {#if errorMessage}
            <p class="warning">{errorMessage}</p>
        {/if}

        {#if showLoading}
            <div class="loading">
                <p>Loading...</p>
            </div>
        {/if}
    {:else}
        <div class="success">
            <h2>Thank you for signing up!</h2>
            <p>You can now close this window and login in your Glint desktop App.</p>
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

    .success {
        text-align: center;
        max-width: 400px;
    }
</style>