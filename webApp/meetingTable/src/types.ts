import type { Writable } from "svelte/store";

export type Reservation = {
    resName: string;
    roomId: number;
    dateStart: string;
    dateEnd: string;
    description?: string;
    userEmails?: string[];
    arrangerEmail: string;
}

export interface User {
    user_email: string;
    reservations: Reservation[];
    reservationsWhereArranger: Reservation[];
    role_name: string;
    searchTerms: string;
}

export type MeetingRoom = {
    room_id: number,
    name: string,
}

export type MeetingRoomStore = {
    subscribe: Writable<MeetingRoom[]>["subscribe"]
}

export type UserStore = {
    subscribe: Writable<User[]>["subscribe"]
}

type RenameByT<T, U> = {
    [K in keyof U as K extends keyof T
    ? T[K] extends string
    ? T[K]
    : never
    : K]: K extends keyof U ? U[K] : never;
};

export type currentDataType = {
    title: string;
    description: string;
    roomId: number;
    day: string;
    timeStart: string;
    timeEnd: string;
    attendees: User[];
}