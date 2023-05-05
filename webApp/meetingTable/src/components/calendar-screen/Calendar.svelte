<script lang="ts">
    // @ts-nocheck
    import Calendar from "@event-calendar/core";
    import TimeGrid from "@event-calendar/time-grid";
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
            <div class="dropdown_container">
                <select
                    style="width: 100%;"
                    bind:value={$currentData.roomId}
                    id="meetingRoomSelect"
                >
                    {#each $meetingRooms as room}
                        <option value={room.room_id}>{room.name}</option>
                    {/each}
                </select>
            </div>
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
        gap: 5px;
    }
    .calendarBlock {
        overflow-x: scroll;
    }
    .dropdown_container {
        border: 1px solid black;
        width: 100%;
    }
</style>
