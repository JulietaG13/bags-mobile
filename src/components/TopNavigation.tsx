import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { theme, createStyles } from '../constants';

interface TopNavigationProps {
  onLogin?: () => void;
  onRegister?: () => void;
  showAuth?: boolean;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  onLogin,
  onRegister,
  showAuth = true,
}) => {
  const _styles = createStyles(theme);

  return (
    <SafeAreaView style={localStyles.safeArea}>
      <View style={localStyles.container}>
        <View style={localStyles.brandContainer}>
          <View style={localStyles.logoIcon}>
            <Text style={localStyles.logoText}>💳</Text>
          </View>
          <Text style={localStyles.brandText}>Digital Wallet</Text>
        </View>

        {showAuth && (
          <View style={localStyles.authContainer}>
            <TouchableOpacity 
              style={localStyles.loginButton}
              onPress={onLogin}
              activeOpacity={0.7}
            >
              <Text style={localStyles.loginText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={localStyles.registerButton}
              onPress={onRegister}
              activeOpacity={0.8}
            >
              <Text style={localStyles.registerText}>Register</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  safeArea: {
    backgroundColor: theme.colors.background.primary,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.screen.horizontal,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: theme.layout.component.radiusSmall,
    backgroundColor: theme.colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  logoText: {
    fontSize: 16,
  },
  brandText: {
    fontSize: theme.typography.textStyles.h4.fontSize,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  authContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  loginButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  loginText: {
    fontSize: theme.typography.textStyles.labelMedium.fontSize,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  registerButton: {
    backgroundColor: theme.colors.primary.main,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.layout.component.radiusSmall,
  },
  registerText: {
    fontSize: theme.typography.textStyles.labelMedium.fontSize,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.inverse,
  },
});

export default TopNavigation; 