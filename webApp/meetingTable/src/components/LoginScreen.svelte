<script>
</script>

<div class="flex flex-col justify-center items-center gap-5">
    <h1 class="text-3xl font-bold">MeetingTable</h1>
    <h2>Log in:</h2>
    <form class="flex flex-col">
        <label for="email-input">your email: </label>
        <input type="email" id="email-input" />

        <label for="password-input">your password</label>
        <input type="password" id="password-input" />
        <br />
        <button type="submit">Log in</button>
    </form>
    <h2>Or log in with Google:</h2>
    <button><span class="text-red-500">G</span> Login</button>
</div>

<style lang="postcss">
    form > input,
    button {
        border: 1px solid black;
    }
</style>
