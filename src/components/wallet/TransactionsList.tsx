import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Colors, Typography } from '../../constants';
import { Spacing, Layout } from '../../constants/spacing';
import { TransferRecord } from '../../types/wallet';
import TransactionItem from './TransactionItem';

interface TransactionsListProps {
  transfers: TransferRecord[];
  loading?: boolean;
  onViewAll?: () => void;
}

const TransactionsList: React.FC<TransactionsListProps> = ({
  transfers,
  loading,
  onViewAll,
}) => {
  const renderTransfer = ({ item }: { item: TransferRecord }) => (
    <TransactionItem transfer={item} />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Recent Transfers</Text>
      {transfers.length > 0 && onViewAll && (
        <TouchableOpacity onPress={onViewAll} testID="view-all-transfers">
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No transfers yet</Text>
      <Text style={styles.emptySubtitle}>
        Your recent transfers will appear here
      </Text>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Loading transfers...</Text>
    </View>
  );

  return (
    <View style={styles.container} testID="transfers-list">
      {renderHeader()}
      
      {loading ? (
        renderLoadingState()
      ) : transfers.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={transfers}
          renderItem={renderTransfer}
          keyExtractor={(item) => item.transferNumber}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          style={styles.list}
        />
      )}


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.primary,
    borderRadius: Layout.component.radiusLarge,
    marginHorizontal: Spacing.screen.horizontal,
    marginVertical: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border.light,
    shadowColor: Colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    backgroundColor: Colors.background.secondary,
  },
  title: {
    ...Typography.textStyles.h4,
    color: Colors.text.primary,
  },
  viewAllText: {
    ...Typography.textStyles.labelMedium,
    color: Colors.primary.main,
  },
  list: {
    maxHeight: 400,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing['4xl'],
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    ...Typography.textStyles.h4,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...Typography.textStyles.bodyMedium,
    color: Colors.text.tertiary,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: Spacing['3xl'],
    paddingHorizontal: Spacing.xl,
  },
  loadingText: {
    ...Typography.textStyles.bodyMedium,
    color: Colors.text.tertiary,
  },

});

export default TransactionsList; 