import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import TransferItem from '../components/TransferItem';
import { useWallet } from '../hooks/useWallet';
import { useTransferHistory } from '../hooks/useTransferHistory';
import { useAuth } from '../hooks/useAuth';
import { theme, createStyles, createScreenStyles } from '../constants';

interface HomeScreenProps {
  onSendMoney?: () => void;
  onRequestMoney?: () => void;
  onViewHistory?: () => void;
  onSignOut?: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  onSendMoney,
  onRequestMoney,
  onViewHistory,
  onSignOut,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  
  const { userEmail, token, logout } = useAuth();
  const { walletInfo, isLoading: walletLoading, refetch: refetchWallet } = useWallet(token);
  const { 
    transferHistory, 
    isLoading: transfersLoading, 
    refetch: refetchTransfers 
  } = useTransferHistory(token);

  const styles = createStyles(theme);
  const screenStyles = createScreenStyles(theme);

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

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              console.log('[HOME SCREEN] User signed out successfully');
              if (onSignOut) {
                onSignOut();
              }
            } catch (error) {
              console.error('[HOME SCREEN] Error signing out:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ],
    );
  };

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
    console.log('[HOME SCREEN] Balance visibility toggled', {
      isVisible: !isBalanceVisible,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <View style={[styles.container, localStyles.container]}>
      <ScrollView
        style={localStyles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.text.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[screenStyles.dashboard.header, localStyles.header]}>
          <View style={localStyles.headerContent}>
            <Text style={[styles.text.heading, localStyles.greeting]}>Welcome back!</Text>
            <TouchableOpacity 
              onPress={handleSignOut}
              activeOpacity={0.7}
              style={localStyles.signOutButton}
            >
              <MaterialIcons 
                name="logout" 
                size={24} 
                color={theme.colors.text.primary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Balance Card */}
        <View style={[screenStyles.dashboard.balanceCard, localStyles.balanceCard]}>
          <View style={localStyles.balanceHeader}>
            <Text style={[styles.text.secondary, localStyles.balanceLabel]}>Current Balance</Text>
            <TouchableOpacity 
              onPress={toggleBalanceVisibility}
              activeOpacity={0.7}
              style={localStyles.eyeButton}
            >
              <MaterialIcons 
                name={isBalanceVisible ? "visibility" : "visibility-off"} 
                size={20} 
                color={theme.colors.text.tertiary}
              />
            </TouchableOpacity>
          </View>
          <Text style={[styles.financial.balance, localStyles.balanceAmount]}>
            {isBalanceVisible 
              ? `${walletInfo?.currency || 'USD'} $${walletInfo?.balance.amount.toFixed(2) || '0.00'}`
              : `${walletInfo?.currency || 'USD'} $••••••`
            }
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={localStyles.quickActions}>
          <Text style={[styles.text.heading, localStyles.sectionTitle]}>Quick Actions</Text>
          <View style={localStyles.actionButtons}>
            <TouchableOpacity 
              style={localStyles.actionButton}
              onPress={onSendMoney}
              activeOpacity={0.7}
            >
              <View style={[styles.cardElevated, localStyles.actionIcon]}>
                <MaterialIcons 
                  name="send" 
                  size={24} 
                  color={theme.colors.text.primary}
                />
              </View>
              <Text style={[styles.text.secondary, localStyles.actionText]}>Send Money</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={localStyles.actionButton}
              onPress={onRequestMoney}
              activeOpacity={0.7}
            >
              <View style={[styles.cardElevated, localStyles.actionIcon]}>
                <MaterialIcons 
                  name="account-balance-wallet" 
                  size={24} 
                  color={theme.colors.text.primary}
                />
              </View>
              <Text style={[styles.text.secondary, localStyles.actionText]}>Request</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={localStyles.actionButton}
              onPress={onViewHistory}
              activeOpacity={0.7}
            >
              <View style={[styles.cardElevated, localStyles.actionIcon]}>
                <MaterialIcons 
                  name="history" 
                  size={24} 
                  color={theme.colors.text.primary}
                />
              </View>
              <Text style={[styles.text.secondary, localStyles.actionText]}>History</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Transfers */}
        <View style={localStyles.transfersSection}>
          <View style={localStyles.transfersHeader}>
            <Text style={[styles.text.heading, localStyles.sectionTitle]}>Recent Transfers</Text>
            <Text style={[styles.text.primary, localStyles.seeAll]}>See All</Text>
          </View>
          
          {walletLoading || transfersLoading ? (
            <View style={localStyles.loadingContainer}>
              <ActivityIndicator 
                size="small" 
                color={theme.colors.text.primary}
              />
            </View>
          ) : (
            <View style={localStyles.transfersList}>
              {transferHistory?.content.map((transfer) => (
                <TransferItem
                  key={transfer.id}
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

const localStyles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.spacing.screen.horizontal,
    paddingTop: theme.spacing.screen.top,
    paddingBottom: theme.spacing.lg,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  balanceCard: {
    backgroundColor: theme.colors.background.primary,
    marginHorizontal: theme.spacing.md,
    borderRadius: theme.layout.component.radiusLarge,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    shadowColor: theme.colors.shadow.dark,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 6,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  balanceLabel: {
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.financial.balance,
    marginBottom: theme.spacing.xs,
  },
  quickActions: {
    paddingHorizontal: theme.spacing.screen.horizontal,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
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
    backgroundColor: theme.colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  transfersSection: {
    paddingBottom: 100,
  },
  transfersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.screen.horizontal,
    marginBottom: theme.spacing.md,
  },
  seeAll: {
    fontSize: 16,
    color: theme.colors.text.primary,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  transfersList: {
    gap: theme.spacing.xs,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  eyeButton: {
    padding: theme.spacing.xs,
    borderRadius: theme.layout.component.radiusSmall,
    marginLeft: theme.spacing.xs,
    marginRight: -theme.spacing.xs,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  signOutButton: {
    padding: theme.spacing.xs,
    borderRadius: theme.layout.component.radiusSmall,
    marginLeft: theme.spacing.xs,
    marginRight: -theme.spacing.xs,
  },
});

export default HomeScreen; 