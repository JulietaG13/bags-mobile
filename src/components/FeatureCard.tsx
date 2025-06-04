import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme, createStyles } from '../constants';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  variant?: 'default' | 'primary';
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  variant = 'default',
}) => {
  const styles = createStyles(theme);
  const isPrimary = variant === 'primary';

  return (
    <View style={[
      styles.card, 
      localStyles.container,
      isPrimary && localStyles.primaryCard
    ]}>
      <View style={[
        localStyles.iconContainer,
        isPrimary && localStyles.primaryIconContainer
      ]}>
        <Text style={localStyles.icon}>{icon}</Text>
      </View>
      
      <Text style={[
        localStyles.title,
        isPrimary && localStyles.primaryTitle
      ]}>
        {title}
      </Text>
      
      <Text style={[
        localStyles.description,
        isPrimary && localStyles.primaryDescription
      ]}>
        {description}
      </Text>
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
  },
  primaryCard: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.layout.component.radiusMedium,
    backgroundColor: theme.colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  primaryIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  icon: {
    fontSize: 24,
  },
  title: {
    fontSize: theme.typography.textStyles.h4.fontSize,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  primaryTitle: {
    color: theme.colors.text.inverse,
  },
  description: {
    fontSize: theme.typography.textStyles.bodyMedium.fontSize,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.normal,
  },
  primaryDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
});

export default FeatureCard; 