import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../../constants';

interface FormButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'text';
  loading?: boolean;
  disabled?: boolean;
  style?: any;
  testID?: string;
  accessibilityLabel?: string;
}

export const FormButton: React.FC<FormButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  testID,
  accessibilityLabel,
}) => {
  const isDisabled = disabled || loading;

  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return [
          localStyles.baseButton,
          localStyles.primaryButton,
          isDisabled && localStyles.disabledButton,
        ];
      case 'secondary':
        return [
          localStyles.baseButton,
          localStyles.secondaryButton,
          isDisabled && localStyles.disabledSecondaryButton,
        ];
      case 'text':
        return [
          localStyles.textButton,
          isDisabled && localStyles.disabledTextButton,
        ];
      default:
        return localStyles.baseButton;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return [
          localStyles.buttonText,
          localStyles.primaryButtonText,
          isDisabled && localStyles.disabledButtonText,
        ];
      case 'secondary':
        return [
          localStyles.buttonText,
          localStyles.secondaryButtonText,
          isDisabled && localStyles.disabledSecondaryButtonText,
        ];
      case 'text':
        return [
          localStyles.textButtonText,
          isDisabled && localStyles.disabledTextButtonText,
        ];
      default:
        return localStyles.buttonText;
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'primary' ? 'white' : theme.colors.primary.main} 
          size="small"
        />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const localStyles = StyleSheet.create({
  baseButton: {
    borderRadius: theme.layout.component.radiusLarge,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary.main,
    shadowColor: theme.colors.primary.main,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary.main,
  },
  textButton: {
    backgroundColor: 'transparent',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    minHeight: 'auto',
  },
  disabledButton: {
    backgroundColor: theme.colors.neutral[300],
    shadowOpacity: 0,
    elevation: 0,
  },
  disabledSecondaryButton: {
    borderColor: theme.colors.neutral[300],
  },
  disabledTextButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: theme.typography.textStyles.labelLarge.fontSize,
    fontWeight: theme.typography.fontWeight.bold,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  primaryButtonText: {
    color: 'white',
  },
  secondaryButtonText: {
    color: theme.colors.primary.main,
  },
  textButtonText: {
    fontSize: theme.typography.textStyles.bodyMedium.fontSize,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
    textDecorationLine: 'underline',
  },
  disabledButtonText: {
    color: theme.colors.text.disabled,
  },
  disabledSecondaryButtonText: {
    color: theme.colors.neutral[300],
  },
  disabledTextButtonText: {
    color: theme.colors.text.disabled,
    textDecorationLine: 'none',
  },
});

export default FormButton; 