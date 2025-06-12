import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme, createStyles } from '../constants';
import { useDebIn } from '../hooks/useDebIn';
import { useWallet } from '../hooks/useWallet';
import { useAuth } from '../hooks/useAuth';
import { InputField, FormButton } from '../components/forms';
import { DebInRequest } from '../types';

const DebinScreen: React.FC = () => {
  const styles = createStyles(theme);
  const { token } = useAuth();
  const { walletInfo, isLoading: walletLoading } = useWallet(token);
  const { isLoading, submitDebIn } = useDebIn();

  const [formInputs, setFormInputs] = useState({
    externalServiceName: 'Bank',
    serviceType: 'BANK',
    externalEmail: '',
    amount: '',
  });

  const [errors, setErrors] = useState<{
    externalServiceName?: string;
    serviceType?: string;
    externalEmail?: string;
    amount?: string;
    general?: string;
  }>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateAmount = (amount: string): { valid: boolean; error?: string } => {
    const numAmount = parseFloat(amount);
    
    if (!amount.trim()) {
      return { valid: false, error: 'Amount is required' };
    }
    
    if (isNaN(numAmount) || numAmount <= 0) {
      return { valid: false, error: 'Please enter a valid amount' };
    }

    // Check for reasonable decimal places (2 max for currency)
    if (amount.includes('.') && amount.split('.')[1].length > 2) {
      return { valid: false, error: 'Amount cannot have more than 2 decimal places' };
    }
    
    return { valid: true };
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    // External service name and service type are automatically set, so no validation needed

    // Validate external email
    if (!formInputs.externalEmail.trim()) {
      newErrors.externalEmail = 'External email is required';
    } else if (!validateEmail(formInputs.externalEmail)) {
      newErrors.externalEmail = 'Please enter a valid email address';
    }

    // Validate amount
    const amountValidation = validateAmount(formInputs.amount);
    if (!amountValidation.valid) {
      newErrors.amount = amountValidation.error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const numericAmount = parseFloat(formInputs.amount);
    if (!formInputs.externalEmail || isNaN(numericAmount) || numericAmount <= 0) {
      setErrors({ general: 'All fields are required and amount must be positive.' });
      return;
    }

    const debInData: DebInRequest = {
      externalServiceName: formInputs.externalServiceName,
      serviceType: formInputs.serviceType,
      externalEmail: formInputs.externalEmail.trim().toLowerCase(),
      amount: numericAmount,
    };

    try {
      const success = await submitDebIn(debInData);
      
      if (success) {
        // Clear form on success
        setFormInputs({
          externalServiceName: 'Bank',
          serviceType: 'BANK',
          externalEmail: '',
          amount: '',
        });
        setErrors({});
      }
    } catch (error) {
      console.error('[DEBIN SCREEN] Submit failed:', error);
    }
  };

  const formatInputAmount = (inputAmount: string): string => {
    const currency = walletInfo?.currency || 'USD';
    const numAmount = parseFloat(inputAmount) || 0;
    return `${currency} $${numAmount.toFixed(2)}`;
  };

  const updateField = (field: keyof typeof formInputs, value: string) => {
    setFormInputs(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, localStyles.container]} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      testID="debin-screen-container"
      accessibilityLabel="debin-screen-container"
    >
      <ScrollView 
        style={localStyles.scrollView}
        contentContainerStyle={localStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
        testID="debin-screen-scroll-view"
        accessibilityLabel="debin-screen-scroll-view"
      >
        {/* Header */}
        <View 
          style={localStyles.header}
          testID="debin-screen-header"
          accessibilityLabel="debin-screen-header"
        >
          <MaterialIcons 
            name="account-balance-wallet" 
            size={48} 
            color={theme.colors.primary.main}
            style={localStyles.icon}
            testID="debin-screen-icon"
            accessibilityLabel="debin-screen-icon"
          />

          {/* Amount Display - Shows the amount being requested */}
          <View 
            style={localStyles.balanceContainer}
            testID="debin-screen-amount-display"
            accessibilityLabel="debin-screen-amount-display"
          >
            <Text 
              style={[styles.text.heading, localStyles.balanceAmount]}
              testID="debin-screen-amount-text"
              accessibilityLabel="debin-screen-amount-text"
            >
              {formatInputAmount(formInputs.amount)}
            </Text>
            <Text 
              style={[styles.text.secondary, localStyles.balanceLabel]}
              testID="debin-screen-amount-label"
              accessibilityLabel="debin-screen-amount-label"
            >
              Request Amount
            </Text>
          </View>
        </View>

        {/* Form */}
        <View 
          style={localStyles.form}
          testID="debin-screen-form"
          accessibilityLabel="debin-screen-form"
        >
          {/* External Service Name - Read-only since only one option */}
          <View 
            style={localStyles.fieldContainer}
            testID="debin-screen-service-field"
            accessibilityLabel="debin-screen-service-field"
          >
            <Text 
              style={localStyles.fieldLabel}
              testID="debin-screen-service-label"
              accessibilityLabel="debin-screen-service-label"
            >
              External Service
            </Text>
            <View 
              style={localStyles.readOnlyField}
              testID="debin-screen-service-value"
              accessibilityLabel="debin-screen-service-value"
            >
              <Text 
                style={localStyles.readOnlyText}
                testID="debin-screen-service-text"
                accessibilityLabel="debin-screen-service-text"
              >
                Bank
              </Text>
            </View>
          </View>

          {/* Service Type - Read-only since only one option */}
          <View 
            style={localStyles.fieldContainer}
            testID="debin-screen-type-field"
            accessibilityLabel="debin-screen-type-field"
          >
            <Text 
              style={localStyles.fieldLabel}
              testID="debin-screen-type-label"
              accessibilityLabel="debin-screen-type-label"
            >
              Service Type
            </Text>
            <View 
              style={localStyles.readOnlyField}
              testID="debin-screen-type-value"
              accessibilityLabel="debin-screen-type-value"
            >
              <Text 
                style={localStyles.readOnlyText}
                testID="debin-screen-type-text"
                accessibilityLabel="debin-screen-type-text"
              >
                Bank
              </Text>
            </View>
          </View>

          <InputField
            label="External Email"
            value={formInputs.externalEmail}
            onChangeText={(value) => updateField('externalEmail', value)}
            placeholder="Enter external service email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.externalEmail}
            required
            testID="debin-screen-email-input"
            accessibilityLabel="debin-screen-email-input"
          />
          
          <InputField
            label="Amount"
            value={formInputs.amount}
            onChangeText={(value) => updateField('amount', value)}
            placeholder="0.00"
            keyboardType="decimal-pad"
            error={errors.amount}
            required
            testID="debin-screen-amount-input"
            accessibilityLabel="debin-screen-amount-input"
          />
          
          {errors.general && (
            <Text 
              style={localStyles.generalError}
              testID="debin-screen-general-error"
              accessibilityLabel="debin-screen-general-error"
            >
              {errors.general}
            </Text>
          )}
          
          <FormButton
            title="Request Deb-in"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={
              isLoading || 
              walletLoading || 
              !formInputs.externalEmail.trim() || 
              !formInputs.amount.trim()
            }
            style={localStyles.submitButton}
            testID="debin-screen-submit-button"
            accessibilityLabel="debin-screen-submit-button"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const localStyles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: theme.spacing.xl,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.screen.horizontal,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
  },
  icon: {
    marginBottom: theme.spacing.md,
  },
  balanceContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.xs,
  },
  balanceLabel: {
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  form: {
    paddingHorizontal: theme.spacing.screen.horizontal,
    gap: theme.spacing.lg,
  },
  fieldContainer: {
    marginBottom: theme.spacing.sm,
  },
  fieldLabel: {
    fontSize: theme.typography.textStyles.labelMedium.fontSize,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  required: {
    color: theme.colors.semantic.error,
  },
  errorText: {
    fontSize: theme.typography.textStyles.caption.fontSize,
    color: theme.colors.semantic.error,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
  generalError: {
    fontSize: theme.typography.textStyles.bodyMedium.fontSize,
    color: theme.colors.semantic.error,
    textAlign: 'center',
    marginVertical: theme.spacing.sm,
  },
  submitButton: {
    marginTop: theme.spacing.lg,
  },
  readOnlyField: {
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.layout.component.radiusMedium,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  readOnlyText: {
    fontSize: theme.typography.textStyles.bodyMedium.fontSize,
    color: theme.colors.text.primary,
  },
});

export default DebinScreen; 