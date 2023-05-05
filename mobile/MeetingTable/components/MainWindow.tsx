import { AppBar, Flex } from '@react-native-material/core';
import React, { useContext, useEffect, useState } from 'react'
import { State, GestureDetector, Gesture, GestureHandlerRootView, PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { StyleSheet, Text, View } from 'react-native';
import StatusScreen from './StatusScreen';
import CalendarScreen from './CalendarScreen';
import Swipeable from 'react-native-gesture-handler/Swipeable'
import Animated, { useAnimatedGestureHandler, useSharedValue, withSpring } from 'react-native-reanimated';
import PagerView from "react-native-pager-view";
import { EventsContext } from '../utils/EventsContext';

const MainWindow = () => {
    const [screenNumber, setScreenNumber] = useState(0);
    const { loadEvents } = useContext(EventsContext);

    const handlePageSelected = (e: any) => {
        setScreenNumber(e.nativeEvent.position);
    };

    useEffect(() => {
        loadEvents();

        const interval = setInterval(() => {
            loadEvents();
        }, 60 * 1000);

        return () => {
            clearInterval(interval);
        };
    }, [])

    return (
        <PagerView style={styles.viewPager} initialPage={0} onPageSelected={handlePageSelected}>
            <View style={styles.page} key={1}>
                <StatusScreen />
            </View>
            {/* <View style={styles.page} key={2} collapsable={false}>
                <CalendarScreen />
            </View> */}
        </PagerView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewPager: {
        flex: 1,
    },
    page: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
export default MainWindow;