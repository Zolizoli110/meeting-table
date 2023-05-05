<script lang="ts">
    //@ts-nocheck
    import { events } from "../../stores/api.store";
    import Calendar from "@event-calendar/core";
    import TimeGrid from "@event-calendar/time-grid";

    let plugins = [TimeGrid];
    $: options = {
        view: "timeGridWeek",
        events: $events,
    };
</script>

<div style="margin: 15px;">
    <Calendar {plugins} {options} />
</div>
