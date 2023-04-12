<script lang="ts">
    import axios from "axios";
    import "../app.css";
    import Sidebar from "../components/Sidebar.svelte";
    import { users, meetingRooms } from "../stores/api.store";
    import type { User } from "../types";

    async function getRooms() {
        const roomsRes = await axios({
            method: "get",
            url: "http://localhost:3000/api/meetingroom",
        });
        $meetingRooms = roomsRes.data;
    }

    async function getAllUsers() {
        const usersRes = await axios({
            url: "http://localhost:3000/api/guest",
            method: "get",
        });
        $users = usersRes.data.map((user: User) => {
            return {
                ...user,
                searchTerms: user.user_email,
            };
        });
    }
    const allPromises = Promise.all([getRooms(), getAllUsers()]);
</script>

{#await allPromises then}
    <div class="mainContainer">
        <Sidebar />
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
