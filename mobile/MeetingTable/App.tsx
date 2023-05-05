import React from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import StatusScreen from './components/StatusScreen';
import TopBar from './components/TopBar';
import SwipeableView from './components/MainWindow';
import MainWindow from './components/MainWindow';
import PagerView from 'react-native-pager-view';
import CalendarScreen from './components/CalendarScreen';
import { Flex } from '@react-native-material/core';
import { EventsProvider } from './utils/EventsContext';

export default function App() {
  return (
    <EventsProvider>
      <View style={{ flex: 1 }}>
        <StatusBar hidden />
        <TopBar />
        <MainWindow />
      </View>
    </EventsProvider>
  );
}

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
    justifyContent: 'center',
    alignItems: 'center',
  },
});
