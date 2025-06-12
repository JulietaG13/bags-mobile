import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme, createStyles } from '../constants';

const SendScreen: React.FC = () => {
  const styles = createStyles(theme);

  return (
    <View style={[styles.container, localStyles.container]}>
      <View style={localStyles.content}>
        <MaterialIcons 
          name="send" 
          size={64} 
          color={theme.colors.text.tertiary}
        />
        <Text style={[styles.text.heading, localStyles.title]}>Send Money</Text>
        <Text style={[styles.text.secondary, localStyles.subtitle]}>This feature is coming soon!</Text>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.primary,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.screen.horizontal,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 22,
  },
});

export default SendScreen; 