import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, Alert } from 'react-native';
import { Colors } from '../constants';
import { Spacing } from '../constants/spacing';
import { useWallet } from '../hooks';
import { BalanceCard, TransactionsList } from '../components/wallet';

interface HomeScreenProps {
  token?: string;
  onNavigateToTransfers?: () => void;
  onUnauthorized?: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ 
  token, 
  onNavigateToTransfers,
  onUnauthorized
}) => {
  const {
    walletInfo,
    transfers,
    loading,
    error,
    refreshing,
    refreshData,
    clearError,
  } = useWallet(token, onUnauthorized);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await refreshData();
    } catch (err) {
      Alert.alert('Error', 'Failed to refresh data. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleBalanceRefresh = async () => {
    if (!refreshing) {
      await handleRefresh();
    }
  };

  const handleViewAllTransfers = () => {
    if (onNavigateToTransfers) {
      onNavigateToTransfers();
    }
  };

  React.useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [
        { text: 'OK', onPress: clearError }
      ]);
    }
  }, [error, clearError]);

  return (
    <View style={styles.container} testID="home-screen">
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing || refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary.main}
            colors={[Colors.primary.main]}
          />
        }
      >
        <BalanceCard
          walletInfo={walletInfo}
          loading={loading}
          onRefresh={handleBalanceRefresh}
        />

        <TransactionsList
          transfers={transfers.slice(0, 5)}
          loading={loading}
          onRefresh={handleRefresh}
          onViewAll={handleViewAllTransfers}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Spacing.xl,
    paddingBottom: Spacing['4xl'],
  },
});

export default HomeScreen; 