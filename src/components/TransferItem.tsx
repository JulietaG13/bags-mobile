import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TransferRecord } from '../types/wallet';
import { theme, createStyles } from '../constants';

interface TransferItemProps {
  transfer: TransferRecord;
  currentUserEmail?: string;
}

const TransferItem: React.FC<TransferItemProps> = ({ transfer, currentUserEmail }) => {
  const isIncoming = transfer.type === 'IN';
  const isExternal = transfer.type === 'EXTERNAL_LOAD';
  
  let amount: string; 
  let otherUserEmail: string;
  let actionText: string;
  
  if (isExternal) {
    amount = `+$${transfer.amount.toFixed(2)}`;
    otherUserEmail = 'External Load';
    actionText = 'Loaded from';
  } else if (isIncoming) {
    amount = `+$${transfer.amount.toFixed(2)}`;
    otherUserEmail = transfer.fromParticipant.email;
    actionText = 'Received from';
  } else {
    amount = `-$${transfer.amount.toFixed(2)}`;
    otherUserEmail = transfer.toParticipant.email;
    actionText = 'Sent to';
  }
  
  // Format date
  const date = new Date(transfer.timestamp);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Get theme styles
  const themeStyles = createStyles(theme);

  // Determine icon and color
  const getIconName = () => {
    if (isExternal) return 'account-balance';
    return isIncoming ? 'arrow-downward' : 'arrow-upward';
  };

  const getAmountColor = () => {
    if (isExternal || isIncoming) return theme.colors.financial.positive;
    return theme.colors.financial.negative;
  };

  return (
    <View style={[themeStyles.card, styles.container]}>
      <View style={styles.iconContainer}>
        <MaterialIcons
          name={getIconName()}
          size={20}
          color={getAmountColor()}
        />
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.mainContent}>
          <Text style={[themeStyles.text.primary, styles.title]}>
            {actionText}
          </Text>
          <Text style={[themeStyles.text.secondary, styles.email]}>{otherUserEmail}</Text>
          <Text style={[themeStyles.text.tertiary, styles.date]}>{formattedDate}</Text>
        </View>
        
        <Text style={[
          styles.amount,
          { color: getAmountColor() }
        ]}>
          {amount}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.xs,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background.secondary, // Light gray background
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  email: {
    fontSize: 14,
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TransferItem; 