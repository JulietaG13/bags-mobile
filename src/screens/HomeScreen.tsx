import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import TransferItem from '../components/TransferItem';
import { useWallet } from '../hooks/useWallet';
import { useTransferHistory } from '../hooks/useTransferHistory';
import { useAuth } from '../hooks/useAuth';

interface HomeScreenProps {
  // Props for potential future customization
}

const HomeScreen: React.FC<HomeScreenProps> = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Use real hooks for data
  const { userEmail } = useAuth();
  const { walletInfo, isLoading: walletLoading, refetch: refetchWallet } = useWallet();
  const { 
    transferHistory, 
    isLoading: transfersLoading, 
    refetch: refetchTransfers 
  } = useTransferHistory();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetchWallet(),
        refetchTransfers()
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#007AFF"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome back!</Text>
          <MaterialIcons name="notifications-none" size={24} color="#000" />
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Current Balance</Text>
            <MaterialIcons name="visibility" size={20} color="#8E8E93" />
          </View>
          <Text style={styles.balanceAmount}>
            {walletInfo?.currency || 'USD'} ${walletInfo?.balance.amount.toFixed(2) || '0.00'}
          </Text>
          <Text style={styles.balanceSubtext}>Available to spend</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <View style={styles.actionButton}>
              <View style={styles.actionIcon}>
                <MaterialIcons name="send" size={24} color="#007AFF" />
              </View>
              <Text style={styles.actionText}>Send Money</Text>
            </View>
            <View style={styles.actionButton}>
              <View style={styles.actionIcon}>
                <MaterialIcons name="account-balance-wallet" size={24} color="#34C759" />
              </View>
              <Text style={styles.actionText}>Request</Text>
            </View>
            <View style={styles.actionButton}>
              <View style={styles.actionIcon}>
                <MaterialIcons name="history" size={24} color="#FF9500" />
              </View>
              <Text style={styles.actionText}>History</Text>
            </View>
          </View>
        </View>

        {/* Recent Transfers */}
        <View style={styles.transfersSection}>
          <View style={styles.transfersHeader}>
            <Text style={styles.sectionTitle}>Recent Transfers</Text>
            <Text style={styles.seeAll}>See All</Text>
          </View>
          
          {walletLoading || transfersLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#007AFF" />
            </View>
          ) : (
            <View style={styles.transfersList}>
              {transferHistory?.content.map((transfer) => (
                <TransferItem
                  key={transfer.transferNumber}
                  transfer={transfer}
                  currentUserEmail={userEmail || 'user@example.com'}
                />
              )) || []}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
  },
  balanceCard: {
    backgroundColor: '#007AFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  balanceSubtext: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000000',
    textAlign: 'center',
  },
  transfersSection: {
    paddingBottom: 100,
  },
  transfersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  transfersList: {
    gap: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
});

export default HomeScreen; 