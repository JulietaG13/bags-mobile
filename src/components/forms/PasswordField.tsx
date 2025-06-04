import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../../constants';

interface PasswordFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  showStrengthIndicator?: boolean;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  label,
  value,
  onChangeText,
  error,
  placeholder = "Enter password",
  required = false,
  showStrengthIndicator = false,
}) => {
  const [isSecure, setIsSecure] = useState(true);
  const hasError = !!error;

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: '' };
    if (password.length < 6) return { strength: 1, label: 'Weak' };
    if (password.length < 8) return { strength: 2, label: 'Fair' };
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const score = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
    
    if (score >= 3 && password.length >= 8) return { strength: 4, label: 'Strong' };
    if (score >= 2) return { strength: 3, label: 'Good' };
    return { strength: 2, label: 'Fair' };
  };

  const passwordStrength = showStrengthIndicator ? getPasswordStrength(value) : null;

  const getStrengthColor = (strength: number) => {
    switch (strength) {
      case 1: return theme.colors.semantic.error;
      case 2: return theme.colors.semantic.warning;
      case 3: return theme.colors.primary.main;
      case 4: return theme.colors.semantic.success;
      default: return theme.colors.border.light;
    }
  };

  return (
    <View style={localStyles.container}>
      <Text style={localStyles.label}>
        {label}
        {required && <Text style={localStyles.required}> *</Text>}
      </Text>
      
      <View style={localStyles.inputContainer}>
        <TextInput
          style={[
            localStyles.input,
            hasError && localStyles.inputError,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.text.tertiary}
          secureTextEntry={isSecure}
          autoCapitalize="none"
          autoCorrect={false}
        />
        
        <TouchableOpacity
          style={localStyles.eyeButton}
          onPress={() => setIsSecure(!isSecure)}
          activeOpacity={0.7}
        >
          <Text style={localStyles.eyeButtonText}>
            {isSecure ? '👁️' : '🙈'}
          </Text>
        </TouchableOpacity>
      </View>

      {showStrengthIndicator && value.length > 0 && passwordStrength && (
        <View style={localStyles.strengthContainer}>
          <View style={localStyles.strengthBars}>
            {[1, 2, 3, 4].map((level) => (
              <View
                key={level}
                style={[
                  localStyles.strengthBar,
                  {
                    backgroundColor: level <= passwordStrength.strength
                      ? getStrengthColor(passwordStrength.strength)
                      : theme.colors.border.light,
                  },
                ]}
              />
            ))}
          </View>
          <Text style={[
            localStyles.strengthText,
            { color: getStrengthColor(passwordStrength.strength) }
          ]}>
            {passwordStrength.label}
          </Text>
        </View>
      )}
      
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
  inputContainer: {
    position: 'relative',
  },
  input: {
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.layout.component.radiusMedium,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingRight: 50,
    fontSize: theme.typography.textStyles.bodyMedium.fontSize,
    color: theme.colors.text.primary,
    minHeight: 48,
  },
  inputError: {
    borderColor: theme.colors.semantic.error,
    backgroundColor: theme.colors.semantic.errorLight,
  },
  eyeButton: {
    position: 'absolute',
    right: theme.spacing.md,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
  },
  eyeButtonText: {
    fontSize: 18,
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
    gap: theme.spacing.sm,
  },
  strengthBars: {
    flexDirection: 'row',
    gap: 2,
    flex: 1,
  },
  strengthBar: {
    height: 4,
    flex: 1,
    borderRadius: 2,
  },
  strengthText: {
    fontSize: theme.typography.textStyles.caption.fontSize,
    fontWeight: theme.typography.fontWeight.medium,
  },
  errorText: {
    fontSize: theme.typography.textStyles.caption.fontSize,
    color: theme.colors.semantic.error,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
});

export default PasswordField; 