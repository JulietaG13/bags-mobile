import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  Alert,
  SafeAreaView,
  Text,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { theme } from '../constants';
import { InputField, FormButton } from '../components/forms';
import { useTransfer } from '../hooks';

interface MakeTransferScreenProps {
  token?: string;
  onTransferSuccess?: () => void;
  onUnauthorized?: () => void;
}

export const MakeTransferScreen: React.FC<MakeTransferScreenProps> = ({
  token,
  onTransferSuccess,
  onUnauthorized,
}) => {
  const [formData, setFormData] = useState({
    toEmail: '',
    amount: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { sendTransfer, loading, error, clearError } = useTransfer(token, onUnauthorized);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.toEmail.trim()) {
      newErrors.toEmail = 'Recipient email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.toEmail)) {
      newErrors.toEmail = 'Please enter a valid email';
    }

    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = 'Please enter a valid amount';
      } else if (amount < 0.01) {
        newErrors.amount = 'Minimum amount is $0.01';
      } else if (amount > 10000) {
        newErrors.amount = 'Maximum amount is $10,000';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTransfer = async () => {
    if (!validateForm()) return;

    // Clear any previous errors
    clearError();
    setErrors({});
    
    const transferData = {
      toEmail: formData.toEmail.trim(),
      amount: parseFloat(formData.amount),
    };

    const success = await sendTransfer(transferData);
    
    if (success) {
      Alert.alert(
        'Transfer Successful!',
        `$${formData.amount} has been sent to ${formData.toEmail}`,
        [
          {
            text: 'OK',
            onPress: () => {
              setFormData({ toEmail: '', amount: '' });
              if (onTransferSuccess) {
                onTransferSuccess();
              }
            }
          }
        ]
      );
    } else if (error) {
      // Handle specific error types
      if (error.type === 'not_found') {
        setErrors({ toEmail: error.message });
      } else {
        Alert.alert('Transfer Failed', error.message);
      }
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatAmount = (value: string) => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) {
      return parts[0] + '.' + parts[1].substring(0, 2);
    }
    
    return numericValue;
  };

  return (
    <SafeAreaView style={localStyles.safeArea}>
      <KeyboardAvoidingView 
        style={localStyles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView 
          style={localStyles.scrollView}
          contentContainerStyle={localStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={localStyles.header}>
            <Text style={localStyles.title}>Send Money</Text>
          </View>

          <View style={localStyles.form}>
            <InputField
              label="Recipient Email"
              value={formData.toEmail}
              onChangeText={(value) => updateField('toEmail', value)}
              error={errors.toEmail}
              placeholder="Enter recipient's email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            <InputField
              label="Amount"
              value={formData.amount}
              onChangeText={(value) => updateField('amount', formatAmount(value))}
              error={errors.amount}
              placeholder="0.00"
              keyboardType="decimal-pad"
              style={localStyles.amountInput}
            />

            {formData.amount && !errors.amount && (
              <View style={localStyles.previewContainer}>
                <Text style={localStyles.previewLabel}>Transfer Amount:</Text>
                <Text style={localStyles.previewAmount}>
                  ${parseFloat(formData.amount || '0').toFixed(2)}
                </Text>
              </View>
            )}

            <FormButton
              title={loading ? "Processing..." : "Send Money"}
              onPress={handleTransfer}
              loading={loading}
              disabled={!formData.toEmail || !formData.amount || loading}
              variant="primary"
              style={localStyles.sendButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing['4xl'],
  },
  header: {
    paddingHorizontal: theme.spacing.screen.horizontal,
    marginBottom: theme.spacing['sm'],
    alignItems: 'flex-start',
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    ...theme.typography.textStyles.h1,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    textAlign: 'left',
  },
  subtitle: {
    ...theme.typography.textStyles.bodyLarge,
    color: theme.colors.text.secondary,
    lineHeight: 24,
    textAlign: 'center',
  },
  form: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.layout.component.radiusLarge,
    marginHorizontal: theme.spacing.screen.horizontal,
    padding: theme.spacing['2xl'],
    shadowColor: theme.colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  amountInput: {
    marginBottom: theme.spacing.lg,
  },
  previewContainer: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.layout.component.radiusMedium,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  previewLabel: {
    ...theme.typography.textStyles.labelMedium,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  previewAmount: {
    ...theme.typography.textStyles.balance,
    color: theme.colors.primary.main,
    fontSize: 24,
    lineHeight: 30,
  },
  sendButton: {
    marginBottom: theme.spacing.xl,
  },
  infoContainer: {
    backgroundColor: theme.colors.primary[50],
    borderRadius: theme.layout.component.radiusMedium,
    padding: theme.spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary.main,
  },
  infoText: {
    ...theme.typography.textStyles.bodySmall,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
});

export default MakeTransferScreen; 