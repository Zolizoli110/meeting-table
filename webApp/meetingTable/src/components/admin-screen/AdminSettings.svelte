<script lang="ts">
    // @ts-nocheck
    import { events } from "../../stores/api.store";
    import AddAdmin from "./AddAdmin.svelte";
    import MeetingRoomsInfo from "./MeetingRoomsInfo.svelte";
    import Calendar from "@event-calendar/core";
    import TimeGrid from "@event-calendar/time-grid";
</script>

<div class="container">
    <div>
        <AddAdmin />
    </div>
    <div>
        <MeetingRoomsInfo />
    </div>
</div>

<style>
    .container {
        height: 100vh;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
    }
</style>
