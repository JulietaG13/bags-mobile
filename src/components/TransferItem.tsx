import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TransferRecord } from '../types/wallet';

interface TransferItemProps {
  transfer: TransferRecord;
  currentUserEmail?: string;
}

const TransferItem: React.FC<TransferItemProps> = ({ transfer, currentUserEmail }) => {
  const isIncoming = transfer.direction === 'IN';
  const amount = isIncoming ? `+$${transfer.amount.toFixed(2)}` : `-$${transfer.amount.toFixed(2)}`;
  const otherUserEmail = isIncoming ? transfer.fromEmail : transfer.toEmail;
  
  // Format date
  const date = new Date(transfer.timestamp);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialIcons
          name={isIncoming ? 'arrow-downward' : 'arrow-upward'}
          size={20}
          color={isIncoming ? '#34C759' : '#FF3B30'}
        />
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.mainContent}>
          <Text style={styles.title}>
            {isIncoming ? 'Received from' : 'Sent to'}
          </Text>
          <Text style={styles.email}>{otherUserEmail}</Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
        
        <Text style={[
          styles.amount,
          { color: isIncoming ? '#34C759' : '#FF3B30' }
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
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
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
    color: '#000000',
    marginBottom: 2,
  },
  email: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: '#C7C7CC',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TransferItem; 