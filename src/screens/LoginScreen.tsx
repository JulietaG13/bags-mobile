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

interface LoginScreenProps {
  onLoginSuccess?: () => void;
  onBackToWelcome?: () => void;
  onGoToRegister?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onBackToWelcome,
  onGoToRegister,
}) => {
  const { login, loading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    clearError();

    try {
      const response = await login({
        email: formData.email,
        password: formData.password,
      });

      if (response.success) {
        // Redirect automatically without showing modal
        onLoginSuccess?.();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      Alert.alert('Login Failed', errorMessage);
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
              automaticallyAdjustKeyboardInsets={true}
              contentInsetAdjustmentBehavior="automatic"
            >
              <View 
                style={localStyles.container}
                testID="login-screen-container"
                accessibilityLabel="login-screen-container"
              >
                {/* Header Section */}
                <View style={localStyles.headerSection}>
                  <FormHeader
                    title="Welcome Back"
                    subtitle="Sign in to your Bags account to continue managing your finances"
                    showBackButton={true}
                    onBackPress={onBackToWelcome}
                    testID="login-header"
                    accessibilityLabel="login-header"
                  />
                </View>

                {/* Spacer to push form to bottom */}
                <View style={localStyles.spacer} />

                {/* Form Section - Fixed at bottom */}
                <FormContainer 
                  style={localStyles.bottomFormContainer}
                  testID="login-form-container"
                  accessibilityLabel="login-form-container"
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
                    testID="login-email-input"
                    accessibilityLabel="login-email-input"
                  />

                  <PasswordField
                    label="Password"
                    value={formData.password}
                    onChangeText={(value) => updateField('password', value)}
                    error={errors.password}
                    placeholder="Enter your password"
                    showStrengthIndicator={false}
                    testID="login-password-input"
                    accessibilityLabel="login-password-input"
                  />

                  {/* Show API error if exists */}
                  {error && (
                    <View 
                      style={localStyles.errorContainer}
                      testID="login-error-container"
                      accessibilityLabel="login-error-container"
                    >
                      <Text 
                        style={localStyles.apiErrorText}
                        testID="login-error-text"
                        accessibilityLabel="login-error-text"
                      >
                        {error}
                      </Text>
                    </View>
                  )}

                  <FormButton
                    title="Sign In"
                    onPress={handleLogin}
                    loading={loading}
                    variant="primary"
                    style={localStyles.loginButton}
                    testID="login-submit-button"
                    accessibilityLabel="login-submit-button"
                  />

                  <FormButton
                    title="Don't have an account? Sign Up"
                    onPress={onGoToRegister || (() => {})}
                    variant="text"
                    testID="login-goto-register-button"
                    accessibilityLabel="login-goto-register-button"
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
  loginButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
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

export default LoginScreen; 