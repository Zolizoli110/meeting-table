import axios from "axios";
import { derived, readable, writable, type Readable } from "svelte/store";
import type { currentDataType, MeetingRoom, MeetingRoomStore, Reservation, UserStore } from "../types";

export const meetingRooms: MeetingRoomStore = writable([]);

const createEventStore = () => {
    const { subscribe, update, set } = writable<Reservation>(undefined);

    const getEvents = async (room_id: number) => {
        const res = await axios({
            method: "get",
            url: `http://localhost:3000/api/meetingroom/${room_id}`,
        });
        set(res.data.reservations.map((x: any) => {
            return {
                title: x.res_name,
                start: x.date_start,
                end: x.date_end,
            };
        }));
    }

    return {
        subscribe,
        update,
        set,
        getEvents
    }
}
export const events = createEventStore();

export const users: UserStore = writable([]);

export const addedAttendees: UserStore = writable([]);

export const currentDate = writable()

function createCurrentDataStore() {
    const { subscribe, set, update } = writable<currentDataType>({
        day: "",
        title: "",
        description: "",
        attendees: [],
        roomId: 0,
        timeStart: "",
        timeEnd: ""
    });

    return {
        subscribe,
        set,
        update
    }
}
export const currentData = createCurrentDataStore();

export const roomIdStore = derived(currentData, ($currentData) => $currentData.roomId)