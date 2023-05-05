import { Button, Flex, HStack, VStack } from '@react-native-material/core';
import React from 'react'
import { StyleSheet, View, Text } from "react-native"

const NewEventScreen: React.FC<{ addEvent: () => void }> = ({ addEvent }) => {

    return (
        <View style={styles.mainContainer}>
            <Text>Lmao</Text>
            <View style={styles.doneButton}>
                <Button color='green' title="done" onTouchEnd={addEvent} />
            </View>
        </View>
    )
}
export default NewEventScreen;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "red",
    },
    doneButton: {
        backgroundColor: 'white',
        padding: 5,
        alignItems: 'flex-end'
    }
})