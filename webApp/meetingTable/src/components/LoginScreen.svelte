<script lang="ts">
    import axios from "axios";

    const googleLogin = () => {
        axios.get("api/auth/google");
        let form = document.createElement("form");
    };
</script>

<div class="flex flex-col justify-center items-center gap-5">
    <h1 class="text-3xl font-bold">MeetingTable</h1>
    <h2>Log in:</h2>
    <form class="flex flex-col" on:submit|preventDefault={googleLogin}>
        <label for="email-input">your email: </label>
        <input type="email" id="email-input" />

        <label for="password-input">your password</label>
        <input type="password" id="password-input" />
        <br />
        <button type="submit">Log in</button>
        <h2>Or log in with Google:</h2>
        <a href="http://localhost:3000/api/auth/google"
            ><span class="text-red-500">G</span> Login</a
        >
    </form>
</div>

<style lang="postcss">
    form > input,
    button {
        border: 1px solid black;
    }
</style>
