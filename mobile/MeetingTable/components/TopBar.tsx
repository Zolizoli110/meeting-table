import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native'
import { Button } from '@react-native-material/core'
const TopBar = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    const formattedTime = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;

    return (
        <View style={styles.topBar}>
            <Text style={styles.timeText}>
                {formattedTime}
            </Text>
        </View>
    )
}
const styles = StyleSheet.create({
    topBar: {
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black'
    },
    timeText: {
        color: 'white',
        fontSize: 50,
    }
});
export default TopBar;