<script lang="ts">
    import { addedAttendees } from "../../stores/api.store";
    import type { User } from "../../types";

    export let data: User;
</script>

<li>
    <div class="mainContainer">
        <div class="displayContainer">
            {data.user_email}
        </div>
        <button
            type="button"
            on:click={() => {
                $addedAttendees = [...$addedAttendees, data];
            }}>+</button
        >
    </div>
</li>

<style>
    .mainContainer {
        display: flex;
        justify-content: space-between;
    }
</style>
