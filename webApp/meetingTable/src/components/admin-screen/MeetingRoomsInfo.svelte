<script lang="ts">
    import axios, { HttpStatusCode } from "axios";
    import { meetingRooms } from "../../stores/api.store";
    import { HttpStatusHandler } from "../../utils/errorHandler";

    let isAddMeetingRoomClicked = false;

    const addMeetingRoom = async () => {
        const calendarId = (
            document.getElementById("calendarIdText") as HTMLInputElement
        ).value;
        const response = await axios({
            url: "http://localhost:3000/meetingroom",
            method: "post",
            data: {
                room_id: calendarId,
            },
        }).catch((error) => {
            HttpStatusHandler(error.response.status);
        });
    };
</script>

<div class="container">
    <h2>Meeting rooms in your organization:</h2>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div
        on:click={() => {
            isAddMeetingRoomClicked = !isAddMeetingRoomClicked;
        }}
        id="add_button"
    >
        +
    </div>
    {#if isAddMeetingRoomClicked}
        <form on:submit|preventDefault={addMeetingRoom}>
            <input
                id="calendarIdText"
                type="text"
                class="name_input"
                placeholder="The calendar ID provided by google: "
            />
        </form>
        <div class="info-button">I</div>
    {/if}
    {#each $meetingRooms as room}
        <p>{room.name}</p>
        <div class="options_button">:</div>
    {/each}
</div>

<style>
    .container {
        display: grid;
        grid-template-columns: auto auto;
        grid-template-rows: auto auto;
    }
</style>
