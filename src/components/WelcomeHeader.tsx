import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme, createStyles } from '../constants';

interface WelcomeHeaderProps {
  title?: string;
  subtitle?: string;
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({
  title = "Your Digital Wallet",
  subtitle = "Send, receive, and manage your money with ease. Secure, fast, and designed for the modern world.",
}) => {
  const _styles = createStyles(theme);
  
  return (
    <View style={localStyles.container}>
      <Text style={localStyles.brandName}>Bags</Text>
      
      <Text style={localStyles.title}>
        {title}
      </Text>
      
      <Text style={localStyles.subtitle}>
        {subtitle}
      </Text>
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: theme.spacing['2xl'],
    paddingHorizontal: theme.spacing.screen.horizontal,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing['4xl'],
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: theme.layout.component.radiusXLarge,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  logoText: {
    fontSize: 36,
  },
  brandName: {
    fontSize: 84,
    fontWeight: theme.typography.fontWeight.bold,
    color: 'white',
    letterSpacing: -2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
    marginBottom: theme.spacing['4xl'],
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    fontSize: 38,
    fontWeight: theme.typography.fontWeight.bold,
    color: 'white',
    lineHeight: 44,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: theme.typography.textStyles.bodyLarge.fontSize,
    lineHeight: theme.typography.lineHeight.relaxed * 18,
    color: 'rgba(255, 255, 255, 0.9)',
    maxWidth: 320,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default WelcomeHeader; 