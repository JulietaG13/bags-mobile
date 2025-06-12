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
  onSeeAllTransfers?: () => void;
  onSignOut?: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  onSendMoney,
  onRequestMoney,
  onViewHistory,
  onSeeAllTransfers,
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
    <View 
      style={[styles.container, localStyles.container]}
      testID="home-screen-container"
      accessibilityLabel="home-screen-container"
    >
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
        testID="home-screen-scroll-view"
        accessibilityLabel="home-screen-scroll-view"
      >
        {/* Header */}
        <View 
          style={[screenStyles.dashboard.header, localStyles.header]}
          testID="home-screen-header"
          accessibilityLabel="home-screen-header"
        >
          <View style={localStyles.headerContent}>
            <Text 
              style={[styles.text.heading, localStyles.greeting]}
              testID="home-screen-greeting"
              accessibilityLabel="home-screen-greeting"
            >
              Welcome back!
            </Text>
            <TouchableOpacity 
              onPress={handleSignOut}
              activeOpacity={0.7}
              style={localStyles.signOutButton}
              testID="home-sign-out-button"
              accessibilityLabel="home-sign-out-button"
            >
              <MaterialIcons 
                name="logout" 
                size={24} 
                color={theme.colors.text.primary}
                testID="home-sign-out-icon"
                accessibilityLabel="home-sign-out-icon"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Balance Card */}
        <View 
          style={[screenStyles.dashboard.balanceCard, localStyles.balanceCard]}
          testID="home-balance-card"
          accessibilityLabel="home-balance-card"
        >
          <View style={localStyles.balanceHeader}>
            <Text 
              style={[styles.text.secondary, localStyles.balanceLabel]}
              testID="home-balance-label"
              accessibilityLabel="home-balance-label"
            >
              Current Balance
            </Text>
            <TouchableOpacity 
              onPress={toggleBalanceVisibility}
              activeOpacity={0.7}
              style={localStyles.eyeButton}
              testID="home-balance-visibility-toggle"
              accessibilityLabel="home-balance-visibility-toggle"
            >
              <MaterialIcons 
                name={isBalanceVisible ? "visibility" : "visibility-off"} 
                size={20} 
                color={theme.colors.text.tertiary}
                testID="home-balance-visibility-icon"
                accessibilityLabel="home-balance-visibility-icon"
              />
            </TouchableOpacity>
          </View>
          <Text 
            style={[styles.financial.balance, localStyles.balanceAmount]}
            testID="home-balance-amount"
            accessibilityLabel="home-balance-amount"
          >
            {isBalanceVisible 
              ? `${walletInfo?.currency || 'USD'} $${walletInfo?.balance.amount.toFixed(2) || '0.00'}`
              : `${walletInfo?.currency || 'USD'} $••••••`
            }
          </Text>
        </View>

        {/* Quick Actions */}
        <View 
          style={localStyles.quickActions}
          testID="home-quick-actions-section"
          accessibilityLabel="home-quick-actions-section"
        >
          <Text 
            style={[styles.text.heading, localStyles.sectionTitle]}
            testID="home-quick-actions-title"
            accessibilityLabel="home-quick-actions-title"
          >
            Quick Actions
          </Text>
          <View style={localStyles.actionButtons}>
            <TouchableOpacity 
              style={localStyles.actionButton}
              onPress={onSendMoney}
              activeOpacity={0.7}
              testID="home-send-money-button"
              accessibilityLabel="home-send-money-button"
            >
              <View style={[styles.cardElevated, localStyles.actionIcon]}>
                <MaterialIcons 
                  name="send" 
                  size={24} 
                  color={theme.colors.text.primary}
                  testID="home-send-money-icon"
                  accessibilityLabel="home-send-money-icon"
                />
              </View>
              <Text 
                style={[styles.text.secondary, localStyles.actionText]}
                testID="home-send-money-text"
                accessibilityLabel="home-send-money-text"
              >
                Send Money
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={localStyles.actionButton}
              onPress={onRequestMoney}
              activeOpacity={0.7}
              testID="home-request-money-button"
              accessibilityLabel="home-request-money-button"
            >
              <View style={[styles.cardElevated, localStyles.actionIcon]}>
                <MaterialIcons 
                  name="account-balance-wallet" 
                  size={24} 
                  color={theme.colors.text.primary}
                  testID="home-request-money-icon"
                  accessibilityLabel="home-request-money-icon"
                />
              </View>
              <Text 
                style={[styles.text.secondary, localStyles.actionText]}
                testID="home-request-money-text"
                accessibilityLabel="home-request-money-text"
              >
                Request
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={localStyles.actionButton}
              onPress={onViewHistory}
              activeOpacity={0.7}
              testID="home-view-history-button"
              accessibilityLabel="home-view-history-button"
            >
              <View style={[styles.cardElevated, localStyles.actionIcon]}>
                <MaterialIcons 
                  name="history" 
                  size={24} 
                  color={theme.colors.text.primary}
                  testID="home-view-history-icon"
                  accessibilityLabel="home-view-history-icon"
                />
              </View>
              <Text 
                style={[styles.text.secondary, localStyles.actionText]}
                testID="home-view-history-text"
                accessibilityLabel="home-view-history-text"
              >
                History
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Transfers */}
        <View 
          style={localStyles.transfersSection}
          testID="home-transfers-section"
          accessibilityLabel="home-transfers-section"
        >
          <View style={localStyles.transfersHeader}>
            <Text 
              style={[styles.text.heading, localStyles.sectionTitle]}
              testID="home-transfers-title"
              accessibilityLabel="home-transfers-title"
            >
              Recent Transfers
            </Text>
            <TouchableOpacity 
              onPress={onSeeAllTransfers}
              activeOpacity={0.7}
              testID="home-see-all-transfers-button"
              accessibilityLabel="home-see-all-transfers-button"
            >
              <Text 
                style={[styles.text.primary, localStyles.seeAll]}
                testID="home-see-all-transfers"
                accessibilityLabel="home-see-all-transfers"
              >
                See All
              </Text>
            </TouchableOpacity>
          </View>
          
          {walletLoading || transfersLoading ? (
            <View 
              style={localStyles.loadingContainer}
              testID="home-loading-container"
              accessibilityLabel="home-loading-container"
            >
              <ActivityIndicator 
                size="small" 
                color={theme.colors.text.primary}
                testID="home-loading-indicator"
                accessibilityLabel="home-loading-indicator"
              />
            </View>
          ) : (
            <View 
              style={localStyles.transfersList}
              testID="home-transfers-list"
              accessibilityLabel="home-transfers-list"
            >
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