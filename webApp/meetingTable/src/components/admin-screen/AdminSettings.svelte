<script lang="ts">
    // @ts-nocheck
    import { events } from "../../stores/api.store";
    import AddAdmin from "./AddAdmin.svelte";
    import MeetingRoomsInfo from "./MeetingRoomsInfo.svelte";
    import Calendar from "@event-calendar/core";
    import TimeGrid from "@event-calendar/time-grid";
</script>

<div class="container">
    <AddAdmin />
    <MeetingRoomsInfo />
</div>

<style>
    .container {
        display: flex;
        justify-content: space-between;
    }
</style>
