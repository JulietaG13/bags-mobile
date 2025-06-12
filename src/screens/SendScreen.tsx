import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, ToastAndroid } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme, createStyles } from '../constants';
import { useWallet } from '../hooks/useWallet';
import { useAuth } from '../hooks/useAuth';
import { transfer } from '../services/walletService';
import { InputField, FormButton } from '../components/forms';

const SendScreen: React.FC = () => {
  const styles = createStyles(theme);
  const { token } = useAuth();
  const { walletInfo, isLoading: walletLoading, refetch } = useWallet(token);
  
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string; amount?: string; general?: string}>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateAmount = (amount: string, balance: number): {valid: boolean; error?: string} => {
    const numAmount = parseFloat(amount);
    
    if (!amount.trim()) {
      return { valid: false, error: 'Amount is required' };
    }
    
    if (isNaN(numAmount) || numAmount <= 0) {
      return { valid: false, error: 'Please enter a valid amount' };
    }
    
    if (numAmount > balance) {
      return { valid: false, error: `Insufficient funds. Available: ${balance.toFixed(2)}` };
    }

    // Check for reasonable decimal places (2 max for currency)
    if (amount.includes('.') && amount.split('.')[1].length > 2) {
      return { valid: false, error: 'Amount cannot have more than 2 decimal places' };
    }
    
    return { valid: true };
  };

  const handleSend = async () => {
    setErrors({});
    
    // Validate inputs
    const newErrors: {email?: string; amount?: string; general?: string} = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!validateEmail(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!walletInfo) {
      newErrors.general = 'Unable to load wallet information. Please try again.';
      setErrors(newErrors);
      return;
    }
    
    const amountValidation = validateAmount(amount, walletInfo.balance.amount);
    if (!amountValidation.valid) {
      newErrors.amount = amountValidation.error;
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      await transfer({
        toEmail: email.trim().toLowerCase(),
        amount: parseFloat(amount)
      });
      
      // Show success toast
      const successMessage = `Successfully sent ${formatInputAmount(amount, walletInfo.currency)} to ${email.trim()}`;
      
      if (Platform.OS === 'android') {
        ToastAndroid.show(successMessage, ToastAndroid.LONG);
      } else {
        // For iOS, we can use a simple alert or implement a custom toast
        Alert.alert('Success', successMessage);
      }
      
      // Clear form and refresh wallet
      setEmail('');
      setAmount('');
      refetch();
      
    } catch (error) {
      console.error('[SEND SCREEN] Transfer failed:', error);
      
      let errorMessage = 'Failed to send money. Please try again.';
      
      if (error instanceof Error) {
        // Handle specific error cases
        if (error.message.toLowerCase().includes('not found') || 
            error.message.toLowerCase().includes('does not exist')) {
          errorMessage = 'Recipient email not found. Please check the email address and try again.';
          setErrors({ email: 'This email address is not registered with our service' });
        } else if (error.message.toLowerCase().includes('insufficient')) {
          errorMessage = 'Insufficient funds for this transfer.';
          setErrors({ amount: 'Insufficient funds' });
        } else if (error.message.toLowerCase().includes('network') || 
                   error.message.toLowerCase().includes('connection')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      // Show error as general error if no specific field error was set
      if (!errors.email && !errors.amount) {
        setErrors({ general: errorMessage });
      }
      
      Alert.alert('Transfer Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formatInputAmount = (inputAmount: string, currency?: string): string => {
    const defaultCurrency = currency || 'USD';
    const numAmount = parseFloat(inputAmount) || 0;
    return `${defaultCurrency} $${numAmount.toFixed(2)}`;
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, localStyles.container]} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      testID="send-screen-container"
      accessibilityLabel="send-screen-container"
    >
      <ScrollView 
        style={localStyles.scrollView}
        contentContainerStyle={localStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
        testID="send-screen-scroll-view"
        accessibilityLabel="send-screen-scroll-view"
      >
        {/* Header */}
        <View 
          style={localStyles.header}
          testID="send-screen-header"
          accessibilityLabel="send-screen-header"
        >
          <MaterialIcons 
            name="send" 
            size={48} 
            color={theme.colors.primary.main}
            style={localStyles.sendIcon}
            testID="send-screen-icon"
            accessibilityLabel="send-screen-icon"
          />

          {/* Amount Display - Shows the amount being entered */}
          <View 
            style={localStyles.balanceContainer}
            testID="send-screen-amount-display"
            accessibilityLabel="send-screen-amount-display"
          >
            <Text 
              style={[styles.text.heading, localStyles.balanceAmount]}
              testID="send-screen-amount-text"
              accessibilityLabel="send-screen-amount-text"
            >
              {formatInputAmount(amount, walletInfo?.currency)}
            </Text>
          </View>
          
          {walletLoading && (
            <Text 
              style={[styles.text.secondary, localStyles.loadingText]}
              testID="send-screen-loading-text"
              accessibilityLabel="send-screen-loading-text"
            >
              Loading...
            </Text>
          )}
        </View>

        {/* Error Display */}
        {errors.general && (
          <View 
            style={localStyles.errorContainer}
            testID="send-screen-error-container"
            accessibilityLabel="send-screen-error-container"
          >
            <MaterialIcons 
              name="error-outline" 
              size={20} 
              color={theme.colors.semantic.error}
              testID="send-screen-error-icon"
              accessibilityLabel="send-screen-error-icon"
            />
            <Text 
              style={localStyles.errorText}
              testID="send-screen-error-text"
              accessibilityLabel="send-screen-error-text"
            >
              {errors.general}
            </Text>
          </View>
        )}

        {/* Form */}
        <View 
          style={localStyles.form}
          testID="send-screen-form"
          accessibilityLabel="send-screen-form"
        >
          <InputField
            label="Recipient Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter recipient's email address"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.email}
            required
            testID="send-screen-email-input"
            accessibilityLabel="send-screen-email-input"
          />
          
          <InputField
            label="Amount"
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            keyboardType="decimal-pad"
            error={errors.amount}
            required
            testID="send-screen-amount-input"
            accessibilityLabel="send-screen-amount-input"
          />
          
          <FormButton
            title="Send Money"
            onPress={handleSend}
            loading={isLoading}
            disabled={!walletInfo || walletLoading || !email.trim() || !amount.trim()}
            style={localStyles.sendButton}
            testID="send-screen-submit-button"
            accessibilityLabel="send-screen-submit-button"
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.screen.horizontal,
    paddingVertical: theme.spacing.xl,
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing['4xl'],
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  balanceContainer: {
    backgroundColor: theme.colors.background.secondary,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.layout.component.radiusLarge,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.primary.main,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontStyle: 'italic',
  },
  errorContainer: {
    backgroundColor: theme.colors.semantic.errorLight,
    padding: theme.spacing.md,
    borderRadius: theme.layout.component.radiusMedium,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.semantic.error,
    width: '100%',
  },
  errorText: {
    color: theme.colors.semantic.error,
    fontSize: 14,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  form: {
    width: '100%',
  },
  sendButton: {
    marginTop: theme.spacing.lg,
  },
  sendIcon: {
    marginBottom: theme.spacing.xl,
  },
});

export default SendScreen; 