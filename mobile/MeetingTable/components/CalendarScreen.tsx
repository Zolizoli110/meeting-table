import React, { useState } from 'react'
import groupBy from 'lodash/groupBy';
//@ts-ignore
import EventCalendar from "react-native-events-calendar";
import { Alert, Dimensions, Platform, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import StatusScreen from './StatusScreen';
import { Calendar, CalendarProvider, CalendarUtils, ExpandableCalendar, TimelineEventProps, TimelineList, TimelineProps, Timeline, TimelineListProps } from 'react-native-calendars';
import { Event } from 'react-native-calendars/src/timeline/EventBlock';
import { add } from 'date-fns';
import NewEventScreen from './NewEventScreen';
import { FAB, Snackbar } from '@react-native-material/core';

const CalendarScreen: React.FC = () => {
    const [isNewEventScreen, setIsNewEventScreen] = useState(false);

    // let eventsByDate: { [date: string]: Event[] } = {
    //     "2023-04-14": [
    //         { start: new Date().toISOString(), end: new Date().toISOString(), title: "daily" }
    //     ]
    // }
    let events: TimelineEventProps[] = [
        {
            start: new Date().toISOString(),
            end: add(new Date, { hours: 1 }).toISOString(),
            title: "lao",
            summary: "daily standup meeting"
        }
    ]
    let eventsByDate = groupBy(events, e => CalendarUtils.getCalendarDateString(e.start)) as {
        [key: string]: TimelineEventProps[];
    }

    const createNewEvent = () => {
        setIsNewEventScreen(true);
    }
    const approveNewEvent = () => {
        console.log('new event approved')
    }

    const timelineProps: Partial<TimelineProps> = {
        format24h: true,
        onBackgroundLongPress: createNewEvent,
        onBackgroundLongPressOut: approveNewEvent,
        // start: 0,
        // end: 24,
        unavailableHours: [{ start: 0, end: 6 }, { start: 22, end: 24 }],
        rightEdgeSpacing: 24,
    };

    const onDateChange = () => {
        console.log('date changed')
    }
    const onMonthChange = () => {
        console.log('month changed')
    }

    const addEvent = () => {
        setIsNewEventScreen(false);
        console.log('event added')
    }

    return (

        <View>
            {isNewEventScreen ? <NewEventScreen addEvent={addEvent} /> :
                (
                    <View style={{ flex: 1 }}>
                        <EventCalendar
                            events={events}
                            width={Dimensions.get('window').width}
                            format24h={true}
                            size={5}
                            scrollToFirst={true}
                        />
                        <FAB onTouchEnd={createNewEvent} style={styles.FAB} label="New Meeting" variant='extended' />
                    </View>
                    // < CalendarProvider
                    //     date={new Date().toISOString()}
                    //     onDateChanged={onDateChange}
                    //     onMonthChange={onMonthChange}
                    //     showTodayButton
                    //     numberOfDays={1}
                    // >
                    //     <ExpandableCalendar
                    //         firstDay={1}
                    //     />
                    //     <TimelineList
                    //         events={eventsByDate}
                    //         timelineProps={timelineProps}
                    //         showNowIndicator
                    //         scrollToNow
                    //         initialTime={{ hour: 8, minutes: 0 }}
                    //     />
                    // </CalendarProvider >
                )}
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'yellow',
    },
    FAB: {
        width: 170,
        alignSelf: 'flex-end',
        margin: 10
    }
})
export default CalendarScreen;