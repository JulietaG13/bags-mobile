import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../../constants';

interface FormHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export const FormHeader: React.FC<FormHeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
}) => {
  return (
    <View style={localStyles.container}>
      {showBackButton && (
        <TouchableOpacity 
          style={localStyles.backButton}
          onPress={onBackPress}
          activeOpacity={0.7}
        >
          <Text style={localStyles.backButtonText}>←</Text>
        </TouchableOpacity>
      )}
      
      <Text style={localStyles.title}>{title}</Text>
      
      {subtitle && (
        <Text style={localStyles.subtitle}>{subtitle}</Text>
      )}
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: theme.spacing['2xl'],
    paddingHorizontal: theme.spacing.screen.horizontal,
    paddingTop: theme.spacing['4xl'],
  },
  backButton: {
    position: 'absolute',
    top: theme.spacing['4xl'],
    left: theme.spacing.screen.horizontal,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 24,
    color: 'white',
    fontWeight: theme.typography.fontWeight.bold,
  },
  title: {
    fontSize: theme.typography.textStyles.h1.fontSize,
    fontWeight: theme.typography.fontWeight.bold,
    color: 'white',
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: theme.typography.textStyles.bodyMedium.fontSize,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.relaxed * 16,
    maxWidth: 300,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default FormHeader; 