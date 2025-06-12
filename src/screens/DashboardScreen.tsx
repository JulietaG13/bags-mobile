import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './HomeScreen';
import SendScreen from './SendScreen';
import DebinScreen from './DebinScreen';
import BottomNavigation, { TabType } from '../components/BottomNavigation';
import { theme } from '../constants';

interface DashboardScreenProps {
  onSignOut?: () => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ onSignOut }) => {
  const [activeTab, setActiveTab] = useState<TabType>('home');

  const handleTabPress = (tab: TabType) => {
    setActiveTab(tab);
  };

  // Navigation functions for HomeScreen quick actions
  const handleSendMoney = () => {
    console.log('[DASHBOARD] Send Money quick action pressed');
    setActiveTab('send');
  };

  const handleRequestMoney = () => {
    console.log('[DASHBOARD] Request Money quick action pressed');
    setActiveTab('debin');
  };

  const handleViewHistory = () => {
    // Could navigate to a dedicated history screen or show all transfers
    console.log('[DASHBOARD] View History quick action pressed');
    // For now, we'll stay on home screen since we don't have a dedicated history screen
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'send':
        return <SendScreen />;
      case 'home':
        return (
          <HomeScreen 
            onSendMoney={handleSendMoney}
            onRequestMoney={handleRequestMoney}
            onViewHistory={handleViewHistory}
            onSignOut={onSignOut}
          />
        );
      case 'debin':
        return <DebinScreen />;
      default:
        return (
          <HomeScreen 
            onSendMoney={handleSendMoney}
            onRequestMoney={handleRequestMoney}
            onViewHistory={handleViewHistory}
            onSignOut={onSignOut}
          />
        );
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
    backgroundColor: theme.colors.background.primary, // Pure white
  },
  content: {
    flex: 1,
  },
});

export default DashboardScreen; 