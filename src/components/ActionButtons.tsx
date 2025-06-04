import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme, createStyles } from '../constants';

interface ActionButtonsProps {
  onGetStarted?: () => void;
  onSignIn?: () => void;
  primaryText?: string;
  secondaryText?: string;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onGetStarted,
  onSignIn,
  primaryText = "Get Started",
  secondaryText = "Already have an account?",
}) => {
  const _styles = createStyles(theme);

  return (
    <View style={localStyles.container}>
      <TouchableOpacity 
        style={[localStyles.primaryButton]} 
        onPress={onGetStarted}
        activeOpacity={0.8}
      >
        <Text style={localStyles.primaryButtonText}>
          {primaryText}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[localStyles.secondaryButton]} 
        onPress={onSignIn}
        activeOpacity={0.8}
      >
        <Text style={localStyles.secondaryButtonText}>
          {secondaryText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.screen.horizontal,
    paddingVertical: theme.spacing.xl,
    gap: theme.spacing.lg,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary.main,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.layout.component.radiusLarge,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    shadowColor: theme.colors.primary.main,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: theme.typography.textStyles.labelLarge.fontSize,
    fontWeight: theme.typography.fontWeight.bold,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.layout.component.radiusLarge,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  secondaryButtonText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.textStyles.bodyMedium.fontSize,
    fontWeight: theme.typography.fontWeight.medium,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default ActionButtons; 