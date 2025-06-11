import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const SendScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <MaterialIcons name="send" size={64} color="#8E8E93" />
        <Text style={styles.title}>Send Money</Text>
        <Text style={styles.subtitle}>This feature is coming soon!</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
});

export default SendScreen; 