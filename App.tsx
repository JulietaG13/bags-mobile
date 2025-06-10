import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import WelcomeScreen from './src/screens/WelcomeScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import MakeTransferScreen from './src/screens/MakeTransferScreen';
import DebInScreen from './src/screens/DebInScreen';
import BottomNavigation, { TabType } from './src/components/BottomNavigation';

type ScreenType = 'welcome' | 'register' | 'login' | 'main';

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('welcome');
  const [userToken, setUserToken] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Welcome Screen Handlers
  const handleGetStarted = () => {
    console.log('Get Started pressed');
    setCurrentScreen('register');
  };

  const handleSignIn = () => {
    console.log('Sign In pressed');
    setCurrentScreen('login');
  };

  // Register Screen Handlers
  const handleRegisterSuccess = () => {
    console.log('Registration successful');
    // Navigate to dashboard (for now, go back to welcome)
    setCurrentScreen('welcome');
  };

  const handleBackToWelcomeFromRegister = () => {
    console.log('Back to welcome from register');
    setCurrentScreen('welcome');
  };

  const handleGoToLoginFromRegister = () => {
    console.log('Go to login from register');
    setCurrentScreen('login');
  };

  // Login Screen Handlers
  const handleLoginSuccess = (token?: string) => {
    console.log('Login successful');
    if (token) {
      setUserToken(token);
      setCurrentScreen('main');
    }
  };

  const handleBackToWelcomeFromLogin = () => {
    console.log('Back to welcome from login');
    setCurrentScreen('welcome');
  };

  const handleGoToRegisterFromLogin = () => {
    console.log('Go to register from login');
    setCurrentScreen('register');
  };

  // Home Screen Handlers
  const handleLogout = () => {
    console.log('Logging out');
    setUserToken(undefined);
    setCurrentScreen('welcome');
  };

  const handleUnauthorized = () => {
    console.log('Unauthorized access - redirecting to login');
    setUserToken(undefined);
    setCurrentScreen('login');
  };

  const handleNavigateToTransfers = () => {
    console.log('Navigate to all transfers');
    // TODO: Implement all transfers screen
  };

  switch (currentScreen) {
    case 'register':
      return (
        <>
          <StatusBar style="auto" />
          <RegisterScreen
            onRegisterSuccess={handleRegisterSuccess}
            onBackToWelcome={handleBackToWelcomeFromRegister}
            onGoToLogin={handleGoToLoginFromRegister}
          />
        </>
      );

    case 'login':
      return (
        <>
          <StatusBar style="auto" />
          <LoginScreen
            onLoginSuccess={handleLoginSuccess}
            onBackToWelcome={handleBackToWelcomeFromLogin}
            onGoToRegister={handleGoToRegisterFromLogin}
          />
        </>
      );

    case 'main':
      const renderMainScreen = () => {
        switch (activeTab) {
          case 'transfer':
            return (
              <MakeTransferScreen
                token={userToken}
                onTransferSuccess={() => setActiveTab('home')}
                onUnauthorized={handleUnauthorized}
              />
            );
          case 'debin':
            return (
              <DebInScreen
                token={userToken}
                onRequestSuccess={() => setActiveTab('home')}
              />
            );
          case 'home':
          default:
            return (
              <HomeScreen
                token={userToken}
                onNavigateToTransfers={handleNavigateToTransfers}
                onUnauthorized={handleUnauthorized}
              />
            );
        }
      };

      return (
        <>
          <StatusBar style="auto" />
          <View style={localStyles.mainContainer}>
            <View style={localStyles.contentContainer}>
              {renderMainScreen()}
            </View>
            <BottomNavigation
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </View>
        </>
      );

    case 'welcome':
    default:
      return (
        <>
          <StatusBar style="auto" />
          <WelcomeScreen
            onGetStarted={handleGetStarted}
            onSignIn={handleSignIn}
          />
        </>
      );
  }
}

const localStyles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 90, // Space for bottom navigation
  },
});

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
} 