import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './HomeScreen';
import SendScreen from './SendScreen';
import DebinScreen from './DebinScreen';
import HistoryScreen from './HistoryScreen';
import BottomNavigation, { TabType } from '../components/BottomNavigation';
import { theme } from '../constants';

interface DashboardScreenProps {
  onSignOut?: () => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ onSignOut }) => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [showHistory, setShowHistory] = useState(false);

  const handleTabPress = (tab: TabType) => {
    setActiveTab(tab);
    setShowHistory(false); // Hide history when switching tabs
  };

  // Navigation functions for HomeScreen quick actions
  const handleSendMoney = () => {
    console.log('[DASHBOARD] Send Money quick action pressed');
    setActiveTab('send');
    setShowHistory(false);
  };

  const handleRequestMoney = () => {
    console.log('[DASHBOARD] Request Money quick action pressed');
    setActiveTab('debin');
    setShowHistory(false);
  };

  const handleViewHistory = () => {
    console.log('[DASHBOARD] View History quick action pressed');
    setShowHistory(true);
  };

  const handleSeeAllTransfers = () => {
    console.log('[DASHBOARD] See All transfers pressed');
    setShowHistory(true);
  };

  const handleBackFromHistory = () => {
    console.log('[DASHBOARD] Back from history pressed');
    setShowHistory(false);
  };

  const renderActiveScreen = () => {
    // Show history screen if requested
    if (showHistory) {
      return <HistoryScreen onBack={handleBackFromHistory} />;
    }

    switch (activeTab) {
      case 'send':
        return <SendScreen />;
      case 'home':
        return (
          <HomeScreen 
            onSendMoney={handleSendMoney}
            onRequestMoney={handleRequestMoney}
            onViewHistory={handleViewHistory}
            onSeeAllTransfers={handleSeeAllTransfers}
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
            onSeeAllTransfers={handleSeeAllTransfers}
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