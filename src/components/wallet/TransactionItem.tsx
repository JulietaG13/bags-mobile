import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography } from '../../constants';
import { Spacing, Layout } from '../../constants/spacing';
import { TransferRecord } from '../../types/wallet';

interface TransactionItemProps {
  transfer: TransferRecord;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transfer }) => {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getAmountColor = (direction: TransferRecord['direction']) => {
    switch (direction) {
      case 'IN':
        return Colors.financial.income;
      case 'OUT':
        return Colors.financial.expense;
      default:
        return Colors.text.primary;
    }
  };

  const getAmountPrefix = (direction: TransferRecord['direction']) => {
    switch (direction) {
      case 'IN':
        return '+';
      case 'OUT':
        return '-';
      default:
        return '';
    }
  };

  const getTransferDescription = (transfer: TransferRecord) => {
    if (transfer.direction === 'IN') {
      return transfer.fromEmail;
    } else {
      return transfer.toEmail;
    }
  };

  return (
    <View style={styles.container} testID={`transfer-${transfer.transferNumber}`}>
      <View style={styles.mainContent}>
        <View style={styles.leftSection}>
          <View style={[
            styles.typeIndicator,
            { backgroundColor: transfer.direction === 'IN' ? Colors.financial.income : Colors.financial.expense }
          ]} />
          <View style={styles.details}>
            <Text style={styles.description} numberOfLines={2}>
              {getTransferDescription(transfer)}
            </Text>
            <Text style={styles.date}>{formatDate(transfer.timestamp)}</Text>
          </View>
        </View>

        <View style={styles.rightSection}>
          <Text
            style={[
              styles.amount,
              { color: getAmountColor(transfer.direction) }
            ]}
            testID={`transfer-amount-${transfer.transferNumber}`}
          >
            {getAmountPrefix(transfer.direction)}{formatCurrency(transfer.amount, 'USD')}
          </Text>
          <Text style={styles.status}>
            {transfer.direction === 'IN' ? 'Received' : 'Sent'}
          </Text>
        </View>
      </View>
      
      <Text style={styles.transferNumber}>#{transfer.transferNumber}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border.light,
    minHeight: 70,
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  typeIndicator: {
    width: 3,
    height: Layout.component.iconMedium,
    backgroundColor: Colors.primary.main,
    borderRadius: Layout.component.radiusSmall,
    marginRight: Spacing.sm,
    marginTop: 0,
  },
  details: {
    flex: 1,
    marginRight: Spacing.md,
  },
  description: {
    ...Typography.textStyles.bodyMedium,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
    minHeight: 20,
    fontWeight: '500',
  },
  date: {
    ...Typography.textStyles.caption,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
    fontWeight: '500',
    fontSize: 12,
  },
  transferNumber: {
    ...Typography.textStyles.caption,
    color: Colors.text.tertiary,
    fontSize: 10,
    fontWeight: '400',
    textAlign: 'left',
    width: '100%',
  },
  rightSection: {
    alignItems: 'flex-end',
    marginTop: Spacing.xs,
    minWidth: 90,
  },
  amount: {
    ...Typography.textStyles.amount,
    marginBottom: Spacing.xs,
    textAlign: 'right',
    minHeight: 20,
    fontWeight: '600',
  },
  status: {
    ...Typography.textStyles.caption,
    textTransform: 'capitalize',
    color: Colors.text.tertiary,
    textAlign: 'right',
    fontSize: 10,
    fontWeight: '400',
  },
});

export default TransactionItem; 