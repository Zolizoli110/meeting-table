<script lang="ts">
    import axios from "axios";
    import {
        addedAttendees,
        currentData,
        users,
        events,
    } from "../../stores/api.store";
    import type { MeetingRoom, Reservation, User } from "../../types";
    import SearchBar from "./SearchBar.svelte";
    import { HttpStatusHandler } from "../../utils/errorHandler";

    let times: string[] = [];

    function generateTimes() {
        const times: string[] = [];
        const start = new Date();
        start.setHours(8, 0, 0, 0);
        const end = new Date();
        end.setHours(19, 0, 0, 0);
        const increment = 15 * 60 * 1000;

        for (
            let time = start.getTime();
            time <= end.getTime();
            time += increment
        ) {
            const date = new Date(time);
            const hours = date.getHours().toString().padStart(2, "0");
            const minutes = date.getMinutes().toString().padStart(2, "0");
            const timeString = `${hours}:${minutes}`;
            times.push(timeString);
        }
        return times;
    }
    times = generateTimes();

    async function handleSubmit(e: SubmitEvent) {
        const newReservation: Reservation = {
            resName: $currentData.title,
            roomId: $currentData.roomId,
            dateStart:
                $currentData.day.split("T")[0] +
                "T" +
                $currentData.timeStart +
                ":00Z",
            dateEnd:
                $currentData.day.split("T")[0] +
                "T" +
                $currentData.timeEnd +
                ":00Z",
            description: $currentData.description,
            arrangerEmail: "daniel.furedi03@gmail.com",
            userEmails: $addedAttendees.map((x) => x.user_email),
        };
        const res = await axios({
            url: "http://localhost:3000/api/reservation",
            method: "post",
            data: newReservation,
        }).catch((error) => {
            HttpStatusHandler(error.response.status);
        });
        events.getEvents($currentData.roomId);
    }
    const onAddAction = (data: User) => {
        $addedAttendees = [...$addedAttendees, data];
    };
</script>

<div class="mainContainer">
    <p id="title">Book a reservation:</p>
    <form class="formContainer" on:submit|preventDefault={handleSubmit}>
        <label>
            Title:
            <input
                class="inputField"
                bind:value={$currentData.title}
                type="text"
            />
        </label>
        <label>
            Description:
            <input
                class="inputField"
                bind:value={$currentData.description}
                type="text"
            />
        </label>
        <label>
            Timespan:
            <select
                class="inputField"
                bind:value={$currentData.timeStart}
                name="date_start"
            >
                {#each times as time}
                    <option value={time}>{time}</option>
                {/each}
            </select>
            <span> -- </span>
            <select
                class="inputField"
                bind:value={$currentData.timeEnd}
                name="date_end"
            >
                {#each times as time}
                    <option value={time}>{time}</option>
                {/each}
            </select>
        </label>
        <div>
            Attendees:
            <SearchBar data={$users} {onAddAction} />
            <br />
            {#each $addedAttendees as attendee}
                <div class="addedUserContainer">
                    <p>{attendee.user_email}</p>
                    <button
                        on:click={() =>
                            ($addedAttendees = $addedAttendees.filter(
                                (x) => x.user_email !== attendee.user_email
                            ))}>X</button
                    >
                </div>
            {/each}
        </div>
        <button class="submitButton" type="submit">Book Reservation</button>
    </form>
</div>

<style>
    .formContainer {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    #title {
        font-size: 2rem;
        margin-bottom: 20px;
    }
    .timeRangeContainer {
        display: flex;
    }
    .inputField {
        border: 1px solid black;
    }
    .addedUserContainer {
        display: flex;
        justify-content: space-between;
    }
    .submitButton {
        margin-top: 20px;
        border: 1px solid black;
        border-radius: 3px;
    }
</style>
