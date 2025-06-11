import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './HomeScreen';
import SendScreen from './SendScreen';
import DebinScreen from './DebinScreen';
import BottomNavigation, { TabType } from '../components/BottomNavigation';

const DashboardScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');

  const handleTabPress = (tab: TabType) => {
    setActiveTab(tab);
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'send':
        return <SendScreen />;
      case 'home':
        return <HomeScreen />;
      case 'debin':
        return <DebinScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        {renderActiveScreen()}
      </View>
      <BottomNavigation
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    flex: 1,
  },
});

export default DashboardScreen; 