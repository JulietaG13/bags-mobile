import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  StatusBar, 
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  BackHandler,
  ScrollView,
  Keyboard
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../constants';
import { useAuth } from '../hooks';
import { FormContainer, FormHeader, InputField, PasswordField, FormButton } from '../components/forms';

interface RegisterScreenProps {
  onRegisterSuccess?: () => void;
  onBackToWelcome?: () => void;
  onGoToLogin?: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onRegisterSuccess,
  onBackToWelcome,
  onGoToLogin,
}) => {
  const { register, loading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Handle keyboard visibility
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Handle back button
  useEffect(() => {
    const backAction = () => {
      if (onBackToWelcome) {
        onBackToWelcome();
        return true; // Prevent default behavior
      }
      return false; // Allow default behavior if no handler
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [onBackToWelcome]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    clearError();

    try {
      const response = await register({
        email: formData.email,
        password: formData.password,
      });

      if (response.success) {
        Alert.alert(
          'Registration Successful!',
          `Welcome to Bags! Your account has been created successfully.`,
          [{ text: 'OK', onPress: onRegisterSuccess }]
        );
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      Alert.alert('Registration Failed', errorMessage);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (error) {
      clearError();
    }
  };

  return (
    <>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="transparent"
        translucent
      />
      <SafeAreaView style={localStyles.safeArea}>
        <LinearGradient
          colors={[
            theme.colors.primary.main,
            theme.colors.primary.light,
            theme.colors.background.primary
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={localStyles.gradientBackground}
        >
          <KeyboardAvoidingView 
            style={localStyles.keyboardView}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
          >
            <ScrollView 
              style={localStyles.scrollView}
              contentContainerStyle={[
                localStyles.scrollContentContainer,
                keyboardVisible && localStyles.scrollContentContainerKeyboard
              ]}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              bounces={false}
            >
              <View 
                style={localStyles.container}
                testID="register-screen-container"
                accessibilityLabel="register-screen-container"
              >
                {/* Header Section */}
                <View style={localStyles.headerSection}>
                  <FormHeader
                    title="Create Account"
                    subtitle="Join thousands of users managing their finances with Bags"
                    showBackButton={true}
                    onBackPress={onBackToWelcome}
                    testID="register-header"
                    accessibilityLabel="register-header"
                  />
                </View>

                {/* Spacer to push form to bottom */}
                <View style={localStyles.spacer} />

                {/* Form Section - Fixed at bottom */}
                <FormContainer 
                  style={localStyles.bottomFormContainer}
                  testID="register-form-container"
                  accessibilityLabel="register-form-container"
                >
                  <InputField
                    label="Email Address"
                    value={formData.email}
                    onChangeText={(value) => updateField('email', value)}
                    error={errors.email}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    testID="register-email-input"
                    accessibilityLabel="register-email-input"
                  />

                  <PasswordField
                    label="Password"
                    value={formData.password}
                    onChangeText={(value) => updateField('password', value)}
                    error={errors.password}
                    placeholder="Create a strong password"
                    showStrengthIndicator={true}
                    testID="register-password-input"
                    accessibilityLabel="register-password-input"
                  />

                  <PasswordField
                    label="Confirm Password"
                    value={formData.confirmPassword}
                    onChangeText={(value) => updateField('confirmPassword', value)}
                    error={errors.confirmPassword}
                    placeholder="Confirm your password"
                    showStrengthIndicator={false}
                    testID="register-confirm-password-input"
                    accessibilityLabel="register-confirm-password-input"
                  />

                  {/* Show API error if exists */}
                  {error && (
                    <View 
                      style={localStyles.errorContainer}
                      testID="register-error-container"
                      accessibilityLabel="register-error-container"
                    >
                      <Text 
                        style={localStyles.apiErrorText}
                        testID="register-error-text"
                        accessibilityLabel="register-error-text"
                      >
                        {error}
                      </Text>
                    </View>
                  )}

                  <FormButton
                    title="Create Account"
                    onPress={handleRegister}
                    loading={loading}
                    variant="primary"
                    style={localStyles.createButton}
                    testID="register-submit-button"
                    accessibilityLabel="register-submit-button"
                  />

                  <FormButton
                    title="Already have an account? Sign In"
                    onPress={onGoToLogin || (() => {})}
                    variant="text"
                    testID="register-goto-login-button"
                    accessibilityLabel="register-goto-login-button"
                  />
                </FormContainer>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </LinearGradient>
      </SafeAreaView>
    </>
  );
};

const localStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.primary.main,
  },
  gradientBackground: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  scrollContentContainerKeyboard: {
    paddingBottom: 150, // Extra space when keyboard is open
  },
  container: {
    flex: 1,
  },
  headerSection: {
    paddingTop: theme.spacing.xl,
  },
  spacer: {
    flex: 1,
  },
  bottomFormContainer: {
    marginTop: 0,
    borderRadius: theme.layout.component.radiusXLarge,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingBottom: theme.spacing['3xl'] + theme.spacing.xl,
    marginBottom: 0,
  },
  createButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  errorContainer: {
    backgroundColor: theme.colors.semantic.errorLight,
    borderRadius: theme.layout.component.radiusSmall,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  apiErrorText: {
    color: theme.colors.semantic.error,
    fontSize: theme.typography.textStyles.bodyMedium.fontSize,
    textAlign: 'center',
  },
});

export default RegisterScreen; 