import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import WelcomeScreen from './src/screens/WelcomeScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';

type ScreenType = 'welcome' | 'register' | 'login' | 'dashboard';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('welcome');

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
    setCurrentScreen('dashboard');
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
  const handleLoginSuccess = () => {
    console.log('Login successful');
    setCurrentScreen('dashboard');
  };

  const handleBackToWelcomeFromLogin = () => {
    console.log('Back to welcome from login');
    setCurrentScreen('welcome');
  };

  const handleGoToRegisterFromLogin = () => {
    console.log('Go to register from login');
    setCurrentScreen('register');
  };

  // Screen Rendering
  switch (currentScreen) {
    case 'dashboard':
      return (
        <>
          <StatusBar style="auto" />
          <DashboardScreen />
        </>
      );

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