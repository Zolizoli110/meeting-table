import React from 'react'
import { StyleSheet, View, Text } from 'react-native'

interface Props {
    name: string;
}

const AttendeeItem: React.FC<Props> = ({ name }) => {

    return (
        <View style={styles.container}>
            <Text>{name}</Text>
        </View>
    )
}
export default AttendeeItem;

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})