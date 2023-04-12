<script lang="ts">
    // @ts-ignore
    import Calendar from "@event-calendar/core";
    // @ts-ignore
    import TimeGrid from "@event-calendar/time-grid";
    // @ts-ignore
    import DayGrid from "@event-calendar/day-grid";
    // @ts-ignore
    import axios from "axios";
    import type { MeetingRoom } from "../../types";
    import {
        meetingRooms,
        events,
        currentDate,
        currentData,
        roomIdStore,
    } from "../../stores/api.store";
    import { onMount } from "svelte";

    let ec: Calendar;

    const getEvents = async (room_id: any) => {
        await events.getEvents(room_id);
    };

    let plugins = [TimeGrid];
    $: options = {
        view: "timeGridDay",
        events: $events,
        datesSet: (info: any) => {
            $currentData.day = info.startStr;
        },
    };

    let hasMounted = false;
    onMount(() => {
        $currentData = {
            ...$currentData,
            roomId: $meetingRooms[0].room_id,
        };
        hasMounted = true;
    });
</script>

<div class="screen">
    <div class="calendarContainer">
        <!-- meeting room select -->
        <div class="selectContainer">
            <label for="meetingRoomSelect">Select a meeting room: </label>
            <select bind:value={$currentData.roomId} id="meetingRoomSelect">
                {#each $meetingRooms as room}
                    <option value={room.room_id}>{room.name}</option>
                {/each}
            </select>
        </div>
        <!-- displaying calendar based on selected room -->
        {#if hasMounted}
            {#await getEvents($roomIdStore) then}
                <div class="calendarBlock">
                    <Calendar bind:this={ec} {plugins} {options} />
                </div>
            {/await}
        {/if}
    </div>
</div>

<style>
    .screen {
        box-sizing: border-box;
        display: flex;
        justify-content: space-around;
    }
    .calendarContainer {
        width: 500px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .selectContainer {
        display: flex;
        flex-direction: column;
    }
    .calendarBlock {
        overflow-x: scroll;
    }
</style>
