<script lang="ts">
    import Calendar from "./Calendar.svelte";
    import { add } from "date-fns";
    import { meetingRooms } from "../../stores/api.store";
    import { onMount } from "svelte";
    import axios from "axios";
    import type { MeetingRoom } from "../../types";
    import Book from "./Book.svelte";
</script>

<div class="container">
    <Calendar />
    <Book />
</div>

<style>
    .container {
        height: 100vh;
        padding-top: 60px;
        display: flex;
        justify-content: space-around;
    }
</style>
