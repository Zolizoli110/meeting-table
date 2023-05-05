<script lang="ts">
    import axios from "axios";
    import { loggedInUser } from "../stores/api.store";

    const googleLogin = async () => {
        const res = await axios({
            url: "http://localhost:3000/api/auth/google",
        });
    };
</script>

<div
    style="transform: translateX(-75px);"
    class="flex flex-col justify-center items-center gap-20"
>
    <h1 class="text-3xl font-bold pt-10">MeetingTable</h1>
    <div class="flex flex-col justify-center items-center gap-2">
        <h2>Log in with Google</h2>
        <p class="text-gray-500">
            Log in using your email address provided by your work place
        </p>
        <form
            class="flex flex-col googleButton"
            on:submit|preventDefault={googleLogin}
        >
            <a href="http://localhost:3000/api/auth/google"
                ><span class="text-red-500">G</span>oogle</a
            >
        </form>
    </div>
</div>

<style lang="postcss">
    .googleButton {
        font-size: 1.2rem;
        border: 1px solid black;
        border-radius: 2px;
        padding: 2px;
        margin-top: 20px;
    }
</style>
