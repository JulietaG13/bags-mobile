// Main Theme Configuration for Bags Mobile - Digital Wallet App
// Combines all design tokens into a cohesive theme system

import { Colors, LightTheme, DarkTheme } from './colors';
import { Typography } from './typography';
import { Spacing, Layout, Animation } from './spacing';

// Main theme interface with flexible color types
export interface Theme {
  colors: {
    primary: typeof Colors.primary;
    secondary: typeof Colors.secondary;
    semantic: typeof Colors.semantic;
    neutral: typeof Colors.neutral;
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
      inverse: string;
      disabled: string;
      link: string;
    };
    background: {
      primary: string;
      secondary: string;
      tertiary: string;
      overlay: string;
    };
    financial: typeof Colors.financial;
    status: typeof Colors.status;
    border: typeof Colors.border;
    shadow: typeof Colors.shadow;
    gradients: typeof Colors.gradients;
  };
  typography: typeof Typography;
  spacing: typeof Spacing;
  layout: typeof Layout;
  animation: typeof Animation;
  isDark: boolean;
}

// Light theme configuration
export const lightTheme: Theme = {
  colors: LightTheme,
  typography: Typography,
  spacing: Spacing,
  layout: Layout,
  animation: Animation,
  isDark: false,
};

// Dark theme configuration
export const darkTheme: Theme = {
  colors: DarkTheme,
  typography: Typography,
  spacing: Spacing,
  layout: Layout,
  animation: Animation,
  isDark: true,
};

// Default theme (light)
export const defaultTheme = lightTheme;

// Theme helper functions
export const getTheme = (isDark: boolean = false): Theme => {
  return isDark ? darkTheme : lightTheme;
};

// Common component styles using theme
export const createStyles = (theme: Theme) => ({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: theme.spacing.screen.horizontal,
  },

  // Card styles
  card: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.layout.component.radiusMedium,
    padding: theme.spacing.component.cardMedium,
    shadowColor: theme.colors.shadow.medium,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // Button styles
  button: {
    primary: {
      backgroundColor: theme.colors.primary.main,
      paddingVertical: theme.spacing.component.buttonMedium.vertical,
      paddingHorizontal: theme.spacing.component.buttonMedium.horizontal,
      borderRadius: theme.layout.component.radiusMedium,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      minHeight: theme.layout.component.buttonMedium,
    },
    secondary: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.border.medium,
      paddingVertical: theme.spacing.component.buttonMedium.vertical,
      paddingHorizontal: theme.spacing.component.buttonMedium.horizontal,
      borderRadius: theme.layout.component.radiusMedium,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      minHeight: theme.layout.component.buttonMedium,
    },
  },

  // Text styles
  text: {
    primary: {
      color: theme.colors.text.primary,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.normal,
    },
    secondary: {
      color: theme.colors.text.secondary,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.normal,
    },
    heading: {
      color: theme.colors.text.primary,
      fontSize: theme.typography.fontSize['2xl'],
      fontWeight: theme.typography.fontWeight.semibold,
    },
  },

  // Input styles
  input: {
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.layout.component.radiusMedium,
    paddingVertical: theme.spacing.component.inputMedium.vertical,
    paddingHorizontal: theme.spacing.component.inputMedium.horizontal,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    minHeight: theme.layout.component.inputMedium,
  },

  // Financial specific styles
  financial: {
    balance: {
      fontSize: theme.typography.textStyles.balance.fontSize,
      fontWeight: theme.typography.textStyles.balance.fontWeight,
      color: theme.colors.financial.balance,
    },
    income: {
      color: theme.colors.financial.income,
      fontSize: theme.typography.textStyles.amount.fontSize,
      fontWeight: theme.typography.textStyles.amount.fontWeight,
    },
    expense: {
      color: theme.colors.financial.expense,
      fontSize: theme.typography.textStyles.amount.fontSize,
      fontWeight: theme.typography.textStyles.amount.fontWeight,
    },
  },

  // Status styles
  status: {
    pending: {
      backgroundColor: theme.colors.semantic.warningLight,
      color: theme.colors.semantic.warning,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.layout.component.radiusSmall,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
    },
    completed: {
      backgroundColor: theme.colors.semantic.successLight,
      color: theme.colors.semantic.success,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.layout.component.radiusSmall,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
    },
    failed: {
      backgroundColor: theme.colors.semantic.errorLight,
      color: theme.colors.semantic.error,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.layout.component.radiusSmall,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
    },
  },
});

// Screen specific styles
export const createScreenStyles = (theme: Theme) => ({
  // Login/Register screens
  auth: {
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
      paddingHorizontal: theme.spacing.screen.horizontal,
      justifyContent: 'center' as const,
    },
    title: {
      fontSize: theme.typography.textStyles.h1.fontSize,
      fontWeight: theme.typography.textStyles.h1.fontWeight,
      color: theme.colors.text.primary,
      textAlign: 'center' as const,
      marginBottom: theme.spacing.lg,
    },
    subtitle: {
      fontSize: theme.typography.textStyles.bodyLarge.fontSize,
      color: theme.colors.text.secondary,
      textAlign: 'center' as const,
      marginBottom: theme.spacing.xl,
    },
  },

  // Dashboard screen
  dashboard: {
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    header: {
      backgroundColor: theme.colors.primary.main,
      paddingTop: theme.spacing.screen.top,
      paddingHorizontal: theme.spacing.screen.horizontal,
      paddingBottom: theme.spacing.lg,
    },
    balanceCard: {
      backgroundColor: theme.colors.background.primary,
      margin: theme.spacing.md,
      borderRadius: theme.layout.component.radiusLarge,
      padding: theme.spacing.lg,
      shadowColor: theme.colors.shadow.colored,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    },
  },

  // Transaction screens
  transaction: {
    listItem: {
      backgroundColor: theme.colors.background.primary,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.screen.horizontal,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.light,
    },
    amount: {
      fontSize: theme.typography.textStyles.amount.fontSize,
      fontWeight: theme.typography.textStyles.amount.fontWeight,
    },
  },
});

// Export everything
export { Colors, Typography, Spacing, Layout, Animation };
export default defaultTheme; 