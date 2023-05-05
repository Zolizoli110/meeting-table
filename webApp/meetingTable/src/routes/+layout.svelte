<script lang="ts">
    import axios from "axios";
    import "../app.css";
    import Sidebar from "../components/navigation/Sidebar.svelte";
    import { users, meetingRooms, loggedInUser } from "../stores/api.store";
    import type { User } from "../types";
    import { HttpStatusHandler } from "../utils/errorHandler";

    async function getRooms() {
        const roomsRes = await axios({
            method: "get",
            url: "http://localhost:3000/api/meetingroom",
        })
            .then((response) => {
                $meetingRooms = response.data;
            })
            .catch((error) => {
                HttpStatusHandler(error.response.status);
            });
    }

    async function getAllUsers() {
        const usersRes = await axios({
            url: "http://localhost:3000/api/guest",
            method: "get",
        })
            .then((response) => {
                $users = response.data.map((user: User) => {
                    return {
                        ...user,
                        searchTerms: user.user_email,
                    };
                });
            })
            .catch((error) => {
                HttpStatusHandler(error.response.status);
            });
    }
    const allPromises = Promise.all([getRooms(), getAllUsers()]);
    let isLoggedIn = false;
    $: {
        isLoggedIn = $loggedInUser;
    }
</script>

{#await allPromises then}
    <div class="mainContainer">
        {#if isLoggedIn}
            <Sidebar />
        {/if}
        <div class="page">
            <slot />
        </div>
    </div>
{/await}

<style>
    * {
        box-sizing: border-box;
    }
    .mainContainer {
        height: 100vh;
    }
    .page {
        margin-left: 150px;
    }
</style>
