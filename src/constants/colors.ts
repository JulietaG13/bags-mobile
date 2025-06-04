// Color System for Bags Mobile - Minimal Black & White Design
// Primary colors are black and white, with colored utilities for semantic states

export const Colors = {
  // Primary Brand Colors (Black & White)
  primary: {
    main: '#000000',        // Pure black
    dark: '#000000',        // Black for pressed states
    light: '#333333',       // Dark gray for backgrounds
    50: '#FAFAFA',          // Very light gray
    100: '#F5F5F5',         // Light gray
    200: '#EEEEEE',         // Medium light gray
    300: '#E0E0E0',         // Medium gray
    400: '#BDBDBD',         // Medium dark gray
    500: '#9E9E9E',         // Gray
    600: '#757575',         // Dark gray
    700: '#616161',         // Darker gray
    800: '#424242',         // Very dark gray
    900: '#212121',         // Almost black
  },

  // Secondary Colors (White & Light Grays)
  secondary: {
    main: '#FFFFFF',        // Pure white
    dark: '#F5F5F5',        // Light gray
    light: '#FAFAFA',       // Very light gray
    50: '#FFFFFF',
    100: '#FAFAFA',
    200: '#F5F5F5',
    300: '#EEEEEE',
    400: '#E0E0E0',
    500: '#BDBDBD',
    600: '#9E9E9E',
    700: '#757575',
    800: '#616161',
    900: '#424242',
  },

  // Semantic Colors (Keep colors for utility)
  semantic: {
    success: '#10B981',     // Green for positive actions
    warning: '#F59E0B',     // Amber for warnings
    error: '#EF4444',       // Red for errors
    info: '#3B82F6',        // Blue for information
    
    // Light variants
    successLight: '#D1FAE5',
    warningLight: '#FEF3C7',
    errorLight: '#FEE2E2',
    infoLight: '#DBEAFE',
  },

  // Neutral/Gray Scale (Expanded for B&W design)
  neutral: {
    white: '#FFFFFF',
    50: '#FAFAFA',          // Almost white
    100: '#F5F5F5',         // Very light gray
    200: '#EEEEEE',         // Light gray
    300: '#E0E0E0',         // Medium light gray
    400: '#BDBDBD',         // Medium gray
    500: '#9E9E9E',         // Medium dark gray
    600: '#757575',         // Dark gray
    700: '#616161',         // Very dark gray
    800: '#424242',         // Almost black
    900: '#212121',         // Very dark
    black: '#000000',
  },

  // Text Colors (Black & White focused)
  text: {
    primary: '#000000',     // Pure black text
    secondary: '#424242',   // Dark gray text
    tertiary: '#757575',    // Medium gray text
    inverse: '#FFFFFF',     // White text for dark backgrounds
    disabled: '#BDBDBD',    // Light gray for disabled text
    link: '#000000',        // Black links with underline
  },

  // Background Colors (White & Light Grays)
  background: {
    primary: '#FFFFFF',     // Pure white background
    secondary: '#FAFAFA',   // Very light gray background
    tertiary: '#F5F5F5',    // Light gray for cards and sections
    overlay: 'rgba(0, 0, 0, 0.5)', // Black overlay
  },

  // Financial Specific Colors (Keep utility colors)
  financial: {
    income: '#10B981',      // Green for income/positive
    expense: '#EF4444',     // Red for expenses/negative
    neutral: '#757575',     // Gray for neutral transactions
    balance: '#000000',     // Black for balance display
    
    // Card types (keep for recognition)
    visa: '#1A1F71',
    mastercard: '#FF5F00',
    amex: '#006FCF',
    generic: '#757575',
  },

  // Status Colors (Keep utility colors)
  status: {
    pending: '#F59E0B',     // Orange for pending
    completed: '#10B981',   // Green for completed
    failed: '#EF4444',      // Red for failed
    cancelled: '#757575',   // Gray for cancelled
  },

  // Border Colors (Grays)
  border: {
    light: '#EEEEEE',       // Light gray borders
    medium: '#E0E0E0',      // Medium gray borders
    dark: '#BDBDBD',        // Dark gray borders
    focus: '#000000',       // Black focus borders
  },

  // Shadow Colors (Black based)
  shadow: {
    light: 'rgba(0, 0, 0, 0.05)',
    medium: 'rgba(0, 0, 0, 0.1)',
    dark: 'rgba(0, 0, 0, 0.15)',
    colored: 'rgba(0, 0, 0, 0.15)', // Black shadow instead of colored
  },

  // Gradient Colors (Black to White gradients)
  gradients: {
    primary: ['#000000', '#424242'],      // Black to dark gray
    secondary: ['#FFFFFF', '#F5F5F5'],    // White to light gray
    sunset: ['#757575', '#BDBDBD'],       // Gray gradient
    ocean: ['#212121', '#616161'],        // Dark gray gradient
  },
} as const;

// Theme variants for light/dark mode support
export const LightTheme = {
  ...Colors,
  background: {
    primary: '#FFFFFF',     // Pure white
    secondary: '#FAFAFA',   // Very light gray  
    tertiary: '#F5F5F5',    // Light gray
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  text: {
    primary: '#000000',     // Pure black
    secondary: '#424242',   // Dark gray
    tertiary: '#757575',    // Medium gray
    inverse: '#FFFFFF',     // White
    disabled: '#BDBDBD',    // Light gray
    link: '#000000',        // Black
  },
};

export const DarkTheme = {
  ...Colors,
  background: {
    primary: '#000000',     // Pure black
    secondary: '#212121',   // Very dark gray
    tertiary: '#424242',    // Dark gray
    overlay: 'rgba(0, 0, 0, 0.8)',
  },
  text: {
    primary: '#FFFFFF',     // Pure white
    secondary: '#E0E0E0',   // Light gray
    tertiary: '#BDBDBD',    // Medium gray
    inverse: '#000000',     // Black
    disabled: '#757575',    // Dark gray
    link: '#FFFFFF',        // White
  },
};

// Export default as light theme
export default LightTheme; 