import axios from 'axios';
import { add, compareDesc, differenceInMinutes, sub } from 'date-fns';
import React, { createContext, useState, useContext, PropsWithChildren } from 'react';
import Reservation from 'react-native-calendars/src/agenda/reservation-list/reservation';
import moment from "moment";

interface Event {
    id: number;
    title: string;
    start: Date;
    end: Date;
}

interface ReservationFromBackend {
    res_id: string;
    res_name: string;
    room_id: string;
    date_start: Date;
    date_end: Date;
    description?: string;
    userEmails: string[];
    arranger_email: string;
    createdAt: Date;
}

interface EventsContextType {
    events: ReservationFromBackend[];
    isOccupied: () => boolean;
    loadEvents: () => Promise<void>;
    reservationInfo: () => ReservationInfo
}

interface ReservationInfo {
    attendees: string[];
    nextMeetingStart: string;
    remainingOrNextTime: string;
}

const EventsContext = createContext<EventsContextType>({
    events: [],
    isOccupied: () => true,
    loadEvents: async () => { },
    reservationInfo: () => { return { attendees: [], nextMeetingStart: '', remainingOrNextTime: '' } }
});

const EventsProvider = ({ children }: PropsWithChildren) => {
    const [events, setEvents] = useState<ReservationFromBackend[]>([]);

    const loadEvents = async () => {
        try {
            const response = await axios({
                url: 'http://192.168.0.185:3000/api/meetingroom/357c18c0ce401ad83a9ae0a20245c38d60425ebffe7210b6a21d5b06621c26b7@group.calendar.google.com',
                method: 'get'
            })
            const reservations: ReservationFromBackend[] = response.data.reservations.sort((a: ReservationFromBackend, b: ReservationFromBackend) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime());
            setEvents(reservations)
        } catch (error) {
            console.log(error);
        }
    }

    const getCurrentMeeting = (): ReservationFromBackend | undefined => {
        const now = new Date();
        for (const event of events) {
            if (now >= new Date(event.date_start) && now <= new Date(event.date_end)) {
                return event;
            }
        }
        return undefined;
    }

    const nextMeeting = () => {
        const now = new Date();
        let nextMeeting: ReservationFromBackend | undefined = undefined;
        for (const event of events) {
            const eventStart = new Date(event.date_start)
            const temp = compareDesc(now, eventStart);
            if (temp == 1) {
                nextMeeting = event;
                break;
            }
        }
        if (nextMeeting) {
            return nextMeeting;
        } else {
            return undefined;
        }
    }

    const reservationInfo = (): ReservationInfo => {
        // next and current meeting objects
        const _nextMeeting = nextMeeting();
        const _currentMeeting = getCurrentMeeting();

        const now = new Date();
        let nextMeetingText: string;

        if (_nextMeeting) {
            if (new Date(_nextMeeting.date_start).getDay() !== now.getDay()) {
                nextMeetingText = `there are no more meetings today`
            } else {
                nextMeetingText = `Next meeting starts at: \n ${moment(_nextMeeting.date_start).format("MMM DD - HH:mm")}`
            }
        } else {
            nextMeetingText = `there are no more meetings today`
        }

        if (isOccupied()) {
            if (_nextMeeting) {
                // there is a meeting currently going on and there is at least 1 other meeting today
                return {
                    attendees: _currentMeeting!.userEmails,
                    nextMeetingStart: nextMeetingText,
                    remainingOrNextTime: `${differenceInMinutes(new Date(_currentMeeting!.date_end), now)} minutes`
                }
            } else {
                // there is a meeting right now but no more meetings today
                return {
                    attendees: _currentMeeting!.userEmails,
                    nextMeetingStart: nextMeetingText,
                    remainingOrNextTime: `${differenceInMinutes(new Date(_currentMeeting!.date_end), now)} minutes`
                }
            }
        } else {
            if (_nextMeeting) {
                // there isn't a meeting going on but there's at least 1 more meeting
                return {
                    attendees: _nextMeeting.userEmails,
                    nextMeetingStart: nextMeetingText,
                    remainingOrNextTime: `${differenceInMinutes(new Date(_nextMeeting.date_start), now)} minutes`
                }
            } else {
                // there isn't a meeting now and no more meetings today
                return {
                    attendees: [],
                    nextMeetingStart: nextMeetingText,
                    remainingOrNextTime: '-'
                }
            }
        }
    }

    const isOccupied = () => {
        const now = new Date();
        for (const event of events) {
            if (now >= new Date(event.date_start) && now <= new Date(event.date_end)) {
                return true;
            }
        }
        return false;
    }

    const ContextValue: EventsContextType = {
        events,
        isOccupied,
        loadEvents,
        reservationInfo
    }

    return (
        <EventsContext.Provider value={ContextValue}>
            {children}
        </EventsContext.Provider>
    );
};

export { EventsContext, EventsProvider };
