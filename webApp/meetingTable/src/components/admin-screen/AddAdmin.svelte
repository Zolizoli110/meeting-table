<script lang="ts">
    import axios from "axios";
    import { loggedInUser, users } from "../../stores/api.store";
    import type { User } from "../../types";
    import SearchBar from "../calendar-screen/SearchBar.svelte";
    import { HttpStatusHandler } from "../../utils/errorHandler";

    const onAddAction = async (data: User) => {
        const res = await axios({
            url: `http://localhost:3000/api/guest/${data.user_email}`,
            method: "patch",
            data: {
                role_name: "admin",
            },
            withCredentials: true,
        }).catch((error) => {
            HttpStatusHandler(error.response.status);
        });
    };
</script>

<div class="container">
    <div class="searchContainer">
        <label>
            Type in a user's name to give admin privileges
            <br />
            <SearchBar data={$users} {onAddAction} />
        </label>
    </div>
</div>

<style>
    .container {
        background-color: red;
    }
</style>
