import React from 'react';
import { View, StyleSheet, SafeAreaView, Text } from 'react-native';
import { theme } from '../constants';

interface DebInScreenProps {
  token?: string;
  onRequestSuccess?: () => void;
}

export const DebInScreen: React.FC<DebInScreenProps> = ({
  token,
  onRequestSuccess,
}) => {
  return (
    <SafeAreaView style={localStyles.safeArea}>
      <View style={localStyles.container}>
        <View style={localStyles.content}>
          <Text style={localStyles.title}>Deb-In</Text>
          <Text style={localStyles.subtitle}>Coming Soon</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.screen.horizontal,
  },
  title: {
    ...theme.typography.textStyles.h1,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.textStyles.bodyLarge,
    color: theme.colors.text.secondary,
  },
});

export default DebInScreen; 