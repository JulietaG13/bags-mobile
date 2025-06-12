// Main Theme Configuration for Bags Mobile - Digital Wallet App
// Combines all design tokens into a cohesive theme system
// Minimal Black & White Design with Essential Utility Colors

import { Colors, LightTheme, DarkTheme } from './colors';
import { Typography } from './typography';
import { Spacing, Layout, Animation } from './spacing';

// Main theme interface with simplified color types
export interface Theme {
  colors: {
    primary: typeof Colors.primary;
    secondary: typeof Colors.secondary;
    semantic: {
      success: string;
      error: string;
      warning: string;
      info: string;
      successLight: string;
      errorLight: string;
      warningLight: string;
      infoLight: string;
    };
    neutral: typeof Colors.neutral;
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
      inverse: string;
      disabled: string;
      link: string;
      placeholder: string;
    };
    background: {
      primary: string;
      secondary: string;
      tertiary: string;
      quaternary: string;
      overlay: string;
      modal: string;
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

// Light theme configuration - Pure black and white
export const lightTheme: Theme = {
  colors: LightTheme,
  typography: Typography,
  spacing: Spacing,
  layout: Layout,
  animation: Animation,
  isDark: false,
};

// Dark theme configuration - Inverted black and white
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

// Common component styles using minimal theme
export const createStyles = (theme: Theme) => ({
  // Container styles - Pure backgrounds
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    paddingHorizontal: theme.spacing.screen.horizontal,
  },

  // Card styles - Minimal shadows and borders
  card: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.layout.component.radiusMedium,
    padding: theme.spacing.component.cardMedium,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    // Minimal shadow - black only
    shadowColor: theme.colors.shadow.medium,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 2,
  },

  // Elevated card - Slightly more shadow
  cardElevated: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.layout.component.radiusMedium,
    padding: theme.spacing.component.cardMedium,
    // Stronger shadow for important elements
    shadowColor: theme.colors.shadow.dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },

  // Button styles - Black and white only
  button: {
    primary: {
      backgroundColor: theme.colors.primary.main, // Pure black
      paddingVertical: theme.spacing.component.buttonMedium.vertical,
      paddingHorizontal: theme.spacing.component.buttonMedium.horizontal,
      borderRadius: theme.layout.component.radiusMedium,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      minHeight: theme.layout.component.buttonMedium,
    },
    secondary: {
      backgroundColor: theme.colors.background.primary, // White
      borderWidth: 1,
      borderColor: theme.colors.border.dark, // Visible border
      paddingVertical: theme.spacing.component.buttonMedium.vertical,
      paddingHorizontal: theme.spacing.component.buttonMedium.horizontal,
      borderRadius: theme.layout.component.radiusMedium,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      minHeight: theme.layout.component.buttonMedium,
    },
    tertiary: {
      backgroundColor: 'transparent',
      paddingVertical: theme.spacing.component.buttonMedium.vertical,
      paddingHorizontal: theme.spacing.component.buttonMedium.horizontal,
      borderRadius: theme.layout.component.radiusMedium,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      minHeight: theme.layout.component.buttonMedium,
    },
  },

  // Text styles - Black hierarchy
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
    tertiary: {
      color: theme.colors.text.tertiary,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.normal,
    },
    heading: {
      color: theme.colors.text.primary,
      fontSize: theme.typography.fontSize['2xl'],
      fontWeight: theme.typography.fontWeight.semibold,
    },
    inverse: {
      color: theme.colors.text.inverse,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.normal,
    },
  },

  // Input styles - Clean borders
  input: {
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    borderRadius: theme.layout.component.radiusMedium,
    paddingVertical: theme.spacing.component.inputMedium.vertical,
    paddingHorizontal: theme.spacing.component.inputMedium.horizontal,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    minHeight: theme.layout.component.inputMedium,
  },

  // Input focused state
  inputFocused: {
    borderColor: theme.colors.border.focus, // Black border on focus
    borderWidth: 2,
  },

  // Financial specific styles - Minimal colors
  financial: {
    balance: {
      fontSize: theme.typography.textStyles.balance.fontSize,
      fontWeight: theme.typography.textStyles.balance.fontWeight,
      color: theme.colors.financial.balance, // Pure black
    },
    positive: {
      color: theme.colors.financial.positive, // Green - utility only
      fontSize: theme.typography.textStyles.amount.fontSize,
      fontWeight: theme.typography.textStyles.amount.fontWeight,
    },
    negative: {
      color: theme.colors.financial.negative, // Red - utility only
      fontSize: theme.typography.textStyles.amount.fontSize,
      fontWeight: theme.typography.textStyles.amount.fontWeight,
    },
    neutral: {
      color: theme.colors.financial.neutral, // Black
      fontSize: theme.typography.textStyles.amount.fontSize,
      fontWeight: theme.typography.textStyles.amount.fontWeight,
    },
  },

  // Status styles - Minimal utility colors
  status: {
    pending: {
      backgroundColor: theme.colors.background.tertiary, // Light gray bg
      color: theme.colors.status.pending, // Gray text
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.layout.component.radiusSmall,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
    },
    completed: {
      backgroundColor: theme.colors.semantic.successLight, // Very subtle green
      color: theme.colors.semantic.success, // Green text - utility
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.layout.component.radiusSmall,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
    },
    failed: {
      backgroundColor: theme.colors.semantic.errorLight, // Very subtle red
      color: theme.colors.semantic.error, // Red text - utility
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.layout.component.radiusSmall,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
    },
    processing: {
      backgroundColor: theme.colors.background.quaternary, // Darker gray bg
      color: theme.colors.status.processing, // Dark gray text
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.layout.component.radiusSmall,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
    },
  },

  // Divider styles
  divider: {
    height: 1,
    backgroundColor: theme.colors.border.divider,
  },

  dividerMedium: {
    height: 1,
    backgroundColor: theme.colors.border.light,
  },

  dividerStrong: {
    height: 1,
    backgroundColor: theme.colors.border.medium,
  },
});

// Screen specific styles - Minimal design
export const createScreenStyles = (theme: Theme) => ({
  // Login/Register screens - Clean and minimal
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

  // Dashboard screen - Pure white with black accents
  dashboard: {
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    header: {
      backgroundColor: theme.colors.background.primary, // White header
      paddingTop: theme.spacing.screen.top,
      paddingHorizontal: theme.spacing.screen.horizontal,
      paddingBottom: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.light,
    },
    balanceCard: {
      backgroundColor: theme.colors.background.primary,
      margin: theme.spacing.md,
      borderRadius: theme.layout.component.radiusLarge,
      padding: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border.light,
      shadowColor: theme.colors.shadow.dark,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 4,
      elevation: 4,
    },
  },

  // Transaction screens - Clean list design
  transaction: {
    listItem: {
      backgroundColor: theme.colors.background.primary,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.screen.horizontal,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.divider,
    },
    amount: {
      fontSize: theme.typography.textStyles.amount.fontSize,
      fontWeight: theme.typography.textStyles.amount.fontWeight,
    },
  },

  // Modal styles - Clean overlay
  modal: {
    overlay: {
      flex: 1,
      backgroundColor: theme.colors.background.overlay,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      paddingHorizontal: theme.spacing.lg,
    },
    container: {
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.layout.component.radiusLarge,
      padding: theme.spacing.lg,
      maxWidth: '90%',
      width: '100%',
      shadowColor: theme.colors.shadow.strong,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 8,
    },
  },
});

// Export everything
export { Colors, Typography, Spacing, Layout, Animation };
export default defaultTheme; 