<script lang="ts">
    import { onMount } from "svelte";
    import { location, push } from "svelte-spa-router";
    import { loggedInUser } from "../../stores/api.store";
    import axios from "axios";

    export let params: any = {};

    const getLoggedInUser = async () => {
        const res = await axios(
            `http://localhost:3000/api/guest/${params.user_email}`
        );
        $loggedInUser = res.data;
        localStorage.setItem("user_info", JSON.stringify($loggedInUser));
        console.log($loggedInUser);
    };
    getLoggedInUser();
    push("/calendar");
</script>
