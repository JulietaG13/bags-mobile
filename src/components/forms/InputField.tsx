import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { theme } from '../../constants';

interface InputFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  error?: string;
  required?: boolean;
  style?: any;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  required = false,
  style,
  ...textInputProps
}) => {
  const hasError = !!error;

  return (
    <View style={[localStyles.container, style]}>
      <Text style={localStyles.label}>
        {label}
        {required && <Text style={localStyles.required}> *</Text>}
      </Text>
      
      <TextInput
        style={[
          localStyles.input,
          hasError && localStyles.inputError,
        ]}
        placeholderTextColor={theme.colors.text.tertiary}
        {...textInputProps}
      />
      
      {hasError && (
        <Text style={localStyles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.sm,
  },
  label: {
    fontSize: theme.typography.textStyles.labelMedium.fontSize,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  required: {
    color: theme.colors.semantic.error,
  },
  input: {
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.layout.component.radiusMedium,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    fontSize: theme.typography.textStyles.bodyMedium.fontSize,
    color: theme.colors.text.primary,
    minHeight: 48,
  },
  inputError: {
    borderColor: theme.colors.semantic.error,
    backgroundColor: theme.colors.semantic.errorLight,
  },
  errorText: {
    fontSize: theme.typography.textStyles.caption.fontSize,
    color: theme.colors.semantic.error,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
});

export default InputField; 