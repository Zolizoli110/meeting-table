import React, { useContext, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { VStack } from 'react-native-flex-layout'
import CalendarScreen from './CalendarScreen'
import { FlatList, GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler'
import { Button } from '@react-native-material/core'
import { EventsContext } from '../utils/EventsContext'
import AttendeeItem from './AttendeeItem'

const StatusScreen = () => {
    const { isOccupied, reservationInfo } = useContext(EventsContext);

    let _isOccupied = isOccupied();
    let _reservationInfo = reservationInfo();

    const startText = _isOccupied ? 'Remaining time of meeting: ' : 'Remaining time till next meeting:'
    const lightColor = _isOccupied ? 'red' : 'green';
    const mediumColor = _isOccupied ? '#bf1f1f' : '#197419';
    const darkColor = _isOccupied ? '#941616' : '#006400';

    useEffect(() => {
        setInterval(() => {
            _reservationInfo = reservationInfo();
        }, 10000)
    }, [])

    return (
        <View style={[styles.container, { backgroundColor: lightColor }]}>
            <Text style={{ flex: 2, textAlign: 'center', textAlignVertical: 'center', fontSize: 40 }}>
                {startText}
            </Text>
            <Text style={{ flex: 2, textAlign: 'center', textAlignVertical: 'center', fontSize: 40 }}>
                {_reservationInfo.remainingOrNextTime}
            </Text>
            <View style={{ flex: 1, backgroundColor: darkColor, width: '75%', alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }} >
                <Text style={{ width: '100%', fontSize: 30, textAlign: 'center' }}>
                    Attendees :
                </Text>
            </View>
            <View style={{ flex: 7, backgroundColor: mediumColor, width: '75%', alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }} >
                <FlatList data={_reservationInfo.attendees} renderItem={({ item }) => <AttendeeItem name={item} />} />
            </View>
            <Text style={{ flex: 2, textAlign: 'center', textAlignVertical: 'center', fontSize: 30 }}>{_reservationInfo.nextMeetingStart}</Text>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    qSButton: {
        height: 50,
        width: 150,
        alignSelf: 'center', justifyContent: 'center'
    }
});
export default StatusScreen;