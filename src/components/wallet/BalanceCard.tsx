import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography } from '../../constants';
import { Spacing, Layout } from '../../constants/spacing';
import { WalletInfo } from '../../types/wallet';

interface BalanceCardProps {
  walletInfo: WalletInfo | null;
  loading?: boolean;
  onRefresh?: () => void;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ walletInfo, loading, onRefresh }) => {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onRefresh}
      disabled={loading}
      testID="balance-card"
    >
      <View style={styles.header}>
        <Text style={styles.title}>Total Balance</Text>
      </View>

      <View style={styles.balanceContainer}>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : walletInfo ? (
          <>
            <Text style={styles.balanceAmount} testID="balance-amount">
              {formatCurrency(walletInfo.balance.amount, walletInfo.currency)}
            </Text>
            <Text style={styles.currency}>{walletInfo.currency}</Text>
          </>
        ) : (
          <Text style={styles.errorText}>Unable to load balance</Text>
        )}
      </View>

      <Text style={styles.refreshHint}>Tap to refresh</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.primary,
    borderRadius: Layout.component.radiusLarge,
    padding: Spacing['2xl'],
    marginHorizontal: Spacing.screen.horizontal,
    marginVertical: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border.light,
    shadowColor: Colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
    minHeight: 140,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.textStyles.labelLarge,
    color: Colors.text.secondary,
    minHeight: 20,
  },
  lastUpdated: {
    ...Typography.textStyles.caption,
    color: Colors.text.tertiary,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.xl,
    flexWrap: 'wrap',
  },
  balanceAmount: {
    ...Typography.textStyles.balance,
    color: Colors.text.primary,
    marginRight: Spacing.xs,
    minHeight: 40,
  },
  currency: {
    ...Typography.textStyles.labelMedium,
    color: Colors.text.tertiary,
  },
  loadingText: {
    ...Typography.textStyles.bodyMedium,
    color: Colors.text.tertiary,
    minHeight: 22,
  },
  errorText: {
    ...Typography.textStyles.bodyMedium,
    color: Colors.semantic.error,
    minHeight: 22,
  },
  refreshHint: {
    ...Typography.textStyles.caption,
    color: Colors.text.tertiary,
    textAlign: 'center',
    minHeight: 16,
  },
});

export default BalanceCard; 